// src/utils/calculations.js
import { materialsData } from '../data/materials';

const TAXA_MERCADO = 0.18;
const MARGEM_LUCRO = 0.35;

const materialsGroupedByName = materialsData.reduce((acc, material) => {
  const name = material.nome;
  if (!acc[name]) {
    acc[name] = [];
  }
  acc[name].push(material);
  return acc;
}, {});

export const getPriceByFilter = (materialName, filter) => {
  const materialOptions = materialsGroupedByName[materialName];
  if (!materialOptions || materialOptions.length === 0) return 0;

  switch (filter.type) {
    case 'data':
      return [...materialOptions].sort((a, b) => new Date(b.data) - new Date(a.data))[0].valor;
    case 'fornecedor':
      const specific = materialOptions.find(m => m.fornecedor === filter.value);
      if (specific) {
        return specific.valor;
      } else {
        return [...materialOptions].sort((a, b) => new Date(b.data) - new Date(a.data))[0].valor;
      }
    case 'mais_barato':
        return Math.min(...materialOptions.map(m => m.valor));
    default:
      return materialOptions[0].valor;
  }
};

export const calculateUnitCost = (product, filter) => {
  if (!product.billOfMaterials) return 0;

  return product.billOfMaterials.reduce((totalCost, item) => {
    const materialInfo = materialsData.find(m => m.id.startsWith(item.materialId));
    if (materialInfo) {
      const price = getPriceByFilter(materialInfo.nome, filter);
      return totalCost + (price * item.quantidade);
    }
    return totalCost;
  }, 0);
};

export const calculateSuggestedPrice = (unitCost) => {
  if (unitCost === 0) return 0;
  const costWithTaxes = unitCost * (1 + TAXA_MERCADO);
  const suggestedPrice = costWithTaxes / (1 - MARGEM_LUCRO);
  return suggestedPrice;
};