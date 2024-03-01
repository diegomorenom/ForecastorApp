import React from 'react';
import "./App.css"; // Import the CSS file
import SingleFileUploader from "./components/SingleFileUploader";
import ForecastForm from "./components/ForecastForm"; // Import the ForecastForm component

function App() {
  const handleSubmit = (forecastDays: number, selectedModels: string[]) => {
    // Handle form submission logic here
    console.log('Forecast Days:', forecastDays);
    console.log('Selected Models:', selectedModels);
  };

  return (
    <div className="app-container"> {/* Apply styles from CSS */}
      <img src="./src/assets/ForecastorWeb.png" alt="Forecastor, time series" className="app-logo"></img>
      <h2 className="upload-heading">Upload your time series file.</h2>
      <SingleFileUploader />
      <ForecastForm onSubmit={handleSubmit} />
    </div>
  );
}

export default App;
