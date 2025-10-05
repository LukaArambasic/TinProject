import React from 'react';
import './SaleCard.css';
import apiService from '../../services/api';

const SaleCard = ({ sale, onEdit, onDelete }) => {
  const [productName, setProductName] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadProductName = async () => {
      try {
        if (sale.product && typeof sale.product === 'object') {
          setProductName(sale.product.name);
          setLoading(false);
        } else if (sale.product_id) {
          const product = await apiService.getProduct(sale.product_id);
          setProductName(product.name);
          setLoading(false);
        } else {
          setProductName('Unknown Product');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setProductName(`Product ID: ${sale.product_id || sale.product?.id || 'N/A'}`);
        setLoading(false);
      }
    };

    loadProductName();
  }, [sale.product, sale.product_id]);

  const handleDelete = () => {
    if (window.confirm(`Jeste li sigurni da želite obrisati prodaju?`)) {
      onDelete(sale);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('hr-HR');
  };

  return (
    <div className="sale-row">
      <div className="sale-content">
        <h3 className="sale-product">
          {loading ? 'Učitavanje...' : productName}
        </h3>
        <span className="sale-quantity">{sale.discount}% popust</span>
        <span className="sale-date">{formatDate(sale.date)}</span>
        <span className="sale-profit">€{sale.profit}</span>
        <div className="sale-actions">
          <button 
            className="action-btn edit-btn" 
            onClick={() => onEdit(sale)}
            title="Uredi prodaju"
          >
            ✏️
          </button>
          <button 
            className="action-btn delete-btn" 
            onClick={handleDelete}
            title="Obriši prodaju"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleCard;