import React, { useState } from 'react';
import './MaterialCard.css';

const MaterialCard = ({ material, onEdit, onDelete, onSupply }) => {
  const [supplyAmount, setSupplyAmount] = useState('');

  const handleDelete = () => {
    if (window.confirm(`Jeste li sigurni da želite obrisati materijal "${material.name}"?`)) {
      onDelete(material);
    }
  };

  const handleSupply = () => {
    const amount = parseInt(supplyAmount);
    if (amount && amount > 0) {
      onSupply(material, amount);
      setSupplyAmount('');
    }
  };

  const getStockStatus = (stock) => {
    const stockNum = parseInt(stock);
    if (stockNum <= 10) return 'low-stock';
    if (stockNum >= 50) return 'good-stock';
    return '';
  };

  return (
    <div className="material-card">
      <div className="material-header">
        <h3 className="material-name">{material.name}</h3>
        <div className="material-actions">
          <button 
            className="action-btn edit-btn" 
            onClick={() => onEdit(material)}
            title="Uredi materijal"
          >
            ✏️
          </button>
          <button 
            className="action-btn delete-btn" 
            onClick={handleDelete}
            title="Obriši materijal"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="material-details">
        <div className="material-detail">
          <span className="detail-label">Količina na stanju</span>
          <span className={`detail-value stock-value ${getStockStatus(material.stock)}`}>
            {material.stock}
          </span>
        </div>
        <div className="material-detail">
          <span className="detail-label">Cijena po jedinici</span>
          <span className="detail-value price-value">€{material.price_per_unit}</span>
        </div>
      </div>
      
      <div className="supply-section">
        <div className="supply-controls">
          <span className="supply-label">Nabavka:</span>
          <input
            type="number"
            value={supplyAmount}
            onChange={(e) => setSupplyAmount(e.target.value)}
            className="supply-input"
            placeholder="0"
            min="1"
          />
          <button 
            className="supply-btn"
            onClick={handleSupply}
            disabled={!supplyAmount || parseInt(supplyAmount) <= 0}
          >
            ➕
            Dodaj
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialCard;