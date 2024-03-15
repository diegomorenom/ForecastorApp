import React, { useState } from 'react';
import './ForecastForm.css'; // Import the CSS file

interface ForecastFormProps {
  onSubmit: (forecastDays: number, selectedModels: string[]) => void;
}

const ForecastForm: React.FC<ForecastFormProps> = ({ onSubmit }) => {
  const [forecastDays, setForecastDays] = useState<number>(0);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [processing, setProcessing] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleForecastDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setForecastDays(value);
  };

  const handleModelsChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const options = e.target.options;
    const selectedModels: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedModels.push(options[i].value);
      }
    }
    setSelectedModels(selectedModels);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setProcessing(true);
    setErrorMessage('');

    const formData = { forecastDays, selectedModels };

    try {
      const response = await fetch('http://3.22.41.130:8000/process_forecast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form data');
      }

      if (response.status === 200) {
        setProcessing(false);
      }
    } catch (error) {
      console.error(error);
      setProcessing(false);
      setErrorMessage('Error generating forecast. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="forecastDays">Forecast Days:</label>
          <input
            type="number"
            id="forecastDays"
            value={forecastDays}
            onChange={handleForecastDaysChange}
          />
        </div>
        <div>
          <label htmlFor="forecastModels">Forecast Models:</label>
          <select
            multiple
            id="forecastModels"
            value={selectedModels}
            onChange={handleModelsChange}
          >
            <option value="HoltWinters">HoltWinters</option>
            <option value="MovingAverage">MovingAverage</option>
            <option value="RandomForest">RandomForest</option>
            <option value="NeuralNetworkFF">NeuralNetworkFF</option>
            <option value="NeuralNetworkLSTM">NeuralNetworkLSTM</option>
            <option value="FacebookProphet">FacebookProphet</option>
          </select>
        </div>
        <button type="submit">Submit</button>

        {/* Conditionally render the processing message */}
        {processing && <p className="processing-message">Generating forecast...</p>}
        {/* Display the submitted message if submitted is true */}
        {submitted && !processing && !errorMessage && <p className="submitted-message">Processed successfully!</p>}
        {/* Display error message if there's an error */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default ForecastForm;
