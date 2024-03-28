import { useState, useEffect } from 'react'; // Import React for JSX syntax
import Papa from 'papaparse';
import TimeSeriesChart from './TimeSeriesChart';
import ErrorMetricsTable from './ErrorMetricsTable'; 

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
        'https://api.seriesforecastor.com:8000/data_base/data_test.csv',
        'https://api.seriesforecastor.com:8000/forecast/forecast_MovingAverage.csv',
        'https://api.seriesforecastor.com:8000/forecast/forecast_HoltWinters.csv',
        'https://api.seriesforecastor.com:8000/forecast/forecast_FacebookProphet.csv',
        'https://api.seriesforecastor.com:8000/forecast/forecast_RandomForest.csv',
        'https://api.seriesforecastor.com:8000/forecast/forecast_NeuralProphet.csv',
        'https://api.seriesforecastor.com:8000/forecast/forecast_NeuralNetworkFF.csv',
        'https://api.seriesforecastor.com:8000/forecast/forecast_NeuralNetworkLSTM.csv',
        'https://api.seriesforecastor.com:8000/forecast/forecast_XGBoost.csv'
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
          model: ['data_test', 'MovingAverage', 'HoltWinters', 'FacebookProphet', 'RandomForest', 'NeuralProphet', 'NeuralNetworkFF', 'NeuralNetworkLSTM', 'XGBoost'][index]
        }));
      });

      setCsvData(combinedData);
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '80%', margin: '0 auto' }}> {/* Apply styles */}
      <h1>Forecasting Models</h1>
      <TimeSeriesChart data={csvData} style={{ width: '100%' }} /> {/* Apply styles */}
      <div className="error-metrics">
        <ErrorMetricsTable />
      </div>
    </div>
    
  );
};

export default TimeSeriesContainer;
