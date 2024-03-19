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
  const [isFullScreen, setIsFullScreen] = useState(false);

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

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('mozfullscreenchange', handleFullScreenChange);
    document.addEventListener('MSFullscreenChange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullScreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullScreenChange);
    };
  }, []);

  const handleFullScreenToggle = () => {
    const elem = document.documentElement;
    if (!isFullScreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen(); // Type assertion
      } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen(); // Type assertion
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen(); // Type assertion
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen(); // Type assertion
      }
    }
    setIsFullScreen(!isFullScreen);
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isFullScreen) {
      handleFullScreenToggle();
    }
  };

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isFullScreen]);

  return (
    <div className={`chart-container ${isFullScreen ? 'full-screen' : ''}`} style={isFullScreen ? { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 9999, backgroundColor: '#ffffff' } : style}>
      {chartData && (
        <Line
          data={chartData}
          options={{
            scales: {
              x: {
                type: 'time',
                time: {
                  unit: 'day',
                  displayFormats: {
                    day: 'YYYY-MM-DD'
                  }
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Forecast',
                },
              },
            },
            plugins: {
              tooltip: {
                callbacks: {
                  label: (context) => {
                    const label = context.dataset.label || '';
                    if (label) {
                      const value = context.parsed.y.toLocaleString(undefined, { maximumFractionDigits: 0 });
                      return `${label}: ${value}`;
                    }
                    return '';
                  },
                },
              },
            },
          }}
        />
      )}
      <button className={`full-screen-toggle`} onClick={handleFullScreenToggle}>{isFullScreen ? 'Exit Full Screen' : 'Full Screen'}</button>
    </div>
  );
};

export default TimeSeriesChart;
