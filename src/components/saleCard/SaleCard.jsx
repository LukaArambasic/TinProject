import React from 'react';
import './SaleCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan } from '@fortawesome/free-solid-svg-icons';

const SaleCard = ({ sale, onDelete }) => {
  const handleDelete = () => {
    if (window.confirm(`Jeste li sigurni da želite obrisati prodaju "${sale.product}"?`)) {
      onDelete(sale);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('hr-HR');
  };

  return (
    <div className="sale-card">
      <div className="sale-header">
        <h3 className="sale-product">{sale.product}</h3>
        <div className="sale-actions">
          <button 
            className="action-btn delete-btn" 
            onClick={handleDelete}
            title="Obriši prodaju"
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      </div>
      
      <div className="sale-details">
        <div className="sale-detail">
          <span className="detail-label">Količina</span>
          <span className="detail-value quantity-value">{sale.quantity} kom</span>
        </div>
        <div className="sale-detail">
          <span className="detail-label">Datum</span>
          <span className="detail-value date-value">{formatDate(sale.date)}</span>
        </div>
        <div className="sale-detail">
          <span className="detail-label">Profit</span>
          <span className="detail-value profit-value">€{sale.profit}</span>
        </div>
      </div>
    </div>
  );
};

export default SaleCard;