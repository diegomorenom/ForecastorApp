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
}

const TimeSeriesContainer = () => {
  const [csvData, setCsvData] = useState<ForecastData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:5000/forecast/forecast_holt_winters_1_20170815.csv');
      
      if (!response.body) {
        // Handle the case where response.body is null
        console.error('Response body is null');
        return;
      }

      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder('utf-8');
      const csv = decoder.decode(result.value);
      const parsedData = Papa.parse<ForecastData>(csv, { header: true, skipEmptyLines: true });
      
      console.log('Parsed CSV data:', parsedData);

      if (parsedData.errors.length > 0) {
        console.error('Error parsing CSV:', parsedData.errors[0]);
        return;
      }

      setCsvData(parsedData.data);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Time Series Chart Example</h1>
      <TimeSeriesChart data={csvData} />
    </div>
  );
};

export default TimeSeriesContainer;