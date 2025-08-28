import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ModelSelector from "@/components/organisms/ModelSelector";
import ParameterTuning from "@/components/organisms/ParameterTuning";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import datasetService from "@/services/api/datasetService";
import modelService from "@/services/api/modelService";

const ModelPage = () => {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [modelType, setModelType] = useState("classification");
  const [selectedModel, setSelectedModel] = useState(null);
  const [parameters, setParameters] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await datasetService.getAll();
      setDatasets(data);
      if (data.length > 0) {
        setSelectedDataset(data[0]);
      }
    } catch (err) {
      setError("Failed to load datasets");
    } finally {
      setLoading(false);
    }
  };

  const handleModelSelect = (model) => {
    setSelectedModel(model);
    // Reset parameters when model changes
    setParameters({});
  };

  const handleSaveModel = async () => {
    if (!selectedModel || !selectedDataset) {
      toast.error("Please select both a dataset and model");
      return;
    }

    setSaving(true);
    try {
      const modelConfig = {
        name: `${selectedModel.name} - ${selectedDataset.name}`,
        type: modelType,
        algorithm: selectedModel.id,
        parameters: parameters,
        datasetId: selectedDataset.Id
      };

      await modelService.create(modelConfig);
      toast.success("Model configuration saved successfully!");
    } catch (err) {
      toast.error("Failed to save model configuration");
    } finally {
      setSaving(false);
    }
  };

  const modelTypeOptions = [
    { value: "classification", label: "Classification" },
    { value: "regression", label: "Regression" }
  ];

  if (loading) {
    return <Loading variant="cards" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDatasets} />;
  }

  if (datasets.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Model Configuration</h1>
          <p className="text-slate-400">Configure your machine learning models</p>
        </div>
        
        <Card className="p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-slate-700 rounded-full flex items-center justify-center mb-4">
            <ApperIcon name="Database" size={32} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No datasets available</h3>
          <p className="text-slate-400 mb-4">Upload a dataset first to configure models</p>
          <Button variant="primary" onClick={() => window.location.href = "/"}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Upload Dataset
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Model Configuration</h1>
          <p className="text-slate-400">Configure your machine learning models</p>
        </div>
        
        {selectedModel && (
          <Button 
            variant="primary"
            onClick={handleSaveModel}
            disabled={saving}
          >
            {saving ? (
              <>
                <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <ApperIcon name="Save" size={16} className="mr-2" />
                Save Configuration
              </>
            )}
          </Button>
        )}
      </div>

      {/* Configuration Panel */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Model Setup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dataset Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Select Dataset
            </label>
            <Select
              value={selectedDataset?.Id || ""}
              onChange={(e) => {
                const dataset = datasets.find(d => d.Id === parseInt(e.target.value));
                setSelectedDataset(dataset);
              }}
              options={datasets.map(dataset => ({
                value: dataset.Id,
                label: `${dataset.name} (${dataset.shape.rows} rows)`
              }))}
            />
            {selectedDataset && (
              <div className="mt-2 p-3 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ApperIcon name="Info" size={14} className="text-primary" />
                  <span className="text-sm font-medium text-primary">Dataset Info</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Rows: {selectedDataset.shape.rows}</div>
                  <div>Columns: {selectedDataset.shape.columns}</div>
                  <div>Features: {selectedDataset.columns.join(", ")}</div>
                </div>
              </div>
            )}
          </div>

          {/* Model Type Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Problem Type
            </label>
            <Select
              value={modelType}
              onChange={(e) => {
                setModelType(e.target.value);
                setSelectedModel(null); // Reset model selection when type changes
              }}
              options={modelTypeOptions}
            />
            <div className="mt-2 p-3 bg-slate-800/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="HelpCircle" size={14} className="text-secondary" />
                <span className="text-sm font-medium text-secondary">
                  {modelType === "classification" ? "Classification" : "Regression"}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {modelType === "classification" 
                  ? "Predict categories or classes (e.g., spam/not spam, species type)"
                  : "Predict continuous values (e.g., prices, temperatures, scores)"
                }
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Model Selection */}
      <ModelSelector
        selectedModel={selectedModel}
        onModelSelect={handleModelSelect}
        modelType={modelType}
      />

      {/* Parameter Tuning */}
      {selectedModel && (
        <ParameterTuning
          selectedModel={selectedModel}
          parameters={parameters}
          onParameterChange={setParameters}
        />
      )}

      {/* Current Configuration Summary */}
      {selectedModel && selectedDataset && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Configuration Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Dataset</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name="Database" size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">{selectedDataset.name}</div>
                  <div className="text-xs text-slate-400">
                    {selectedDataset.shape.rows} × {selectedDataset.shape.columns}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Algorithm</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
                  <ApperIcon name={selectedModel.icon} size={20} className="text-white" />
                </div>
                <div>
                  <div className="text-white font-medium">{selectedModel.name}</div>
                  <Badge variant="info" className="text-xs mt-1">
                    {modelType}
                  </Badge>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-slate-300 mb-2">Parameters</h4>
              <div className="space-y-1">
                {Object.entries(parameters).length > 0 ? (
                  Object.entries(parameters).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-slate-400">{key}:</span>
                      <span className="text-white font-mono">{String(value)}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm">Default parameters</p>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}
    </motion.div>
  );
};

export default ModelPage;