import React from 'react';
import './SaleCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan } from '@fortawesome/free-solid-svg-icons';

const SaleCard = ({ sale, onEdit, onDelete }) => {
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
    <div className="sale-row">
      <div className="sale-content">
        <h3 className="sale-product">{sale.product}</h3>
        <span className="sale-quantity">{sale.quantity} kom</span>
        <span className="sale-date">{formatDate(sale.date)}</span>
        <span className="sale-profit">€{sale.profit}</span>
        <div className="sale-actions">
          <button 
            className="action-btn edit-btn" 
            onClick={() => onEdit(sale)}
            title="Uredi prodaju"
          >
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button 
            className="action-btn delete-btn" 
            onClick={handleDelete}
            title="Obriši prodaju"
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleCard;