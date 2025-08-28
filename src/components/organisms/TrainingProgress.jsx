import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ProgressBar from "@/components/atoms/ProgressBar";
import Badge from "@/components/atoms/Badge";
import Chart from "react-apexcharts";

const TrainingProgress = ({ 
  isTraining, 
  onStartTraining, 
  onStopTraining,
  selectedModel,
  trainingData 
}) => {
  const [progress, setProgress] = useState(0);
  const [epoch, setEpoch] = useState(0);
  const [loss, setLoss] = useState(1.0);
  const [accuracy, setAccuracy] = useState(0);
  const [lossHistory, setLossHistory] = useState([]);
  const [accuracyHistory, setAccuracyHistory] = useState([]);

  useEffect(() => {
    let interval;
    
    if (isTraining) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = Math.min(prev + Math.random() * 5, 100);
          const newEpoch = Math.floor(newProgress / 10) + 1;
          const newLoss = Math.max(0.01, 1 - (newProgress / 120) + Math.random() * 0.1);
          const newAccuracy = Math.min(0.99, (newProgress / 110) + Math.random() * 0.05);
          
          setEpoch(newEpoch);
          setLoss(newLoss);
          setAccuracy(newAccuracy);
          
          setLossHistory(prev => [...prev, newLoss].slice(-20));
          setAccuracyHistory(prev => [...prev, newAccuracy].slice(-20));
          
          if (newProgress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              onStopTraining();
            }, 1000);
          }
          
          return newProgress;
        });
      }, 500);
    }
    
    return () => clearInterval(interval);
  }, [isTraining, onStopTraining]);

  const chartOptions = {
    chart: {
      type: "line",
      height: 250,
      background: "transparent",
      toolbar: { show: false },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800
      }
    },
    theme: {
      mode: "dark"
    },
    stroke: {
      curve: "smooth",
      width: 3
    },
    grid: {
      borderColor: "#374151",
      strokeDashArray: 3
    },
    xaxis: {
      labels: { style: { colors: "#9CA3AF" } },
      axisBorder: { color: "#374151" },
      axisTicks: { color: "#374151" }
    },
    yaxis: {
      labels: { style: { colors: "#9CA3AF" } }
    },
    tooltip: {
      theme: "dark",
      style: {
        backgroundColor: "#1E293B"
      }
    },
    legend: {
      labels: { colors: "#9CA3AF" }
    }
  };

  const lossChartData = {
    ...chartOptions,
    colors: ["#EF4444"],
    series: [{
      name: "Loss",
      data: lossHistory.map((val, idx) => ({ x: idx + 1, y: val }))
    }],
    title: {
      text: "Training Loss",
      style: { color: "#F8FAFC", fontSize: "16px", fontWeight: "600" }
    }
  };

  const accuracyChartData = {
    ...chartOptions,
    colors: ["#10B981"],
    series: [{
      name: "Accuracy",
      data: accuracyHistory.map((val, idx) => ({ x: idx + 1, y: val }))
    }],
    title: {
      text: "Training Accuracy",
      style: { color: "#F8FAFC", fontSize: "16px", fontWeight: "600" }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white mb-2">Model Training</h3>
          <p className="text-slate-400">Train your selected model with the uploaded dataset</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant={isTraining ? "warning" : (progress === 100 ? "success" : "default")}>
            {isTraining ? "Training" : (progress === 100 ? "Completed" : "Ready")}
          </Badge>
          
          {!isTraining && progress < 100 && (
            <Button
              onClick={onStartTraining}
              variant="primary"
              disabled={!selectedModel}
            >
              <ApperIcon name="Play" size={16} className="mr-2" />
              Start Training
            </Button>
          )}
          
          {isTraining && (
            <Button
              onClick={onStopTraining}
              variant="danger"
            >
              <ApperIcon name="Square" size={16} className="mr-2" />
              Stop Training
            </Button>
          )}
        </div>
      </div>

      {/* Training Status */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {epoch}
            </div>
            <div className="text-sm text-slate-400">Epoch</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-error mb-1">
              {loss.toFixed(4)}
            </div>
            <div className="text-sm text-slate-400">Loss</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {(accuracy * 100).toFixed(2)}%
            </div>
            <div className="text-sm text-slate-400">Accuracy</div>
          </div>
        </div>
        
        <ProgressBar 
          value={progress} 
          showValue 
          animated 
          className="mb-4" 
        />
        
        {isTraining && (
          <motion.div
            className="flex items-center justify-center text-primary"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ApperIcon name="Zap" size={16} className="mr-2" />
            Training in progress...
          </motion.div>
        )}
      </Card>

      {/* Training Charts */}
      {(isTraining || progress > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <Chart
              options={lossChartData}
              series={lossChartData.series}
              type="line"
              height={250}
            />
          </Card>
          
          <Card className="p-6">
            <Chart
              options={accuracyChartData}
              series={accuracyChartData.series}
              type="line"
              height={250}
            />
          </Card>
        </div>
      )}

      {/* Model Configuration */}
      {selectedModel && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Training Configuration</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="text-sm font-medium text-slate-300 mb-2">Model</h5>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <ApperIcon name={selectedModel.icon} size={16} className="text-white" />
                </div>
                <span className="text-white">{selectedModel.name}</span>
              </div>
            </div>
            
            <div>
              <h5 className="text-sm font-medium text-slate-300 mb-2">Dataset</h5>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-600 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Database" size={16} className="text-slate-300" />
                </div>
                <span className="text-white">
                  {trainingData?.shape ? 
                    `${trainingData.shape.rows} rows × ${trainingData.shape.columns} columns` : 
                    "No dataset loaded"
                  }
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TrainingProgress;