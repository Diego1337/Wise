import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registra os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ data: chartData }) => {
  // Verifica se chartData é uma array válida
  if (!Array.isArray(chartData)) {
    console.error("chartData não é uma array válida:", chartData);
    return <div>Erro ao carregar os dados do gráfico.</div>;
  }

  // Transforma os dados recebidos para o formato que o Chart.js espera
  const data = {
    labels: chartData.map((item) => item.product), // Nomes dos produtos no eixo X
    datasets: [
      {
        label: "Valor Vendido",
        data: chartData.map((item) => item.value), // Valores no eixo Y
        backgroundColor: "rgba(116, 12, 12, 0.6)",
        borderColor: "rgba(116, 12, 12, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Esconde a legenda, como no protótipo
      },
      title: {
        display: false, // Esconde o título do gráfico
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <Bar options={options} data={data} />
    </div>
  );
};

export default BarChart;
