import datasetsData from "@/services/mockData/datasets.json";

class DatasetService {
  constructor() {
    this.datasets = [...datasetsData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.datasets]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const dataset = this.datasets.find(item => item.Id === parseInt(id));
        if (dataset) {
          resolve({ ...dataset });
        } else {
          reject(new Error("Dataset not found"));
        }
      }, 200);
    });
  }

  async create(dataset) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newDataset = {
          ...dataset,
          Id: Math.max(...this.datasets.map(d => d.Id)) + 1,
          uploadedAt: new Date().toISOString()
        };
        this.datasets.push(newDataset);
        resolve({ ...newDataset });
      }, 500);
    });
  }

  async update(id, data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.datasets.findIndex(item => item.Id === parseInt(id));
        if (index !== -1) {
          this.datasets[index] = { ...this.datasets[index], ...data };
          resolve({ ...this.datasets[index] });
        } else {
          reject(new Error("Dataset not found"));
        }
      }, 300);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.datasets.findIndex(item => item.Id === parseInt(id));
        if (index !== -1) {
          this.datasets.splice(index, 1);
          resolve(true);
        } else {
          reject(new Error("Dataset not found"));
        }
      }, 300);
    });
  }

  async parseCSV(file) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate CSV parsing with sample data
        const sampleData = [
          { feature1: 1.2, feature2: 2.1, feature3: 0.8, target: 1 },
          { feature1: 2.1, feature2: 1.8, feature3: 1.2, target: 0 },
          { feature1: 0.9, feature2: 2.5, feature3: 0.6, target: 1 },
          { feature1: 1.8, feature2: 1.2, feature3: 1.5, target: 0 },
          { feature1: 2.3, feature2: 0.9, feature3: 1.8, target: 0 },
          { feature1: 0.7, feature2: 2.8, feature3: 0.4, target: 1 },
          { feature1: 1.6, feature2: 1.5, feature3: 1.1, target: 0 },
          { feature1: 2.0, feature2: 0.8, feature3: 1.9, target: 0 }
        ];

        const columns = Object.keys(sampleData[0]);
        const shape = {
          rows: sampleData.length,
          columns: columns.length
        };

        const dataset = {
          name: file.name,
          data: sampleData,
          columns: columns,
          shape: shape
        };

        resolve(dataset);
      }, 1000);
    });
  }
}

export default new DatasetService();