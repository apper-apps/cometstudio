import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const ModelSelector = ({ selectedModel, onModelSelect, modelType = "classification" }) => {
  const classificationModels = [
    {
      id: "logistic_regression",
      name: "Logistic Regression",
      description: "Simple and interpretable linear classifier",
      complexity: "Low",
      icon: "TrendingUp",
      pros: ["Fast training", "Interpretable", "Good baseline"],
      cons: ["Linear assumptions", "Limited complexity"]
    },
    {
      id: "decision_tree",
      name: "Decision Tree",
      description: "Tree-based model with high interpretability",
      complexity: "Medium",
      icon: "GitBranch",
      pros: ["Easy to understand", "No assumptions", "Handles mixed data"],
      cons: ["Prone to overfitting", "Unstable"]
    },
    {
      id: "random_forest",
      name: "Random Forest",
      description: "Ensemble of decision trees with better generalization",
      complexity: "Medium",
      icon: "Trees",
      pros: ["Robust", "Good performance", "Feature importance"],
      cons: ["Less interpretable", "Memory intensive"]
    },
    {
      id: "svm",
      name: "Support Vector Machine",
      description: "Powerful classifier with kernel support",
      complexity: "High",
      icon: "Zap",
      pros: ["Effective in high dimensions", "Memory efficient"],
      cons: ["Slow on large datasets", "Sensitive to scaling"]
    }
  ];

  const regressionModels = [
    {
      id: "linear_regression",
      name: "Linear Regression",
      description: "Simple linear relationship modeling",
      complexity: "Low",
      icon: "TrendingUp",
      pros: ["Fast training", "Interpretable", "Good baseline"],
      cons: ["Linear assumptions", "Sensitive to outliers"]
    },
    {
      id: "decision_tree_reg",
      name: "Decision Tree Regressor",
      description: "Tree-based regression model",
      complexity: "Medium",
      icon: "GitBranch",
      pros: ["No assumptions", "Handles non-linear", "Interpretable"],
      cons: ["Prone to overfitting", "Unstable"]
    },
    {
      id: "random_forest_reg",
      name: "Random Forest Regressor",
      description: "Ensemble regression with reduced overfitting",
      complexity: "Medium",
      icon: "Trees",
      pros: ["Robust", "Good performance", "Less overfitting"],
      cons: ["Less interpretable", "Memory intensive"]
    },
    {
      id: "svr",
      name: "Support Vector Regression",
      description: "SVM adapted for regression tasks",
      complexity: "High",
      icon: "Zap",
      pros: ["Non-linear relationships", "Robust to outliers"],
      cons: ["Slow training", "Parameter tuning needed"]
    }
  ];

  const models = modelType === "classification" ? classificationModels : regressionModels;

  const getComplexityColor = (complexity) => {
    switch (complexity) {
      case "Low": return "success";
      case "Medium": return "warning";
      case "High": return "error";
      default: return "default";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">Choose Your Algorithm</h3>
        <p className="text-slate-400">Select the machine learning algorithm that best fits your problem</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {models.map((model, index) => {
          const isSelected = selectedModel?.id === model.id;
          
          return (
            <motion.div
              key={model.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                clickable
                className={cn(
                  "p-6 cursor-pointer transition-all duration-300",
                  isSelected 
                    ? "ring-2 ring-primary bg-primary/5" 
                    : "hover:ring-1 hover:ring-primary/50"
                )}
                onClick={() => onModelSelect(model)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    isSelected 
                      ? "bg-gradient-primary" 
                      : "bg-slate-700"
                  )}>
                    <ApperIcon 
                      name={model.icon} 
                      size={24} 
                      className={isSelected ? "text-white" : "text-slate-300"} 
                    />
                  </div>
                  <Badge variant={getComplexityColor(model.complexity)}>
                    {model.complexity} Complexity
                  </Badge>
                </div>

                <h4 className="text-lg font-semibold text-white mb-2">
                  {model.name}
                </h4>
                <p className="text-slate-400 text-sm mb-4">
                  {model.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h5 className="text-xs font-medium text-success mb-2 flex items-center">
                      <ApperIcon name="Plus" size={12} className="mr-1" />
                      Pros
                    </h5>
                    <ul className="text-xs text-slate-400 space-y-1">
                      {model.pros.map((pro, idx) => (
                        <li key={idx}>• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-xs font-medium text-error mb-2 flex items-center">
                      <ApperIcon name="Minus" size={12} className="mr-1" />
                      Cons
                    </h5>
                    <ul className="text-xs text-slate-400 space-y-1">
                      {model.cons.map((con, idx) => (
                        <li key={idx}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {isSelected && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-4 flex items-center justify-center text-primary text-sm font-medium"
                  >
                    <ApperIcon name="Check" size={16} className="mr-2" />
                    Selected
                  </motion.div>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ModelSelector;