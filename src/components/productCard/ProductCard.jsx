import React from 'react';
import './ProductCard.css';
import apiService from '../../services/api';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const [assemblies, setAssemblies] = React.useState([]);
  const [materials, setMaterials] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading data for product:', product.id);
        const [allAssemblies, allMaterials] = await Promise.all([
          apiService.getProductAssemblies(),
          apiService.getMaterials()
        ]);
        console.log('All assemblies:', allAssemblies);
        console.log('All materials:', allMaterials);
        
        const productAssemblies = allAssemblies.filter(assembly => assembly.product === product.id);
        console.log('Product assemblies for product', product.id, ':', productAssemblies);
        
        setAssemblies(productAssemblies);
        setMaterials(allMaterials);
      } catch (err) {
        console.error('Error loading data:', err);
        setAssemblies([]);
        setMaterials([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [product.id]);

  const getMaterialName = (materialId) => {
    const material = materials.find(m => m.id === materialId);
    return material ? material.name : `Material ID: ${materialId}`;
  };
  
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
          <span className="detail-value price-value">€{product.price}</span>
        </div>
        <div className="product-detail">
          <span className="detail-label">Vrijeme izrade</span>
          <span className="detail-value time-value">{product.production_time} min</span>
        </div>
      </div>
      
      <div className="materials-section">
        <div className="materials-title">
          ⚙️
          Potrebni materijali
        </div>
        {loading ? (
          <p className="text-muted text-sm">Učitavanje materijala...</p>
        ) : assemblies.length > 0 ? (
          <div className="materials-list">
            {assemblies.map((assembly, index) => (
              <div key={index} className="material-tag">
                <span className="material-name">{getMaterialName(assembly.material)}</span>
                <span className="material-quantity">x{assembly.quantity}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted text-sm">Nema definiranih materijala</p>
        )}
      </div>
    </div>
  );
};

export default ProductCard;