import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = ({ data: chartData }) => {
  // Transforma os dados para o formato do gráfico de pizza
  const data = {
    labels: chartData.map(item => item.material),
    datasets: [
      {
        label: '% de Gasto',
        data: chartData.map(item => item.percentage),
        backgroundColor: [
          'rgba(116, 12, 12, 0.8)',
          'rgba(186, 22, 22, 0.8)',
          'rgba(230, 0, 0, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(255, 255, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right', // Legenda à direita
      },
    },
  };

  return (
    <div style={{ height: '300px', width: '100%' }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;