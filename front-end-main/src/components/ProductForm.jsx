import React, { useState } from 'react';

const ProductForm = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        id_prdt: item?.id_prdt || null,
        nome_prdt: item?.nome_prdt || '',
        codigo_prdt: item?.codigo_prdt || '',
        descricao_prdt: item?.descricao_prdt || ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="form-modal">
            <h2>{item ? 'Editar Produto' : 'Adicionar Produto'}</h2>
            
            <div className="form-body">
                <div className="form-group">
                    <label htmlFor="nome_prdt">Nome do Produto</label>
                    <input type="text" id="nome_prdt" name="nome_prdt" value={formData.nome_prdt} onChange={handleChange} required />
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="codigo_prdt">Código (ID)</label>
                        <input type="text" id="codigo_prdt" name="codigo_prdt" value={formData.codigo_prdt} onChange={handleChange} />
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="descricao_prdt">Descrição</label>
                    <textarea id="descricao_prdt" name="descricao_prdt" value={formData.descricao_prdt} onChange={handleChange} rows="3"></textarea>
                </div>
            </div>

            <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
                <button type="submit" className="btn-save">Salvar</button>
            </div>
        </form>
    );
};

export default ProductForm;