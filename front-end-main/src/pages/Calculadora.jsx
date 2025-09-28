import React, { useState, useEffect } from 'react';
import { productsData } from '../data/products';
import { materialsData, allSuppliers } from '../data/materials';
import { calculateUnitCost, getPriceByFilter } from '../utils/calculations'; // Importando a função 'getPriceByFilter'

const Calculadora = ({ onPriceUpdate }) => {
  const [selectedProductId, setSelectedProductId] = useState(productsData.length > 0 ? productsData[0].id : '');
  const [quantity, setQuantity] = useState(25);
  const [filterType, setFilterType] = useState('data');
  const [selectedSupplier, setSelectedSupplier] = useState(allSuppliers.length > 0 ? allSuppliers[0] : '');
  
  const [calculationResult, setCalculationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Efeito para resetar o cálculo quando o usuário muda os parâmetros
  useEffect(() => {
    setCalculationResult(null);
  }, [selectedProductId, quantity, filterType, selectedSupplier]);

  const handleCalculate = () => {
    setIsLoading(true);
    setCalculationResult(null);

    const product = productsData.find(p => p.id === selectedProductId);
    if (!product) {
        setIsLoading(false);
        return;
    }

    const filter = {
        type: filterType,
        value: filterType === 'fornecedor' ? selectedSupplier : null
    };

    const unitCost = calculateUnitCost(product, filter);
    const totalCost = unitCost * quantity;

    setTimeout(() => {
        // >>>>> LÓGICA CORRIGIDA AQUI <<<<<
        // Usamos a função getPriceByFilter para encontrar o preço correto de cada insumo
        const detailedMaterials = product.billOfMaterials.map(item => {
            const materialInfo = materialsData.find(m => m.id.startsWith(item.materialId));
            const pricePerUnit = getPriceByFilter(materialInfo.nome, filter);
            return {
                name: materialInfo.nome,
                measure: materialInfo.medida,
                price: pricePerUnit * item.quantidade, // Custo do insumo para 1 produto
            }
        });

        setCalculationResult({ 
            totalCost, 
            materials: detailedMaterials,
            quantity: quantity // Passando a quantidade para o resultado
        });

        if (onPriceUpdate) {
            onPriceUpdate(selectedProductId, unitCost);
        }
        setIsLoading(false);
    }, 500);
  };
  
  return (
    <div>
      <h1 className="page-header">Calculadora de custo</h1>
      <p className="page-subheader">Calcule o custo detalhado dos seus produtos</p>
      
      <div className="calculator-wrapper">
        <div className="calculator-form-panel">
          <div className="form-group-calc">
            <label>Produto</label>
            <select className="form-control-calc" value={selectedProductId} onChange={(e) => setSelectedProductId(e.target.value)}>
              {productsData.map(p => <option key={p.id} value={p.id}>{p.produto}</option>)}
            </select>
          </div>
          <div className="form-group-calc">
            <label>Quantidade</label>
            <input type="number" className="form-control-calc" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          </div>
          <div className="form-group-calc">
            <label>Filtro de Custo</label>
            <select className="form-control-calc" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="data">Cotação Mais Recente</option>
              <option value="fornecedor">Por Fornecedor</option>
              <option value="mais_barato">Menor Preço</option>
            </select>
          </div>
          
          {filterType === 'fornecedor' && (
            <div className="form-group-calc">
              <label>Fornecedor</label>
              <select className="form-control-calc" value={selectedSupplier} onChange={(e) => setSelectedSupplier(e.target.value)}>
                {allSuppliers.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          <button className="btn-calculate-main" onClick={handleCalculate} disabled={isLoading}>
            {isLoading ? 'Calculando...' : 'Calcular'}
          </button>
        </div>

        <div className="calculator-results-panel">
            <h2>Matéria-prima</h2>
            <div className="results-table-calc">
                <div className="results-table-header-calc">
                    <span>Nome</span>
                    <span>Medida</span>
                    <span>Preço Total</span>
                </div>
                <div className="results-table-body-calc">
                    {isLoading && <p className="loading-text">Buscando resultados...</p>}
                    {calculationResult && calculationResult.materials.map((mat, index) => (
                        <div key={index} className="results-item-calc">
                            <span>{mat.name}</span>
                            <span>{mat.measure}</span>
                            {/* Multiplica o custo do insumo (para 1 produto) pela quantidade total */}
                            <span>{`R$ ${(mat.price * calculationResult.quantity).toFixed(2).replace('.', ',')}`}</span>
                        </div>
                    ))}
                </div>
            </div>
            {calculationResult && (
                <div className="total-cost-container-calc">
                    <span className="total-cost-label-calc">CUSTO TOTAL</span>
                    <div className="total-cost-value-calc">
                        {`R$ ${calculationResult.totalCost.toFixed(2).replace('.', ',')}`}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Calculadora;