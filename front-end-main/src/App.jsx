import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Registros from './pages/Registros';
import Calculadora from './pages/Calculadora';
import Notification from './components/Notification';

function App() {
    const [allRecords, setAllRecords] = useState({
        'Produtos': [],
        'Matéria-prima': [],
    });
    const [notification, setNotification] = useState({ message: '', type: '', visible: false });

    const refreshData = async () => {
        try {
            const [materiasPrimasRes, produtosRes] = await Promise.all([
                fetch('http://localhost:3001/vw_precos_detalhados'),
                fetch('http://localhost:3001/produto')
            ]);
            
            if (!materiasPrimasRes.ok || !produtosRes.ok) {
                throw new Error('Falha ao buscar dados do servidor');
            }

            const materiasPrimasData = await materiasPrimasRes.json();
            const produtosData = await produtosRes.json();
            
            const formattedMateriasPrimas = materiasPrimasData.map(item => ({
                id: item.id_preco,
                id_mp: item.id_materia_prima,
                nome: item.nome_materia_prima,
                medida: item.unidade_medida,
                valor: item.preco,
                fornecedor: item.nome_fornecedor,
                data_cotacao: item.data_cotacao
            }));

            setAllRecords({
                'Matéria-prima': formattedMateriasPrimas,
                'Produtos': produtosData
            });

        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type, visible: true });
        setTimeout(() => {
            setNotification({ message: '', type: '', visible: false });
        }, 3000);
    };

    const handleSaveRecord = async (itemData, activeTab) => {
        let url = '';
        let method = 'POST';
        let body = { 
            ...itemData, 
            id_mp: itemData.id_mp,        
            nome: itemData.nome,
            medida: itemData.medida,
            valor: itemData.valor,
            fornecedor: itemData.fornecedor
        };

        if (activeTab === 'Matéria-prima') {
            url = 'http://localhost:3001/materia-prima';
            
            if (body.id_mp) {
                url += `/${body.id_mp}`;
                method = 'PUT';
            }
        } else if (activeTab === 'Produtos') {
            url = 'http://localhost:3001/produto';
            if (body.id_prdt) {
                url += `/${body.id_prdt}`;
                method = 'PUT';
            }
        }
        
        if (!url) return;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            const data = await response.json();
            if (!response.ok) { throw new Error(data.error || 'Falha ao salvar o registro.'); }
            showNotification(data.message, 'success');
            refreshData();
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    const handleDeleteRecord = async (itemId, activeTab) => {
        let url = '';
        if (activeTab === 'Matéria-prima') {
            url = `http://localhost:3001/materia-prima/${itemId}`;
        } else if (activeTab === 'Produtos') {
            url = `http://localhost:3001/produto/${itemId}`;
        }

        if (!url) return;

        try {
            const response = await fetch(url, { method: 'DELETE' });
            const data = await response.json();
            if (!response.ok) { throw new Error(data.error); }
            showNotification(data.message, 'success');
            refreshData();
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    return (
        <Router>
            <div className="app-container">
                <Notification 
                    message={notification.message} 
                    type={notification.type} 
                    visible={notification.visible} 
                />
                <Sidebar />
                <main className="main-content">
                    <Routes>
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route 
                            path="/registros" 
                            element={
                                <Registros 
                                    records={allRecords} 
                                    onSave={handleSaveRecord}
                                    onDelete={handleDeleteRecord}
                                    showNotification={showNotification}
                                    onDataRefresh={refreshData}
                                />
                            } 
                        />
                        <Route path="/calculadora" element={<Calculadora />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;