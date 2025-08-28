import modelsData from "@/services/mockData/models.json";

class ModelService {
  constructor() {
    this.models = [...modelsData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.models]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const model = this.models.find(item => item.Id === parseInt(id));
        if (model) {
          resolve({ ...model });
        } else {
          reject(new Error("Model not found"));
        }
      }, 200);
    });
  }

  async create(model) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newModel = {
          ...model,
          Id: Math.max(...this.models.map(m => m.Id)) + 1,
          createdAt: new Date().toISOString(),
          status: "configured"
        };
        this.models.push(newModel);
        resolve({ ...newModel });
      }, 400);
    });
  }

  async train(modelId, datasetId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const modelIndex = this.models.findIndex(m => m.Id === parseInt(modelId));
        if (modelIndex !== -1) {
          // Simulate training results
          const trainedModel = {
            ...this.models[modelIndex],
            status: "trained",
            trainedAt: new Date().toISOString(),
            metrics: {
              accuracy: 0.85 + Math.random() * 0.1,
              precision: 0.82 + Math.random() * 0.1,
              recall: 0.88 + Math.random() * 0.1,
              f1Score: 0.84 + Math.random() * 0.1,
              loss: 0.15 + Math.random() * 0.1
            }
          };
          
          this.models[modelIndex] = trainedModel;
          resolve({ ...trainedModel });
        }
      }, 2000);
    });
  }

  async predict(modelId, inputData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const model = this.models.find(m => m.Id === parseInt(modelId));
        if (!model || model.status !== "trained") {
          reject(new Error("Model not found or not trained"));
          return;
        }

        // Simulate prediction
        const prediction = {
          result: Math.random() > 0.5 ? 1 : 0,
          confidence: 0.7 + Math.random() * 0.3,
          probabilities: {
            class_0: Math.random(),
            class_1: Math.random()
          }
        };

        resolve(prediction);
      }, 500);
    });
  }

  async update(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.models.findIndex(item => item.Id === parseInt(id));
        if (index !== -1) {
          this.models[index] = { ...this.models[index], ...data };
          resolve({ ...this.models[index] });
        } else {
          reject(new Error("Model not found"));
        }
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.models.findIndex(item => item.Id === parseInt(id));
        if (index !== -1) {
          this.models.splice(index, 1);
          resolve(true);
        } else {
          reject(new Error("Model not found"));
        }
      }, 300);
    });
  }
}

export default new ModelService();