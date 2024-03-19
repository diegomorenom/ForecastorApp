import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import { Chart, TimeScale } from 'chart.js'; // Import TimeScale

// Register TimeScale
Chart.register(TimeScale);

interface ForecastData {
  forecast_date: string;
  forecast: number;
  model: string; // Add model property
}

interface TimeSeriesChartProps {
  data: ForecastData[];
  style?: React.CSSProperties; // Define style prop
}

const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({ data, style }) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      // Group data by model
      const groupedData: { [key: string]: ForecastData[] } = {};
      data.forEach((item) => {
        if (!groupedData[item.model]) {
          groupedData[item.model] = [];
        }
        groupedData[item.model].push(item);
      });

      // Initialize variables to store chart labels and datasets
      const chartLabels: string[] = [];
      const datasets: any[] = [];

      // Define a fixed color palette
      const colorPalette = ['#607D8B', '#455A64', '#37474F', '#263238', '#78909C', '#90A4AE', '#B0BEC5'];

      // Generate datasets for each model
      Object.keys(groupedData).forEach((model, index) => {
        const sortedData = groupedData[model].sort((a, b) => {
          return new Date(a.forecast_date).getTime() - new Date(b.forecast_date).getTime();
        });

        // Update chart labels
        chartLabels.push(...sortedData.map((item) => moment(item.forecast_date).format('YYYY-MM-DD')));

        // Generate dataset
        datasets.push({
          label: model,
          data: sortedData.map((item) => item.forecast),
          fill: false,
          borderColor: model === 'data_test' ? '#ff7f0e' : colorPalette[index % colorPalette.length],
          tension: 0.1,
        });
      });

      setChartData({
        labels: chartLabels,
        datasets: datasets,
      });
    }
  }, [data]);

  return (
    <div className="chart-container" style={style}>
      {chartData && (
        <Line
          data={chartData}
          options={{
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Forecast',
                },
              },
            },
          }}
        />
      )}
    </div>
  );
};

export default TimeSeriesChart;
