import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import TrainingProgress from "@/components/organisms/TrainingProgress";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import modelService from "@/services/api/modelService";
import datasetService from "@/services/api/datasetService";

const TrainingPage = () => {
  const [models, setModels] = useState([]);
  const [datasets, setDatasets] = useState([]);
  const [selectedModel, setSelectedModel] = useState(null);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [isTraining, setIsTraining] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      
      setModels(modelsData);
      setDatasets(datasetsData);
      
      // Auto-select first configured model and corresponding dataset
      const configuredModel = modelsData.find(m => m.status === "configured");
      if (configuredModel) {
        setSelectedModel(configuredModel);
        const dataset = datasetsData.find(d => d.Id.toString() === configuredModel.datasetId?.toString());
        if (dataset) {
          setSelectedDataset(dataset);
        }
      }
    } catch (err) {
      setError("Failed to load training data");
    } finally {
      setLoading(false);
    }
  };

  const handleStartTraining = async () => {
    if (!selectedModel || !selectedDataset) {
      toast.error("Please select both a model and dataset");
      return;
    }

    setIsTraining(true);
    toast.info("Training started!");
    
    try {
      // This would normally start the training process
      // For demo purposes, we'll let the TrainingProgress component handle the simulation
    } catch (err) {
      toast.error("Failed to start training");
      setIsTraining(false);
    }
  };

  const handleStopTraining = async () => {
    setIsTraining(false);
    toast.success("Training completed successfully!");
    
    // Update model status
    if (selectedModel) {
      try {
        await modelService.update(selectedModel.Id, { 
          status: "trained",
          trainedAt: new Date().toISOString()
        });
        loadData(); // Refresh data
      } catch (err) {
        console.error("Failed to update model status:", err);
      }
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadData} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gradient mb-2">Model Training</h1>
        <p className="text-slate-400">Train your machine learning models with real-time progress tracking</p>
      </div>

      {/* Training Interface */}
      <TrainingProgress
        isTraining={isTraining}
        onStartTraining={handleStartTraining}
        onStopTraining={handleStopTraining}
        selectedModel={selectedModel}
        trainingData={selectedDataset}
      />
    </motion.div>
  );
};

export default TrainingPage;