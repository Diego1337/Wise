import React, { useState } from 'react';

const AddCodeModal = ({ onBack, showNotification, onSuccess }) => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleApiSubmit = async (chave) => {
        setIsLoading(true);
        try {
            // --- CORREÇÃO FINAL E DEFINITIVA DA URL ---
            const response = await fetch('http://localhost:3001/xml/fetch-from-key', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ chave: chave }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro desconhecido do servidor.');
            }
            
            showNotification(data.message, 'success');
            if (onSuccess) onSuccess();
            
        } catch (error) {
            showNotification(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedCode = code.trim();
        if (trimmedCode) {
            handleApiSubmit(trimmedCode);
        }
    };

    return (
        <div className="add-code-modal">
            <button className="back-btn" onClick={onBack}>&larr; Voltar</button>
            <h2 className="details-modal-title">Nota Fiscal</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group-nf">
                    <label htmlFor="nf-code">Chave de Acesso da NF-e (44 dígitos):</label>
                    <input
                        id="nf-code"
                        type="text"
                        className="nf-code-input"
                        placeholder="Digite os 44 números da chave de acesso"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        maxLength="44"
                    />
                </div>
                <button type="submit" className="btn-add-nf" disabled={isLoading}>
                    {isLoading ? 'Enviando...' : 'Buscar e Adicionar NF-e'}
                </button>
            </form>
        </div>
    );
};

export default AddCodeModal;