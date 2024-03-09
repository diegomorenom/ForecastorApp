import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import { Chart, TimeScale } from 'chart.js'; // Import TimeScale

// Register TimeScale
Chart.register(TimeScale);

interface ForecastData {
  forecast_date: string;
  forecast: number;
  date: string;
  family: string;
  store_nbr: number;
  date_updated: string;
}

const TimeSeriesChart = ({ data }: { data: ForecastData[] }) => {
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    if (data && data.length > 0) {
      const sortedData = data.sort((a, b) => {
        return new Date(a.forecast_date).getTime() - new Date(b.forecast_date).getTime();
      });

      const chartLabels = sortedData.map((item) =>
        moment(item.forecast_date).format('YYYY-MM-DD')
      );
      const chartValues = sortedData.map((item) => item.forecast);

      setChartData({
        labels: chartLabels,
        datasets: [
          {
            label: 'Forecast',
            data: chartValues,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      });
    }
  }, [data]);

  return (
    <div>
      <h2>Time Series Chart</h2>
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