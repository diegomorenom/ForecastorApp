import React, { useState, useEffect } from 'react';
import './ErrorMetricsTable.css'; // Import the CSS file

interface ErrorMetrics {
  [key: string]: {
    MAE: number;
    MAPE: number;
    MSE: number;
    RMSE: number;
    R2: number;
  };
}

const ErrorMetricsTable: React.FC = () => {
  const [errorMetrics, setErrorMetrics] = useState<ErrorMetrics | null>(null);

  useEffect(() => {
    const fetchErrorMetrics = async () => {
      try {
        const response = await fetch('https://api.seriesforecastor.com:8000/error_metrics');
        if (!response.ok) {
          throw new Error('Failed to fetch error metrics');
        }
        const data = await response.json();
        setErrorMetrics(data);
      } catch (error) {
        console.error('Error fetching error metrics:', error);
      }
    };

    fetchErrorMetrics();
  }, []);

  return (
    <div className="error-metrics-container">
      <h2>Error Metrics</h2>
      {errorMetrics ? (
        <table className="error-metrics-table">
          <thead>
            <tr>
              <th>Model</th>
              <th>MAE</th>
              <th>MAPE</th>
              <th>MSE</th>
              <th>RMSE</th>
              <th>R2</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(errorMetrics).map(([model, metrics]) => (
              <tr key={model}>
                <td>{model}</td>
                <td>{new Intl.NumberFormat('en-US').format(parseFloat(metrics.MAE.toFixed(2)))}</td>
                <td>{(metrics.MAPE * 100).toFixed(2)}%</td>
                <td>{new Intl.NumberFormat('en-US').format(parseFloat(metrics.MSE.toFixed(2)))}</td>
                <td>{new Intl.NumberFormat('en-US').format(parseFloat(metrics.RMSE.toFixed(2)))}</td>
                <td>{metrics.R2.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading error metrics...</p>
      )}
    </div>
  );
};

export default ErrorMetricsTable;
