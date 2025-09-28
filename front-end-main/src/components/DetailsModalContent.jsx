import React from 'react';

const DetailsModalContent = ({ item, type }) => {
  if (!item) return null;

  if (type === 'Produtos') {
    return (
      <div className="details-modal-content">
        <h2 className="details-modal-title">{item.produto}</h2>
        <h3 className="details-modal-subtitle">Insumos e quantidades:</h3>
        <ul className="details-modal-list">
          {/* Adicionado 'optional chaining' para segurança */}
          {item.insumos?.map((insumo, index) => (
            <li key={index}>• {insumo.nome}: {insumo.qtd}</li>
          ))}
        </ul>
        {item.descricao && <p className="details-modal-note"><strong>Descrição:</strong> {item.descricao}</p>}
        {item.obs && <p className="details-modal-note"><strong>OBS:</strong> {item.obs}</p>}
      </div>
    );
  }

  if (type === 'Matéria-prima') {
    return (
      <div className="details-modal-content">
        {/* CORREÇÃO: "insumo" trocado para "nome" */}
        <h2 className="details-modal-title">{item.nome}</h2>
        <h3 className="details-modal-subtitle">Usado em:</h3>
        <ul className="details-modal-list">
          {/* Adicionado 'optional chaining' para segurança */}
          {item.usadoEm?.map((produto, index) => (
            <li key={index}>• {produto}</li>
          ))}
        </ul>
      </div>
    );
  }

  return <div>Detalhes não disponíveis para esta categoria.</div>;
};

export default DetailsModalContent;