import React, { useState } from 'react';
import './ForecastForm.css'; // Import the CSS file

interface ForecastFormProps {
  onSubmit: (forecastDays: number, selectedModels: string[]) => void;
}

const ForecastForm: React.FC<ForecastFormProps> = ({ onSubmit }) => {
  const [forecastDays, setForecastDays] = useState<number>(0);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<boolean>(false); // New state for submission status

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

    const formData = { forecastDays, selectedModels };

    try {
      const response = await fetch('http://localhost:5000/process_forecast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form data');
      }

      const responseData = await response.json();
      console.log(responseData); // Log the response from the API
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="form-container"> {/* Apply styles from CSS */}
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
            {/* <option value="NeuralNetworkFF">NeuralNetworkFF</option>
            <option value="NeuralNetworkLSTM">NeuralNetworkLSTM</option>
            <option value="RandomForest">RandomForest</option>
            <option value="ExponentialSmoothing">ExponentialSmoothing</option>
            <option value="SupportVectorRegression">SupportVectorRegression</option> */}
          </select>
        </div>
        <button type="submit">Submit</button>

        {/* Display the submitted message if submitted is true */}
        {submitted && <p className="submitted-message">Submitted!</p>}
      </form>
    </div>
  );
};

export default ForecastForm;