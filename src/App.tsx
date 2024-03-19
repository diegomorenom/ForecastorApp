import { useState } from 'react';
import './App.css';
import SingleFileUploader from './components/SingleFileUploader';
import ForecastForm from './components/ForecastForm';
import TimeSeriesContainer from './components/TimeSeriesContainer';
import logo from './ForecastorWeb.png'; // Import the logo image

// Import necessary packages for Chart.js
import { Chart, registerables } from 'chart.js';
import 'chartjs-adapter-moment';

// Register the date adapter and other necessary chart elements
Chart.register(...registerables);

function App() {
  const [step, setStep] = useState(1);

  const handleFileUploadSuccess = () => {
    setStep(2);
  };

  const handleFormSubmit = () => {
    setStep(3);
  };

  const handleStartOver = () => {
    setStep(1);
  };

  const handleNextStep = () => {
    setStep(step + 1);
  };

  return (
    <div className="app-container">
      <img src={logo} alt="Forecastor, time series" className="app-logo" />
      {step === 1 && (
        <>
          <h2 className="upload-heading">Step 1: Upload your time series csv file</h2>
          <SingleFileUploader onSuccess={handleFileUploadSuccess} />
        </>
      )}
      {step === 2 && (
        <>
          <h2 className="upload-heading">Step 2: Enter forecast details</h2>
          <ForecastForm onSubmit={handleFormSubmit} onNextStep={handleNextStep} />
        </>
      )}
      {step === 3 && (
        <>
          <h2 className="upload-heading">Step 3: Time series forecast result</h2>
          <TimeSeriesContainer />
          <button className="start-over-btn" onClick={handleStartOver}>Start Over</button>
        </>
      )}
      {step !== 4 && (
        <button className="next-button" onClick={handleNextStep}>Next</button>
      )}
    </div>
  );
}

export default App;
