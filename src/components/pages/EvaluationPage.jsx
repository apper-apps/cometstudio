import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Chart from "react-apexcharts";
import modelService from "@/services/api/modelService";

const EvaluationPage = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await modelService.getAll();
      const trainedModels = data.filter(model => model.status === "trained");
      setModels(trainedModels);
      if (trainedModels.length > 0) {
        setSelectedModel(trainedModels[0]);
      }
    } catch (err) {
      setError("Failed to load models");
    } finally {
      setLoading(false);
    }
  };

  const generateConfusionMatrix = () => {
    // Simulate confusion matrix data for classification
    return {
      predicted: ["Class A", "Class B", "Class C"],
      actual: ["Class A", "Class B", "Class C"],
      matrix: [
        [45, 3, 2],    // Actual Class A
        [2, 38, 5],    // Actual Class B  
        [1, 4, 42]     // Actual Class C
      ]
    };
  };

  const generateROCCurve = () => {
    // Simulate ROC curve data
    const points = 20;
    const fpr = [];
    const tpr = [];
    
    for (let i = 0; i <= points; i++) {
      const x = i / points;
      fpr.push(x);
      // Simulate a good ROC curve (concave upward)
      tpr.push(Math.min(1, x * 1.8 - x * x * 0.5 + Math.random() * 0.1));
    }
    
    return { fpr, tpr };
  };

  const confusionMatrix = generateConfusionMatrix();
  const rocData = generateROCCurve();

  const confusionChartOptions = {
    chart: {
      type: "heatmap",
      background: "transparent",
      toolbar: { show: false }
    },
    theme: { mode: "dark" },
    dataLabels: {
      enabled: true,
      style: { colors: ["#FFFFFF"] }
    },
    colors: ["#6366F1"],
    xaxis: {
      categories: confusionMatrix.predicted,
      title: { text: "Predicted", style: { color: "#F8FAFC" } },
      labels: { style: { colors: "#9CA3AF" } }
    },
    yaxis: {
      categories: confusionMatrix.actual.reverse(),
      title: { text: "Actual", style: { color: "#F8FAFC" } },
      labels: { style: { colors: "#9CA3AF" } }
    },
    title: {
      text: "Confusion Matrix",
      style: { color: "#F8FAFC", fontSize: "18px", fontWeight: "600" }
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        colorScale: {
          ranges: [
            { from: 0, to: 20, color: "#1E293B", name: "Low" },
            { from: 21, to: 35, color: "#6366F1", name: "Medium" },
            { from: 36, to: 50, color: "#EC4899", name: "High" }
          ]
        }
      }
    }
  };

  const confusionSeries = confusionMatrix.matrix.reverse().map((row, i) => ({
    name: confusionMatrix.actual[i],
    data: row.map((value, j) => ({
      x: confusionMatrix.predicted[j],
      y: value
    }))
  }));

  const rocChartOptions = {
    chart: {
      type: "line",
      background: "transparent",
      toolbar: { show: false }
    },
    theme: { mode: "dark" },
    stroke: { 
      curve: "smooth",
      width: [3, 2]
    },
    colors: ["#EC4899", "#6B7280"],
    xaxis: {
      title: { text: "False Positive Rate", style: { color: "#F8FAFC" } },
      labels: { style: { colors: "#9CA3AF" } },
      min: 0,
      max: 1
    },
    yaxis: {
      title: { text: "True Positive Rate", style: { color: "#F8FAFC" } },
      labels: { style: { colors: "#9CA3AF" } },
      min: 0,
      max: 1
    },
    title: {
      text: "ROC Curve (AUC = 0.89)",
      style: { color: "#F8FAFC", fontSize: "18px", fontWeight: "600" }
    },
    grid: { borderColor: "#374151" },
    legend: { labels: { colors: "#9CA3AF" } }
  };

  const rocSeries = [
    {
      name: "ROC Curve",
      data: rocData.fpr.map((fpr, i) => ({ x: fpr, y: rocData.tpr[i] }))
    },
    {
      name: "Random Classifier",
      data: [{ x: 0, y: 0 }, { x: 1, y: 1 }]
    }
  ];

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadModels} />;
  }

  if (models.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Model Evaluation</h1>
          <p className="text-slate-400">Analyze your trained model performance</p>
        </div>
        
        <Card className="p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-slate-700 rounded-full flex items-center justify-center mb-4">
            <ApperIcon name="BarChart3" size={32} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No trained models available</h3>
          <p className="text-slate-400 mb-4">Train a model first to see evaluation metrics</p>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Model Evaluation</h1>
          <p className="text-slate-400">Analyze your trained model performance</p>
        </div>
        
        <div className="flex items-center gap-4">
          <Select
            label="Select Model"
            value={selectedModel?.Id || ""}
            onChange={(e) => {
              const model = models.find(m => m.Id === parseInt(e.target.value));
              setSelectedModel(model);
            }}
            options={models.map(model => ({
              value: model.Id,
              label: model.name
            }))}
            className="min-w-[200px]"
          />
        </div>
      </div>

      {selectedModel && (
        <>
          {/* Model Info */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Model Information</h3>
              <Badge variant="success">Trained</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2">Algorithm</h4>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Brain" size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">{selectedModel.name}</div>
                    <div className="text-xs text-slate-400 capitalize">{selectedModel.algorithm.replace('_', ' ')}</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2">Problem Type</h4>
                <Badge variant="info" className="capitalize">
                  {selectedModel.type}
                </Badge>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-slate-300 mb-2">Training Date</h4>
                <p className="text-white">
                  {new Date(selectedModel.trainedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>

          {/* Performance Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              title="Accuracy"
              value={selectedModel.metrics.accuracy}
              format="percentage"
              icon="Target"
              trend="up"
            />
            <MetricCard
              title="Precision"
              value={selectedModel.metrics.precision}
              format="percentage"
              icon="Crosshair"
              trend="up"
            />
            <MetricCard
              title="Recall"
              value={selectedModel.metrics.recall}
              format="percentage"
              icon="Search"
              trend="up"
            />
            <MetricCard
              title="F1 Score"
              value={selectedModel.metrics.f1Score}
              format="percentage"
              icon="Award"
              trend="up"
            />
          </div>

          {/* Visualizations */}
          {selectedModel.type === "classification" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <Chart
                  options={confusionChartOptions}
                  series={confusionSeries}
                  type="heatmap"
                  height={350}
                />
              </Card>
              
              <Card className="p-6">
                <Chart
                  options={rocChartOptions}
                  series={rocSeries}
                  type="line"
                  height={350}
                />
              </Card>
            </div>
          )}

          {/* Feature Importance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Feature Importance</h3>
            <div className="space-y-4">
              {[
                { name: "Feature 1", importance: 0.35 },
                { name: "Feature 2", importance: 0.28 },
                { name: "Feature 3", importance: 0.18 },
                { name: "Feature 4", importance: 0.12 },
                { name: "Feature 5", importance: 0.07 }
              ].map((feature, index) => (
                <motion.div
                  key={feature.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-20 text-sm text-slate-300">
                    {feature.name}
                  </div>
                  <div className="flex-1 bg-slate-700 rounded-full h-3 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-primary rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${feature.importance * 100}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                    />
                  </div>
                  <div className="w-12 text-sm text-white font-medium text-right">
                    {(feature.importance * 100).toFixed(0)}%
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </>
      )}
    </motion.div>
  );
};

export default EvaluationPage;