import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';

const BOMManagementModal = ({ produto, showNotification, onDataRefresh, onClose }) => {
    const [composicao, setComposicao] = useState([]);
    const [materiasPrimas, setMateriasPrimas] = useState([]);
    const [selectedMpId, setSelectedMpId] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Busca os dados iniciais ao abrir o modal
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Busca a composição atual do produto E a lista de todas as matérias-primas
                const [composicaoRes, materiasPrimasRes] = await Promise.all([
                    fetch(`http://localhost:3001/produto-mp/by-product/${produto.id_prdt}`),
                    fetch('http://localhost:3001/vw_precos_detalhados') // Usamos a view para ter nomes únicos
                ]);

                const composicaoData = await composicaoRes.json();
                const materiasPrimasData = await materiasPrimasRes.json();
                
                // Remove duplicados da lista de matérias-primas
                const mpMap = new Map();
                materiasPrimasData.forEach(mp => mpMap.set(mp.id_materia_prima, mp));
                const uniqueMateriasPrimas = Array.from(mpMap.values());

                setComposicao(composicaoData);
                setMateriasPrimas(uniqueMateriasPrimas);
                if (uniqueMateriasPrimas.length > 0) {
                    setSelectedMpId(uniqueMateriasPrimas[0].id_materia_prima);
                }
            } catch (error) {
                showNotification(`Erro ao buscar dados: ${error.message}`, 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [produto.id_prdt]);

    const handleAddMaterial = async (e) => {
        e.preventDefault();
        if (!selectedMpId || !quantidade) {
            showNotification('Selecione uma matéria-prima e informe a quantidade.', 'error');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/produto-mp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_prdt: produto.id_prdt,
                    id_mp: parseInt(selectedMpId, 10),
                    quantidade: parseFloat(quantidade)
                }),
            });
            const data = await response.json();
            if (!response.ok) { throw new Error(data.error || 'Falha ao adicionar material.'); }
            
            showNotification(data.message, 'success');
            setQuantidade(''); // Limpa o campo
            onDataRefresh(); // Atualiza a lista
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };
    
    const handleDeleteMaterial = async (id_composta) => {
        try {
            const response = await fetch(`http://localhost:3001/produto-mp/${id_composta}`, {
                method: 'DELETE',
            });
            const data = await response.json();
            if (!response.ok) { throw new Error(data.error || 'Falha ao remover material.'); }

            showNotification(data.message, 'success');
            onDataRefresh(); // Atualiza a lista
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    return (
        <div className="form-modal">
            <h2>Composição de: {produto.nome_prdt}</h2>
            <div className="form-body">
                {/* Formulário para Adicionar Novo Material */}
                <form onSubmit={handleAddMaterial} className="form-row" style={{ alignItems: 'flex-end', marginBottom: '2rem' }}>
                    <div className="form-group" style={{ flex: 3 }}>
                        <label>Matéria-Prima</label>
                        <select className="form-control-calc" value={selectedMpId} onChange={(e) => setSelectedMpId(e.target.value)}>
                            {materiasPrimas.map(mp => (
                                <option key={mp.id_materia_prima} value={mp.id_materia_prima}>{mp.nome_materia_prima}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Quantidade</label>
                        <input type="number" step="0.001" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />
                    </div>
                    <button type="submit" className="add-btn-circle" title="Adicionar Matéria-Prima"><FaPlus /></button>
                </form>

                {/* Lista de Materiais Atuais */}
                <h3 className="details-modal-subtitle">Materiais na Composição</h3>
                {isLoading ? <p>Carregando...</p> : (
                    <ul className="details-modal-list">
                        {composicao.length > 0 ? composicao.map(item => (
                            <li key={item.id_composta} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>• {item.nome_mp}: {item.quantidade} {item.uni_medida}</span>
                                <FaTrash 
                                    className="action-icon" 
                                    onClick={() => handleDeleteMaterial(item.id_composta)}
                                    style={{ cursor: 'pointer' }}
                                />
                            </li>
                        )) : <p>Nenhum material na composição.</p>}
                    </ul>
                )}
            </div>
            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>Fechar</button>
            </div>
        </div>
    );
};

export default BOMManagementModal;