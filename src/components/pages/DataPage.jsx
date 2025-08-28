import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import FileUpload from "@/components/molecules/FileUpload";
import DataTable from "@/components/molecules/DataTable";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Chart from "react-apexcharts";
import datasetService from "@/services/api/datasetService";

const DataPage = () => {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await datasetService.getAll();
      setDatasets(data);
      if (data.length > 0 && !selectedDataset) {
        setSelectedDataset(data[0]);
      }
    } catch (err) {
      setError("Failed to load datasets");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    setUploadLoading(true);
    try {
      const parsedData = await datasetService.parseCSV(file);
      const newDataset = await datasetService.create(parsedData);
      setDatasets(prev => [...prev, newDataset]);
      setSelectedDataset(newDataset);
      toast.success("Dataset uploaded successfully!");
    } catch (err) {
      toast.error("Failed to upload dataset");
    } finally {
      setUploadLoading(false);
    }
  };

  const getDataTypeAnalysis = (data) => {
    if (!data || data.length === 0) return {};
    
    const columns = Object.keys(data[0]);
    const analysis = {};
    
    columns.forEach(col => {
      const values = data.map(row => row[col]).filter(val => val !== null && val !== undefined);
      const numericValues = values.filter(val => !isNaN(val));
      
      if (numericValues.length / values.length > 0.8) {
        analysis[col] = {
          type: "numeric",
          min: Math.min(...numericValues),
          max: Math.max(...numericValues),
          mean: numericValues.reduce((a, b) => a + b, 0) / numericValues.length
        };
      } else {
        const uniqueValues = [...new Set(values)];
        analysis[col] = {
          type: "categorical",
          unique: uniqueValues.length,
          values: uniqueValues.slice(0, 5)
        };
      }
    });
    
    return analysis;
  };

  const createDistributionChart = (column, analysis) => {
    if (analysis.type === "numeric") {
      // Create histogram data
      const values = selectedDataset.data.map(row => row[column]).filter(val => !isNaN(val));
      const bins = 10;
      const binSize = (analysis.max - analysis.min) / bins;
      const histogram = Array(bins).fill(0);
      
      values.forEach(val => {
        const binIndex = Math.min(Math.floor((val - analysis.min) / binSize), bins - 1);
        histogram[binIndex]++;
      });

      return {
        chart: { type: "bar", background: "transparent", toolbar: { show: false } },
        theme: { mode: "dark" },
        plotOptions: { bar: { borderRadius: 4 } },
        colors: ["#6366F1"],
        xaxis: { 
          categories: histogram.map((_, i) => 
            `${(analysis.min + i * binSize).toFixed(1)}-${(analysis.min + (i + 1) * binSize).toFixed(1)}`
          ),
          labels: { style: { colors: "#9CA3AF" } }
        },
        yaxis: { labels: { style: { colors: "#9CA3AF" } } },
        grid: { borderColor: "#374151" },
        title: {
          text: `${column} Distribution`,
          style: { color: "#F8FAFC", fontSize: "14px" }
        },
        series: [{ name: "Frequency", data: histogram }]
      };
    } else {
      // Create bar chart for categorical data
      const valueCounts = {};
      selectedDataset.data.forEach(row => {
        const val = row[column];
        valueCounts[val] = (valueCounts[val] || 0) + 1;
      });

      const sortedEntries = Object.entries(valueCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8);

      return {
        chart: { type: "bar", background: "transparent", toolbar: { show: false } },
        theme: { mode: "dark" },
        plotOptions: { bar: { borderRadius: 4, horizontal: true } },
        colors: ["#8B5CF6"],
        xaxis: { labels: { style: { colors: "#9CA3AF" } } },
        yaxis: { 
          categories: sortedEntries.map(([key]) => key),
          labels: { style: { colors: "#9CA3AF" } }
        },
        grid: { borderColor: "#374151" },
        title: {
          text: `${column} Distribution`,
          style: { color: "#F8FAFC", fontSize: "14px" }
        },
        series: [{ name: "Count", data: sortedEntries.map(([, count]) => count) }]
      };
    }
  };

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
          <h1 className="text-3xl font-bold text-gradient mb-2">Data Management</h1>
          <p className="text-slate-400">Upload and explore your datasets to get started with machine learning</p>
        </div>
        
        <Empty
          title="No datasets uploaded"
          description="Upload your first CSV dataset to begin building machine learning models"
          icon="Database"
          action={() => {}}
          actionLabel="Upload Dataset"
        />
        
        <FileUpload 
          onFileSelect={handleFileUpload}
          className="max-w-2xl mx-auto"
        />
        
        {uploadLoading && (
          <div className="max-w-2xl mx-auto">
            <Loading />
          </div>
        )}
      </div>
    );
  }

  const dataAnalysis = selectedDataset ? getDataTypeAnalysis(selectedDataset.data) : {};
  const numericColumns = Object.keys(dataAnalysis).filter(col => dataAnalysis[col].type === "numeric");
  const categoricalColumns = Object.keys(dataAnalysis).filter(col => dataAnalysis[col].type === "categorical");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient mb-2">Data Management</h1>
          <p className="text-slate-400">Upload and explore your datasets</p>
        </div>
        
        <Button 
          variant="primary"
          onClick={() => document.querySelector('input[type="file"]').click()}
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Upload Dataset
        </Button>
      </div>

      {/* Dataset Selection */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Available Datasets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {datasets.map((dataset) => (
            <motion.div
              key={dataset.Id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card
                clickable
                className={`p-4 cursor-pointer ${
                  selectedDataset?.Id === dataset.Id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => setSelectedDataset(dataset)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                    <ApperIcon name="Database" size={20} className="text-white" />
                  </div>
                  {selectedDataset?.Id === dataset.Id && (
                    <Badge variant="primary">Selected</Badge>
                  )}
                </div>
                <h4 className="font-medium text-white mb-1">{dataset.name}</h4>
                <p className="text-sm text-slate-400 mb-2">
                  {dataset.shape.rows} rows × {dataset.shape.columns} columns
                </p>
                <p className="text-xs text-slate-500">
                  Uploaded {new Date(dataset.uploadedAt).toLocaleDateString()}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* File Upload */}
      <div className="hidden">
        <FileUpload onFileSelect={handleFileUpload} />
      </div>

      {selectedDataset && (
        <>
          {/* Dataset Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <MetricCard
              title="Total Rows"
              value={selectedDataset.shape.rows}
              icon="BarChart3"
            />
            <MetricCard
              title="Total Columns"
              value={selectedDataset.shape.columns}
              icon="Columns"
            />
            <MetricCard
              title="Numeric Features"
              value={numericColumns.length}
              icon="Hash"
            />
            <MetricCard
              title="Categorical Features"
              value={categoricalColumns.length}
              icon="Tag"
            />
          </div>

          {/* Data Preview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Data Preview</h3>
            <DataTable
              data={selectedDataset.data}
              columns={selectedDataset.columns.map(col => ({
                key: col,
                label: col,
                render: (value) => (
                  <span className={dataAnalysis[col]?.type === "numeric" ? "font-mono" : ""}>
                    {typeof value === "number" ? value.toFixed(2) : value}
                  </span>
                )
              }))}
              maxRows={8}
            />
          </Card>

          {/* Column Statistics */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Column Statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(dataAnalysis).map(([column, stats]) => (
                <Card key={column} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-white">{column}</h4>
                    <Badge variant={stats.type === "numeric" ? "info" : "secondary"}>
                      {stats.type}
                    </Badge>
                  </div>
                  
                  {stats.type === "numeric" ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Min:</span>
                        <span className="text-white font-mono">{stats.min.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Max:</span>
                        <span className="text-white font-mono">{stats.max.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Mean:</span>
                        <span className="text-white font-mono">{stats.mean.toFixed(2)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Unique:</span>
                        <span className="text-white">{stats.unique}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Values:</span>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {stats.values.map((val, idx) => (
                            <Badge key={idx} variant="default" className="text-xs">
                              {val}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </Card>

          {/* Data Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(dataAnalysis).slice(0, 4).map(([column, stats]) => (
              <Card key={column} className="p-6">
                <Chart
                  options={createDistributionChart(column, stats)}
                  series={createDistributionChart(column, stats).series}
                  type={createDistributionChart(column, stats).chart.type}
                  height={250}
                />
              </Card>
            ))}
          </div>
        </>
      )}
    </motion.div>
  );
};

export default DataPage;