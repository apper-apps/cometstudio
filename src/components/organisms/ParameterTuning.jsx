import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Slider from "@/components/atoms/Slider";
import Select from "@/components/atoms/Select";

const ParameterTuning = ({ 
  selectedModel, 
  parameters, 
  onParameterChange 
}) => {
  if (!selectedModel) {
    return (
      <Card className="p-8 text-center">
        <p className="text-slate-400">Select a model to configure parameters</p>
      </Card>
    );
  }

  const getParameterConfig = (modelId) => {
    const configs = {
      logistic_regression: [
        {
          key: "C",
          label: "Regularization Strength (C)",
          type: "slider",
          min: 0.01,
          max: 10,
          step: 0.01,
          default: 1.0,
          description: "Inverse of regularization strength. Lower values specify stronger regularization."
        },
        {
          key: "max_iter",
          label: "Maximum Iterations",
          type: "slider",
          min: 100,
          max: 2000,
          step: 100,
          default: 1000,
          description: "Maximum number of iterations for solver convergence."
        }
      ],
      decision_tree: [
        {
          key: "max_depth",
          label: "Maximum Depth",
          type: "slider",
          min: 1,
          max: 20,
          step: 1,
          default: 5,
          description: "Maximum depth of the decision tree."
        },
        {
          key: "min_samples_split",
          label: "Min Samples Split",
          type: "slider",
          min: 2,
          max: 20,
          step: 1,
          default: 2,
          description: "Minimum number of samples required to split an internal node."
        },
        {
          key: "min_samples_leaf",
          label: "Min Samples Leaf",
          type: "slider",
          min: 1,
          max: 20,
          step: 1,
          default: 1,
          description: "Minimum number of samples required to be at a leaf node."
        }
      ],
      random_forest: [
        {
          key: "n_estimators",
          label: "Number of Trees",
          type: "slider",
          min: 10,
          max: 500,
          step: 10,
          default: 100,
          description: "Number of trees in the forest."
        },
        {
          key: "max_depth",
          label: "Maximum Depth",
          type: "slider",
          min: 1,
          max: 20,
          step: 1,
          default: 5,
          description: "Maximum depth of individual trees."
        },
        {
          key: "min_samples_split",
          label: "Min Samples Split",
          type: "slider",
          min: 2,
          max: 20,
          step: 1,
          default: 2,
          description: "Minimum samples required to split a node."
        }
      ],
      svm: [
        {
          key: "C",
          label: "Regularization Parameter (C)",
          type: "slider",
          min: 0.01,
          max: 10,
          step: 0.01,
          default: 1.0,
          description: "Penalty parameter of the error term."
        },
        {
          key: "kernel",
          label: "Kernel Type",
          type: "select",
          options: [
            { value: "linear", label: "Linear" },
            { value: "rbf", label: "RBF (Radial Basis Function)" },
            { value: "poly", label: "Polynomial" },
            { value: "sigmoid", label: "Sigmoid" }
          ],
          default: "rbf",
          description: "Kernel type to be used in the algorithm."
        }
      ],
      // Regression variants
      linear_regression: [
        {
          key: "fit_intercept",
          label: "Fit Intercept",
          type: "select",
          options: [
            { value: true, label: "Yes" },
            { value: false, label: "No" }
          ],
          default: true,
          description: "Whether to calculate the intercept for this model."
        }
      ],
      decision_tree_reg: [
        {
          key: "max_depth",
          label: "Maximum Depth",
          type: "slider",
          min: 1,
          max: 20,
          step: 1,
          default: 5,
          description: "Maximum depth of the decision tree."
        },
        {
          key: "min_samples_split",
          label: "Min Samples Split",
          type: "slider",
          min: 2,
          max: 20,
          step: 1,
          default: 2,
          description: "Minimum number of samples required to split an internal node."
        }
      ],
      random_forest_reg: [
        {
          key: "n_estimators",
          label: "Number of Trees",
          type: "slider",
          min: 10,
          max: 500,
          step: 10,
          default: 100,
          description: "Number of trees in the forest."
        },
        {
          key: "max_depth",
          label: "Maximum Depth",
          type: "slider",
          min: 1,
          max: 20,
          step: 1,
          default: 5,
          description: "Maximum depth of individual trees."
        }
      ],
      svr: [
        {
          key: "C",
          label: "Regularization Parameter (C)",
          type: "slider",
          min: 0.01,
          max: 10,
          step: 0.01,
          default: 1.0,
          description: "Penalty parameter of the error term."
        },
        {
          key: "epsilon",
          label: "Epsilon",
          type: "slider",
          min: 0.01,
          max: 1.0,
          step: 0.01,
          default: 0.1,
          description: "Epsilon in the epsilon-SVR model."
        }
      ]
    };
    
    return configs[modelId] || [];
  };

  const parameterConfig = getParameterConfig(selectedModel.id);

  const handleParameterChange = (key, value) => {
    onParameterChange({
      ...parameters,
      [key]: value
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">
          Configure {selectedModel.name}
        </h3>
        <p className="text-slate-400">
          Fine-tune the model parameters for optimal performance
        </p>
      </div>

      <Card className="p-6">
        <div className="grid gap-6">
          {parameterConfig.map((param, index) => (
            <motion.div
              key={param.key}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <div>
                <h4 className="text-sm font-medium text-white mb-1">
                  {param.label}
                </h4>
                <p className="text-xs text-slate-400">
                  {param.description}
                </p>
              </div>
              
              {param.type === "slider" ? (
                <Slider
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={parameters[param.key] || param.default}
                  onChange={(value) => handleParameterChange(param.key, value)}
                />
              ) : param.type === "select" ? (
                <Select
                  options={param.options}
                  value={parameters[param.key] || param.default}
                  onChange={(e) => handleParameterChange(param.key, e.target.value)}
                />
              ) : null}
            </motion.div>
          ))}
        </div>
        
        {parameterConfig.length === 0 && (
          <div className="text-center py-8">
            <p className="text-slate-400">
              This model has no configurable parameters
            </p>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ParameterTuning;