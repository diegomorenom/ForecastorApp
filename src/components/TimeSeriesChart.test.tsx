// TimeSeriesChart.test.tsx

import React from 'react';
import ReactDOM from 'react-dom';
import TimeSeriesChart from './TimeSeriesChart';

const mockData = [
    { 
      forecast_date: '2024-01-01', 
      forecast: 100,
      date: '2017-08-15', 
      family: 'GROCERY I', 
      store_nbr: 1, 
      date_updated: '2024-03-02 08:16:03.902528' 
    },
    { 
      forecast_date: '2024-01-02', 
      forecast: 120,
      date: '2017-08-15', 
      family: 'GROCERY I', 
      store_nbr: 1, 
      date_updated: '2024-03-02 08:16:03.902528'  
    },
    // Add more mock data as needed
  ];

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<TimeSeriesChart data={mockData} />, div);
  ReactDOM.unmountComponentAtNode(div);
});
