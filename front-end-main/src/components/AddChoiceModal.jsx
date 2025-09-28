import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FaFolderOpen, FaKeyboard, FaPlusCircle } from 'react-icons/fa';

const AddChoiceModal = ({ onGoToCodeEntry, onFileSelect, onGoToManualEntry }) => {
    const onDrop = useCallback(acceptedFiles => {
        if (acceptedFiles.length > 0) {
            onFileSelect(acceptedFiles[0]);
        }
    }, [onFileSelect]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/xml': ['.xml'], 'text/xml': ['.xml'] },
        multiple: false
    });

    return (
        <div className="add-choice-modal">
            <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                <input {...getInputProps()} />
                <div className="dropzone-add-icon">+</div>
                <div className="dropzone-text">
                    <p>Arraste e solte o XML da NF-e</p>
                    <p>ou</p>
                    <p>clique para selecionar.</p>
                </div>
                <FaFolderOpen className="dropzone-folder-icon" />
            </div>
            
            <button className="insert-by-code-btn" onClick={onGoToCodeEntry}>
                <FaKeyboard />
                <span>Inserir por Chave de Acesso</span>
            </button>

            <button className="insert-by-code-btn" onClick={onGoToManualEntry}>
                <FaPlusCircle />
                <span>Adicionar Manualmente</span>
            </button>
        </div>
    );
};

export default AddChoiceModal;