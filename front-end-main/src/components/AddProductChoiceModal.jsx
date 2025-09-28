import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFolderOpen, FaKeyboard, FaDownload } from 'react-icons/fa';

const AddProductChoiceModal = ({ onGoToManualEntry, onFileSelect }) => {
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/csv': ['.csv'] },
        multiple: false
    });

    const handleDownloadModel = () => {
        const headers = "Produto;Preço;ID;Descrição";
        const exampleData = "\nBobina Exemplo;150,00;MCM-EX;Descrição do produto aqui";
        const csvContent = "data:text/csv;charset=utf-8," + "\uFEFF" + encodeURIComponent(headers + exampleData);
        const link = document.createElement("a");
        link.setAttribute("href", csvContent);
        link.setAttribute("download", "modelo_produtos.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="add-choice-modal">
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                <div className="dropzone-add-icon">+</div>
                <div className="dropzone-text">
                    <p>Arraste e solte o arquivo CSV</p>
                    <p>ou</p>
                    <p>clique para selecionar.</p>
                </div>
                <FaFolderOpen className="dropzone-folder-icon" />
            </div>
            <a href="#" className="manual-entry-link" onClick={onGoToManualEntry}>
                Insira manualmente aqui
            </a>
            <button className="download-model-btn" onClick={handleDownloadModel}>
                <FaDownload />
                <span>Baixar Modelo</span>
            </button>
        </div>
    );
};

export default AddProductChoiceModal;