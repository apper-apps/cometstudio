import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import DataPage from "@/components/pages/DataPage";
import ModelPage from "@/components/pages/ModelPage";
import TrainingPage from "@/components/pages/TrainingPage";
import EvaluationPage from "@/components/pages/EvaluationPage";
import PredictionsPage from "@/components/pages/PredictionsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DataPage />} />
          <Route path="model" element={<ModelPage />} />
          <Route path="training" element={<TrainingPage />} />
          <Route path="evaluation" element={<EvaluationPage />} />
          <Route path="predictions" element={<PredictionsPage />} />
        </Route>
      </Routes>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        style={{ zIndex: 9999 }}
      />
    </BrowserRouter>
  );
}

export default App;