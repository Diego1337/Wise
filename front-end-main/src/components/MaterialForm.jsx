import React, { useState } from 'react';

const MaterialForm = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    id_mp: item?.id_mp || null,
    nome: item?.nome || '', 
    medida: item?.medida || 'KG',
    valor: item?.valor || 0,
    fornecedor: item?.fornecedor || ''
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
      <h2>{item ? 'Editar Matéria-Prima' : 'Adicionar Matéria-Prima'}</h2>
      
      <div className="form-body">
        <div className="form-group">
          <label htmlFor="nome">Nome do Insumo</label>
          <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} required />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="medida">Medida</label>
            <input type="text" id="medida" name="medida" value={formData.medida} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="valor">Valor</label>
            <input type="number" step="0.01" id="valor" name="valor" value={formData.valor} onChange={handleChange} required />
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fornecedor">Fornecedor</label>
            <input type="text" id="fornecedor" name="fornecedor" value={formData.fornecedor} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
        <button type="submit" className="btn-save">Salvar</button>
      </div>
    </form>
  );
};

export default MaterialForm;