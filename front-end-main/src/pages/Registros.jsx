import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch, FaFileExport, FaEye, FaPen, FaTrash, FaClipboardList } from 'react-icons/fa';

import Modal from '../components/Modal';
import DetailsModalContent from '../components/DetailsModalContent';
import AddProductChoiceModal from '../components/AddProductChoiceModal';
import AddManualProductsTable from '../components/AddManualProductsTable';
import AddChoiceModal from '../components/AddChoiceModal';
import AddCodeModal from '../components/AddCodeModal';
import ProductForm from '../components/ProductForm';
import MaterialForm from '../components/MaterialForm';
import ConfirmationModal from '../components/ConfirmationModal';
import BOMManagementModal from '../components/BOMManagementModal';

const Registros = ({ records: allRecords, onSave, onDelete, showNotification, onDataRefresh }) => {
    const [activeTab, setActiveTab] = useState('Matéria-prima');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(null);
    const [modalContent, setModalContent] = useState(null);
    const [viewMode, setViewMode] = useState('list');

    const [materiais, setMateriais] = useState([]);
    const [produtos, setProdutos] = useState([]);


    // URL da sua API para buscar matéria-prima
    const API_URL = 'http://localhost:3001'; 

    // Função para buscar os dados da API de matéria-prima
    const fetchMateriais = async () => {
        try {
            const response = await fetch(`${API_URL}/vw_precos_detalhados`);
            if (!response.ok) {
                throw new Error('Falha ao buscar os dados de matéria-prima.');
            }
            const data = await response.json();
            setMateriais(data);
            showNotification('Dados de matéria-prima carregados com sucesso!', 'success');
            console.log("Chegou aqui! Dados recebidos:", data);
        } catch (error) {
            console.error("Erro ao buscar dados: ", error);
            showNotification(error.message, 'error');
        }
    };

    const fetchProdutos = async () => {
        try {
            const response = await fetch(`${API_URL}/produto`);
            if (!response.ok) {
                throw new Error('Falha ao buscar os dados de produto.');
            }
            const data = await response.json();
            setMateriais(data);
            showNotification('Dados de produto carregados com sucesso!', 'success');
            console.log("Chegou aqui! Dados recebidos:", data);
        } catch (error) {
            console.error("Erro ao buscar dados: ", error);
            showNotification(error.message, 'error');
        }
    };

    useEffect(() => {
        if (activeTab === 'Matéria-prima') {
            fetchMateriais();
        }
        else if (activeTab === 'Produto') {
            fetchProdutos();
        }
        setViewMode('list');
        const currentData = allRecords[activeTab] || [];
        if (searchTerm) {
            const lowercasedFilter = searchTerm.toLowerCase();
            const filteredData = currentData.filter(item => {
                const name = item.produto || item.nome_prdt || item.nome || '';
                return name.toLowerCase().includes(lowercasedFilter);
            });
            setFilteredRecords(filteredData);
        } else {
            setFilteredRecords(currentData);
        }
    }, [activeTab, allRecords, searchTerm]);

    const handleFileSelect = async (file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('http://localhost:3001/xml/upload', { method: 'POST', body: formData });
            const data = await response.json();
            if (!response.ok) { throw new Error(data.error || 'Falha no upload do XML.'); }
            showNotification(data.message, 'success');
            closeModal();
            if (onDataRefresh) onDataRefresh();
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };
    
    const handleProductFileSelect = async (file) => {
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await fetch('http://localhost:3001/produto/upload/csv', { method: 'POST', body: formData });
            const data = await response.json();
            if (!response.ok) { throw new Error(data.error); }
            showNotification(data.message, 'success');
            closeModal();
            if (onDataRefresh) onDataRefresh();
        } catch (error) {
            showNotification(error.message, 'error');
        }
    };

    const formatarData = (dataString) => {
        if (!dataString) return 'N/A';
        try {
            const data = new Date(dataString);
            const dia = String(data.getUTCDate()).padStart(2, '0');
            const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
            const ano = data.getUTCFullYear();
            return `${dia}/${mes}/${ano}`;
        } catch (error) {
            return 'Data inválida';
        }
    };

    const handleViewDetails = (item) => {
        setModalType('details');
        setModalContent(item);
        setIsModalOpen(true);
    };

    const handleAddClick = () => {
        setModalContent(null);
        let type = '';
        if (activeTab === 'Produtos') type = 'addProductChoice';
        if (activeTab === 'Matéria-prima') type = 'addMaterialChoice';
        if (type) {
            setModalType(type);
            setIsModalOpen(true);
        }
    };

    const handleEdit = (item) => {
        setModalContent(item);
        const type = activeTab === 'Produtos' ? 'editProduct' : 'editMaterial';
        setModalType(type);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (item) => {
        setModalType('deleteConfirmation');
        setModalContent(item);
        setIsModalOpen(true);
    };

    const handleManageBOM = (produto) => {
        setModalContent(produto);
        setModalType('manageBOM');
        setIsModalOpen(true);
    };

    const confirmDelete = () => {
        const idToDelete = activeTab === 'Produtos' ? modalContent.id_prdt : modalContent.id_mp;
        onDelete(idToDelete, activeTab);
        closeModal();
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalType(null);
        setModalContent(null);
    };

    const handleGenerateReport = () => {};

    const renderTableContent = () => {
        if (!filteredRecords || filteredRecords.length === 0) {
            return <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>Nenhum registro encontrado</td></tr>;
        }
        if (activeTab === 'Produtos') {
            return filteredRecords.map((row) => (
                <tr key={row.id_prdt}>
                    <td>{row.nome_prdt}</td>
                    <td>{/* Valor Sugerido (a ser calculado) */}</td>
                    <td>{row.codigo_prdt || 'N/A'}</td>
                    <td className="table-actions">
                        <FaClipboardList className="action-icon" onClick={() => handleManageBOM(row)} title="Gerenciar Composição" />
                        <FaEye className="action-icon" onClick={() => handleViewDetails(row)} />
                        <FaPen className="action-icon" onClick={() => handleEdit(row)} />
                        <FaTrash className="action-icon" onClick={() => handleDeleteClick(row)} />
                    </td>
                </tr>
            ));
        }
        if (activeTab === 'Matéria-prima') {
            return filteredRecords.map((row) => (
                <tr key={row.id_mp}>
                    <td>{row.nome}</td>
                    <td>{row.medida}</td>
                    <td>{(row.valor || row.valor === 0) ? `R$ ${Number(row.valor).toFixed(2).replace('.', ',')}` : 'N/A'}</td>
                    <td>{row.fornecedor}</td>
                    <td>{formatarData(row.data_cotacao)}</td>
                    <td className="table-actions">
                        <FaEye className="action-icon" onClick={() => handleViewDetails(row)} />
                        <FaPen className="action-icon" onClick={() => handleEdit(row)} />
                        <FaTrash className="action-icon" onClick={() => handleDeleteClick(row)} />
                    </td>
                </tr>
            ));
        }
    };

    const renderModalContent = () => {
        switch (modalType) {
            case 'details': return <DetailsModalContent item={modalContent} type={activeTab} />;
            case 'addProductChoice': return <AddProductChoiceModal onFileSelect={handleProductFileSelect} onGoToManualEntry={() => { setModalContent(null); setModalType('addProduct'); }} />;
            case 'addMaterialChoice': return <AddChoiceModal onFileSelect={handleFileSelect} onGoToCodeEntry={() => setModalType('addMaterialCode')} onGoToManualEntry={() => { setModalContent(null); setModalType('addMaterial'); }} />;
            case 'addMaterialCode': return <AddCodeModal onBack={() => setModalType('addMaterialChoice')} showNotification={showNotification} onSuccess={() => { closeModal(); if (onDataRefresh) onDataRefresh(); }} />;
            case 'addProduct': case 'editProduct': return <ProductForm item={modalContent} onSave={(data) => { onSave(data, activeTab); closeModal(); }} onCancel={closeModal} />;
            case 'addMaterial': case 'editMaterial': return <MaterialForm item={modalContent} onSave={(data) => { onSave(data, activeTab); closeModal(); }} onCancel={closeModal} />;
            case 'deleteConfirmation': return <ConfirmationModal message={`Tem certeza que deseja excluir "${modalContent?.nome_prdt || modalContent?.nome}"?`} onConfirm={confirmDelete} onCancel={closeModal} />;
            case 'manageBOM': return <BOMManagementModal produto={modalContent} showNotification={showNotification} onDataRefresh={onDataRefresh} onClose={closeModal} />;
            default: return null;
        }
    };

    return (
        <div>
            <div className="registros-header">
                <h1 className="page-header">Registros</h1>
                <div className="header-actions">
                    <button className="add-btn-circle" onClick={handleAddClick} title="Adicionar Novo Registro"><FaPlus /></button>
                    <div className="search-bar">
                        <input type="text" placeholder="Pesquisar..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <FaSearch className="search-icon" />
                    </div>
                </div>
            </div>
            <div className="filters-container">
                <div className="filter-tabs">
                    <button className={`filter-tab ${activeTab === 'Matéria-prima' ? 'active' : ''}`} onClick={() => setActiveTab('Matéria-prima')}>Matéria-prima</button>
                    <button className={`filter-tab ${activeTab === 'Produtos' ? 'active' : ''}`} onClick={() => setActiveTab('Produtos')}>Produtos</button>
                </div>
                <a href="#" onClick={handleGenerateReport} className="report-link"><FaFileExport /><span>Gerar relatório</span></a>
            </div>
            {viewMode === 'list' ? (
                <div className="table-card-container">
                    <div className="registros-table-container">
                        <table className="registros-table">
                            <thead>
                                <tr>
                                    {activeTab === 'Produtos' && <><th>Produto</th><th>Valor Sugerido</th><th>Código</th><th>Ações</th></>}
                                    {activeTab === 'Matéria-prima' && <><th>Insumo</th><th>Medida</th><th>Valor</th><th>Fornecedor</th><th>Data da Cotação</th><th>Ações</th></>}
                                </tr>
                            </thead>
                            <tbody>{renderTableContent()}</tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <AddManualProductsTable onSubmit={(data) => onSave(data, activeTab)} onCancel={() => setViewMode('list')} />
            )}
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                {renderModalContent()}
            </Modal>
        </div>
    );
};

export default Registros;