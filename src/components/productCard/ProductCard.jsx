import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Jeste li sigurni da želite obrisati proizvod "${product.name}"?`)) {
      onDelete(product);
    }
  };

  return (
    <div className="product-card">
      <div className="product-header">
        <h3 className="product-name">{product.name}</h3>
        <div className="product-actions">
          <button 
            className="action-btn edit-btn" 
            onClick={() => onEdit(product)}
            title="Uredi proizvod"
          >
            ✏️
          </button>
          <button 
            className="action-btn delete-btn" 
            onClick={handleDelete}
            title="Obriši proizvod"
          >
            🗑️
          </button>
        </div>
      </div>
      
      <div className="product-details">
        <div className="product-detail">
          <span className="detail-label">Prodajna cijena</span>
          <span className="detail-value price-value">€{product.pricePerUnit}</span>
        </div>
        <div className="product-detail">
          <span className="detail-label">Vrijeme izrade</span>
          <span className="detail-value time-value">{product.timeToMake} min</span>
        </div>
      </div>
      
      {product.materials && product.materials.length > 0 && (
        <div className="materials-section">
          <div className="materials-title">
            ⚙️
            Potrebni materijali
          </div>
          <div className="materials-list">
            {product.materials.map((material, index) => (
              <div key={index} className="material-tag">
                <span className="material-name">{material.material}</span>
                <span className="material-quantity">{material.unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCard;