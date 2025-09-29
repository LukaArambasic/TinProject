import React, { useState, useEffect } from 'react';
import './SaleForm.css';
import apiService from '../../services/api';

const SaleForm = ({ sale, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    product_id: '',
    discount: 0,
    date: new Date().toISOString().split('T')[0]
  });
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (sale) {
      setFormData({
        product_id: sale.product_id || '',
        discount: sale.discount || 0,
        date: sale.date || new Date().toISOString().split('T')[0]
      });
    }
  }, [sale]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [products, materialsData] = await Promise.all([
          apiService.getProducts(),
          apiService.getMaterials()
        ]);
        setAvailableProducts(products);
        setMaterials(materialsData);
      } catch (err) {
        console.error('Error loading data:', err);
        setAvailableProducts([]);
        setMaterials([]);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (formData.product_id) {
      const product = availableProducts.find(p => p.id === parseInt(formData.product_id));
      setSelectedProduct(product);
      setError('');
    } else {
      setSelectedProduct(null);
      setError('');
    }
  }, [formData.product_id, availableProducts]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStock = () => {
    if (!selectedProduct || !formData.quantity) return true;

    const requiredMaterials = selectedProduct.materials || [];
    
    for (const requiredMaterial of requiredMaterials) {
      const materialInStock = materials.find(m => m.name === requiredMaterial.material);
      if (!materialInStock) {
        setError(`Materijal "${requiredMaterial.material}" nije pronađen u skladištu`);
        return false;
      }
      
      const requiredAmount = parseFloat(requiredMaterial.unit) * parseInt(formData.quantity);
      const availableStock = parseInt(materialInStock.stock);
      
      if (availableStock < requiredAmount) {
        setError(`Nedovoljno materijala "${requiredMaterial.material}" na stanju. Potrebno: ${requiredAmount}, dostupno: ${availableStock}`);
        return false;
      }
    }
    
    setError('');
    return true;
  };

  useEffect(() => {
    if (selectedProduct && formData.quantity) {
      validateStock();
    }
  }, [selectedProduct, formData.quantity, materials]);

  const calculateTotal = () => {
    if (!selectedProduct || !formData.quantity) return 0;
    return (parseFloat(selectedProduct.pricePerUnit) * parseInt(formData.quantity)).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.product) {
      setError('Molimo odaberite proizvod');
      return;
    }
    
    if (!formData.quantity || parseInt(formData.quantity) <= 0) {
      setError('Molimo unesite valjanu količinu');
      return;
    }
    
    if (!validateStock()) {
      return;
    }

    const saleData = {
      ...formData,
      quantity: parseInt(formData.quantity),
      profit: calculateTotal()
    };

    onSubmit(saleData);
  };

  return (
    <form className="sale-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="product" className="form-label">Proizvod</label>
            <select
              id="product"
              value={formData.product}
              onChange={(e) => handleInputChange('product', e.target.value)}
              className="form-select"
              required
            >
              <option value="">-- Odaberite proizvod --</option>
              {availableProducts.map((product, index) => (
                <option key={index} value={product.name}>
                  {product.name} (€{product.pricePerUnit})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="quantity" className="form-label">Količina</label>
            <input
              type="number"
              id="quantity"
              value={formData.quantity}
              onChange={(e) => handleInputChange('quantity', e.target.value)}
              className="form-input"
              placeholder="1"
              min="1"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="date" className="form-label">Datum prodaje</label>
            <input
              type="date"
              id="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className="form-input"
              required
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {selectedProduct && (
        <div className="product-preview">
          <div className="product-preview-header">
            <span className="product-preview-title">{selectedProduct.name}</span>
            <span className="product-price">€{selectedProduct.pricePerUnit}/kom</span>
          </div>
          
          {selectedProduct.materials && selectedProduct.materials.length > 0 && (
            <div className="product-materials">
              <div className="materials-title">Potrebni materijali po komadu:</div>
              <div className="materials-list">
                {selectedProduct.materials.map((material, index) => (
                  <span key={index} className="material-tag">
                    {material.material}: {material.unit}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {formData.quantity > 0 && (
            <div className="sale-summary">
              <div className="summary-row">
                <span>Količina:</span>
                <span>{formData.quantity} kom</span>
              </div>
              <div className="summary-row">
                <span>Cijena po komadu:</span>
                <span>€{selectedProduct.pricePerUnit}</span>
              </div>
              <div className="summary-row">
                <span>Ukupno:</span>
                <span>€{calculateTotal()}</span>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="btn btn-cancel" onClick={onCancel}>
          ❌
          Odustani
        </button>
        <button type="submit" className="btn btn-primary" disabled={!!error}>
          ✅
          {sale ? 'Ažuriraj prodaju' : 'Potvrdi prodaju'}
        </button>
      </div>
    </form>
  );
};

export default SaleForm;