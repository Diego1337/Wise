import React, { useState } from 'react';

const AddManualProductsTable = ({ onSubmit, onCancel }) => {
  const [rows, setRows] = useState([
    { produto: '', preco: '', id: '', descricao: '' }
  ]);

  const handleInputChange = (index, event) => {
    const { name, value } = event.target;
    const newRows = [...rows];
    newRows[index][name] = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { produto: '', preco: '', id: '', descricao: '' }]);
  };

  const handleSubmit = () => {
    const productsToAdd = rows.filter(row => row.produto.trim() !== '');
    if (productsToAdd.length > 0) {
      onSubmit(productsToAdd);
    } else {
      alert('Por favor, preencha pelo menos um produto.');
    }
  };

  return (
    <div className="manual-add-container">
        <div className="table-card-container">
            <div className="registros-table-container">
                <table className="manual-add-table">
                    <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Preço</th>
                        <th>ID</th>
                        <th>Descrição</th>
                    </tr>
                    </thead>
                    <tbody>
                    {rows.map((row, index) => (
                        <tr key={index}>
                        <td><input type="text" name="produto" value={row.produto} onChange={e => handleInputChange(index, e)} /></td>
                        <td><input type="text" name="preco" value={row.preco} onChange={e => handleInputChange(index, e)} /></td>
                        <td><input type="text" name="id" value={row.id} onChange={e => handleInputChange(index, e)} /></td>
                        <td><input type="text" name="descricao" value={row.descricao} onChange={e => handleInputChange(index, e)} /></td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
        <div className="manual-add-actions">
            <button onClick={onCancel} className="cancel-btn">Cancelar</button>
            <button onClick={addRow} className="add-row-btn">+ Adicionar Linha</button>
            <button onClick={handleSubmit} className="submit-products-btn">Adicionar Produtos</button>
        </div>
    </div>
  );
};

export default AddManualProductsTable;