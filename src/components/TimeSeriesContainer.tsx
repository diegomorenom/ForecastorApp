import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import TimeSeriesChart from './TimeSeriesChart';

// Define the interface for CSV data
interface ForecastData {
  forecast_date: string;
  forecast: number;
  date: string;
  family: string;
  store_nbr: number; // Change to number
  date_updated: string;
  model: string;
}

const TimeSeriesContainer = () => {
  const [csvData, setCsvData] = useState<ForecastData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const urls = [
        'http://localhost:5000/forecast/forecast_MovingAverage.csv',
        'http://localhost:5000/forecast/forecast_HoltWinters.csv',
        'http://localhost:5000/forecast/forecast_FacebookProphet.csv',
        'http://localhost:5000/forecast/forecast_RandomForest.csv',
        'http://localhost:5000/forecast/forecast_NeuralNetworkFF.csv',
        'http://localhost:5000/forecast/forecast_NeuralNetworkLSTM.csv'
      ];

      const responses = await Promise.all(urls.map(url => fetch(url)));

      const parsedDataPromises = responses.map(async response => {
        if (!response.ok || !response.body) {
          throw new Error('Failed to fetch data');
        }
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder('utf-8');
        const csv = decoder.decode(result.value);
        return Papa.parse<ForecastData>(csv, { header: true, skipEmptyLines: true });
      });

      const parsedDataArray = await Promise.all(parsedDataPromises);

      const combinedData = parsedDataArray.flatMap((parsedData, index) => {
        return parsedData.data.map(item => ({
          ...item,
          model: ['MovingAverage', 'HoltWinters', 'FacebookProphet', 'RandomForest', 'NeuralNetworkFF', 'NeuralNetworkLSTM'][index]
        }));
      });

      setCsvData(combinedData);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Forecasting Models</h1>
      <TimeSeriesChart data={csvData} />
    </div>
  );
};

export default TimeSeriesContainer;
