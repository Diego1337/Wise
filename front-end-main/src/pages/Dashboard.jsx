import React, { useState, useEffect } from "react";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import HistoricalChart from "../components/HistoricalChart";

const Dashboard = () => {
  // Estados para armazenar dados vindos da API
  const [salesData, setSalesData] = useState(null);
  const [spendingData, setSpendingData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // >>>>> MUDANÇA PRINCIPAL AQUI <<<<<
  useEffect(() => {
    // 1. Criamos uma função para buscar os dados
    const fetchChartData = () => {
      console.log("Buscando dados atualizados para os gráficos..."); // Para vermos no console que está funcionando

      // A simulação de API que já tínhamos. No futuro, aqui entraria o 'fetch' real.
      setTimeout(() => {
        // Para a simulação, vamos gerar dados levemente diferentes a cada busca
        const randomFactor = 1 + (Math.random() - 0.5) * 0.1; // Variação de +/- 10%
        const mockSalesData = [
          { product: "Bobina de Ignição", value: 32050 * randomFactor },
          { product: "Bobina de Pulso Gerador", value: 26760 * randomFactor },
        ];
        const mockSpendingData = [
          {
            material: "Fio de cobre esmaltado",
            percentage: 30.0 * randomFactor,
          },
          { material: "Resina Epóxi", percentage: 35.0 },
        ];
        const mockHistoryData = {
          JAN: 79.47,
          FEV: 74.05,
          MAR: 70.53 * randomFactor,
        };

        setSalesData(mockSalesData);
        setSpendingData(mockSpendingData);
        setHistoryData(mockHistoryData);
        setIsLoading(false); // Só na primeira vez
      }, 1000); // Simula 1 segundo de espera pela API
    };

    // 2. Busca os dados na primeira vez que a página carrega
    fetchChartData();

    // 3. Configura o Polling: repete a busca a cada 10 segundos
    const intervalId = setInterval(fetchChartData, 10000); // 10000 ms = 10 segundos

    // 4. Limpa o intervalo quando o componente é desmontado (usuário sai da página)
    return () => clearInterval(intervalId);
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez (na montagem)

  return (
    <div>
      <div className="dashboard-grid">
        <div className="card chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Produtos mais vendidos</h2>
            <select className="dropdown">
              <option>Agosto</option>
            </select>
          </div>
          {isLoading || !salesData ? (
            <div className="loading-placeholder">Carregando dados...</div>
          ) : (
            <BarChart data={salesData} />
          )}
        </div>

        <div className="card chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Maiores gastos de matéria-prima</h2>
            <select className="dropdown">
              <option>Setembro</option>
            </select>
          </div>
          {isLoading || !spendingData ? (
            <div className="loading-placeholder">Carregando dados...</div>
          ) : (
            <PieChart data={spendingData} />
          )}
        </div>

        <div className="card chart-card" style={{ gridColumn: "1 / -1" }}>
          <div className="chart-header">
            <h2 className="chart-title">
              Histórico de valores por matéria prima
            </h2>
            <select className="dropdown">
              <option>2024</option>
            </select>
          </div>
          {isLoading || !historyData ? (
            <div className="loading-placeholder">Carregando dados...</div>
          ) : (
            <HistoricalChart data={historyData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
