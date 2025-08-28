import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import modelService from "@/services/api/modelService";
import datasetService from "@/services/api/datasetService";

const PredictionsPage = () => {
  const [models, setModels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [inputValues, setInputValues] = useState({});
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [modelsData, datasetsData] = await Promise.all([
        modelService.getAll(),
        datasetService.getAll()
      ]);
      
      const trainedModels = modelsData.filter(model => model.status === "trained");
      setModels(trainedModels);
      setDatasets(datasetsData);
      
      if (trainedModels.length > 0) {
        setSelectedModel(trainedModels[0]);
        initializeInputs(trainedModels[0], datasetsData);
      }
    } catch (err) {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const initializeInputs = (model, datasetsData) => {
    // Find the dataset used for training
    const dataset = datasetsData.find(d => d.Id.toString() === model.datasetId?.toString());
    if (dataset && dataset.columns) {
      const inputs = {};
      // Initialize with sample values, excluding the target column
      const featureColumns = dataset.columns.filter(col => 
        !["target", "label", "class", "species", "price"].includes(col.toLowerCase())
      );
      
      featureColumns.forEach(col => {
        if (dataset.data && dataset.data.length > 0) {
          const sampleValue = dataset.data[0][col];
          inputs[col] = typeof sampleValue === "number" ? sampleValue : "";
        } else {
          inputs[col] = "";
        }
      });
      setInputValues(inputs);
    }
  };

  const handleModelChange = (modelId) => {
    const model = models.find(m => m.Id === parseInt(modelId));
    setSelectedModel(model);
    if (model) {
      initializeInputs(model, datasets);
    }
    setPrediction(null);
  };

  const handleInputChange = (field, value) => {
    setInputValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePredict = async () => {
    if (!selectedModel) {
      toast.error("Please select a trained model");
      return;
    }

    // Validate inputs
    const emptyFields = Object.entries(inputValues).filter(([key, value]) => 
      value === "" || value === null || value === undefined
    );

    if (emptyFields.length > 0) {
      toast.error("Please fill in all input fields");
      return;
    }

    setPredicting(true);
    try {
      const result = await modelService.predict(selectedModel.Id, inputValues);
      setPrediction(result);
      toast.success("Prediction completed successfully!");
    } catch (err) {
      toast.error("Failed to make prediction");
    } finally {
      setPredicting(false);
    }
  };

  const renderPredictionResult = () => {
    if (!prediction) return null;

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-6"
      >
        <Card className="p-6 border-2 border-primary/30 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">Prediction Result</h3>
            <Badge variant="success">
              <ApperIcon name="CheckCircle" size={14} className="mr-1" />
              Success
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Predicted Value</h4>
              <div className="text-3xl font-bold text-gradient mb-2">
                {selectedModel.type === "classification" 
                  ? `Class ${prediction.result}`
                  : prediction.result.toFixed(2)
                }
              </div>
              <p className="text-sm text-slate-400">
                {selectedModel.type === "classification" ? "Classification" : "Regression"} result
              </p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Confidence</h4>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-slate-700 rounded-full h-3 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${prediction.confidence * 100}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <span className="text-white font-semibold">
                  {(prediction.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {selectedModel.type === "classification" && prediction.probabilities && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-slate-300 mb-3">Class Probabilities</h4>
              <div className="space-y-2">
                {Object.entries(prediction.probabilities).map(([className, prob], index) => (
                  <motion.div
                    key={className}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-16 text-sm text-slate-300">
                      {className.replace('_', ' ')}
                    </div>
                    <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-primary rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${prob * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                    <div className="w-12 text-sm text-white text-right">
                      {(prob * 100).toFixed(0)}%
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    );
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  if (models.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Model Predictions</h1>
          <p className="text-slate-400">Make predictions with your trained models</p>
        </div>
        
        <Card className="p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-slate-700 rounded-full flex items-center justify-center mb-4">
            <ApperIcon name="Target" size={32} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No trained models available</h3>
          <p className="text-slate-400 mb-4">Train a model first to make predictions</p>
          <Button variant="primary" onClick={() => window.location.href = "/training"}>
            <ApperIcon name="Zap" size={16} className="mr-2" />
            Start Training
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient mb-2">Model Predictions</h1>
        <p className="text-slate-400">Make predictions with your trained models</p>
      </div>

      {/* Model Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Select Model</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Trained Model"
            value={selectedModel?.Id || ""}
            onChange={(e) => handleModelChange(e.target.value)}
            options={models.map(model => ({
              value: model.Id,
              label: `${model.name} (${model.algorithm.replace('_', ' ')})`
            }))}
          />
          
          {selectedModel && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Model Info
              </label>
              <div className="p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="info" className="capitalize">
                    {selectedModel.type}
                  </Badge>
                  <Badge variant="success">Trained</Badge>
                </div>
                <p className="text-xs text-slate-400">
                  Accuracy: {(selectedModel.metrics.accuracy * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Input Form */}
      {selectedModel && Object.keys(inputValues).length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Input Features</h3>
              <p className="text-slate-400">Enter values for all features to make a prediction</p>
            </div>
            <Button
              variant="primary"
              onClick={handlePredict}
              disabled={predicting}
            >
              {predicting ? (
                <>
                  <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Predicting...
                </>
              ) : (
                <>
                  <ApperIcon name="Zap" size={16} className="mr-2" />
                  Make Prediction
                </>
              )}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(inputValues).map(([field, value]) => (
              <Input
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
                type="number"
                step="any"
                value={value}
                onChange={(e) => handleInputChange(field, parseFloat(e.target.value) || "")}
                placeholder={`Enter ${field}`}
              />
            ))}
          </div>
        </Card>
      )}

      {/* Prediction Result */}
      {prediction && renderPredictionResult()}

      {/* Example Predictions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Examples</h3>
        <p className="text-slate-400 mb-4">Try these example inputs to see how the model performs</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Example 1", values: { feature1: 1.2, feature2: 2.1, feature3: 0.8 } },
            { name: "Example 2", values: { feature1: 2.1, feature2: 1.8, feature3: 1.2 } },
            { name: "Example 3", values: { feature1: 0.9, feature2: 2.5, feature3: 0.6 } }
          ].map((example, index) => (
            <motion.div key={example.name} whileHover={{ scale: 1.02 }}>
              <Card 
                clickable
                className="p-4 cursor-pointer"
                onClick={() => {
                  const newValues = { ...inputValues };
                  Object.entries(example.values).forEach(([key, val]) => {
                    if (key in newValues) {
                      newValues[key] = val;
                    }
                  });
                  setInputValues(newValues);
                  toast.success(`Applied ${example.name} values`);
                }}
              >
                <h4 className="font-medium text-white mb-2">{example.name}</h4>
                <div className="space-y-1 text-xs text-slate-400">
                  {Object.entries(example.values).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                      <span>{key}:</span>
                      <span className="font-mono">{val}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
};

export default PredictionsPage;