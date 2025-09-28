import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const HistoricalChart = ({ data: chartData }) => {
  const data = {
    labels: Object.keys(chartData), // Meses (JAN, FEV, etc.)
    datasets: [
      {
        label: 'Valor Histórico',
        data: Object.values(chartData), // Valores de cada mês
        backgroundColor: 'rgba(116, 12, 12, 0.6)',
        borderColor: 'rgba(116, 12, 12, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Bar options={options} data={data} />
    </div>
  );
};

export default HistoricalChart;