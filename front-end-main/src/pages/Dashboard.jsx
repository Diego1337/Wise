import React, { useState, useEffect } from "react";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";
import HistoricalChart from "../components/HistoricalChart";
import axios from "axios";

const Dashboard = () => {
  const [salesData, setSalesData] = useState(null);
  const [spendingData, setSpendingData] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setIsLoading(true);

        const salesResponse = await axios.get("/api/vw_precos_detalhados");
        const spendingResponse = await axios.get(
          "/api/vw_custo_detalhado_produto"
        );
        const historyResponse = await axios.get("/api/vw_historico_precos_mp");

        setSalesData(
          Array.isArray(salesResponse.data) ? salesResponse.data : []
        );
        setSpendingData(spendingResponse.data);
        setHistoryData(historyResponse.data);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChartData();

    const intervalId = setInterval(fetchChartData, 10000);

    return () => clearInterval(intervalId);
  }, []);

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
