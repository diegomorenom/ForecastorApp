import React, { useState } from 'react';
import './App.css'; // Import the CSS file
import SingleFileUploader from './components/SingleFileUploader';
import ForecastForm from './components/ForecastForm'; // Import the ForecastForm component
import TimeSeriesContainer from './components/TimeSeriesContainer';

// Import necessary packages for Chart.js
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';

// Register the date adapter and other necessary chart elements
Chart.register(...registerables);

function App() {
  const [step, setStep] = useState(1);
  const [forecastDays, setForecastDays] = useState(0);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const handleFileUploadSuccess = () => {
    setStep(2);
  };

  const handleFormSubmit = (days: number, models: string[]) => {
    setForecastDays(days);
    setSelectedModels(models);
    setStep(3);
  };

  const handleStartOver = () => {
    setStep(1);
    setForecastDays(0);
    setSelectedModels([]);
  };

  return (
    <div className="app-container"> {/* Apply styles from CSS */}
      <img src="./src/assets/ForecastorWeb.png" alt="Forecastor, time series" className="app-logo"></img>
      {step === 1 && (
        <>
          <h2 className="upload-heading">Upload your time series file.</h2>
          <SingleFileUploader onSuccess={handleFileUploadSuccess} />
        </>
      )}
      {step === 2 && (
        <>
          <h2 className="upload-heading">Enter forecast details</h2>
          <ForecastForm onSubmit={handleFormSubmit} />
        </>
      )}
      {step === 3 && (
        <>
          <h2 className="upload-heading">Time series forecast result</h2>
          <TimeSeriesContainer/>
        </>
      )}
      {step === 4 && (
        <>
          <h2 className="upload-heading">Forecast Again</h2>
          <button onClick={handleStartOver}>Forecast Again</button>
        </>
      )}
      {step !== 4 && (
        <button onClick={() => setStep(step + 1)}>Next</button>
      )}
    </div>
  );
}

export default App;
