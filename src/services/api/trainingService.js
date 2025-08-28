import trainingSessionsData from "@/services/mockData/trainingSessions.json";

class TrainingService {
  constructor() {
    this.sessions = [...trainingSessionsData];
  }

  async getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.sessions]);
      }, 300);
    });
  }

  async getById(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const session = this.sessions.find(item => item.Id === parseInt(id));
        if (session) {
          resolve({ ...session });
        } else {
          reject(new Error("Training session not found"));
        }
      }, 200);
    });
  }

  async create(session) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newSession = {
          ...session,
          Id: Math.max(...this.sessions.map(s => s.Id)) + 1,
          startedAt: new Date().toISOString(),
          status: "running",
          progress: 0
        };
        this.sessions.push(newSession);
        resolve({ ...newSession });
      }, 300);
    });
  }

  async updateProgress(id, progress) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.sessions.findIndex(item => item.Id === parseInt(id));
        if (index !== -1) {
          this.sessions[index] = { 
            ...this.sessions[index], 
            progress,
            lastUpdated: new Date().toISOString()
          };
          resolve({ ...this.sessions[index] });
        } else {
          reject(new Error("Training session not found"));
        }
      }, 100);
    });
  }

  async complete(id, finalMetrics) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.sessions.findIndex(item => item.Id === parseInt(id));
        if (index !== -1) {
          this.sessions[index] = { 
            ...this.sessions[index], 
            status: "completed",
            progress: 100,
            completedAt: new Date().toISOString(),
            metrics: finalMetrics
          };
          resolve({ ...this.sessions[index] });
        } else {
          reject(new Error("Training session not found"));
        }
      }, 200);
    });
  }

  async stop(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.sessions.findIndex(item => item.Id === parseInt(id));
        if (index !== -1) {
          this.sessions[index] = { 
            ...this.sessions[index], 
            status: "stopped",
            stoppedAt: new Date().toISOString()
          };
          resolve({ ...this.sessions[index] });
        } else {
          reject(new Error("Training session not found"));
        }
      }, 200);
    });
  }

  async delete(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = this.sessions.findIndex(item => item.Id === parseInt(id));
        if (index !== -1) {
          this.sessions.splice(index, 1);
          resolve(true);
        } else {
          reject(new Error("Training session not found"));
        }
      }, 300);
    });
  }
}

export default new TrainingService();