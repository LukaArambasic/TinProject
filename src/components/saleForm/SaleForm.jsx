import React, { useState, useEffect } from 'react';
import './SaleForm.css';
import apiService from '../../services/api';

const SaleForm = ({ sale, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    product: '',
    discount: 0,
    no_of_units_sold: 1,
    date: new Date().toISOString().split('T')[0] // Today's date as default
  });
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [error, setError] = useState('');

  const getMaterialName = (materialId) => {
    const material = materials.find(m => m.id === materialId);
    return material ? material.name : `Material ID: ${materialId}`;
  };
  useEffect(() => {
    if (sale) {
      setFormData({
        product: sale.product || '',
        discount: sale.discount || 0,
        no_of_units_sold: sale.no_of_units_sold || 1,
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
    if (formData.product) {
      const product = availableProducts.find(p => p.id === parseInt(formData.product));
      setSelectedProduct(product);
      setError('');
    } else {
      setSelectedProduct(null);
      setError('');
    }
  }, [formData.product, availableProducts]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStock = () => {
    if (!selectedProduct) return true;

    const requiredMaterials = selectedProduct.materials || [];

    for (const requiredMaterial of requiredMaterials) {
      // Skip if material ID is undefined or null
      if (!requiredMaterial.material) continue;

      const materialInStock = materials.find(m => m.id === requiredMaterial.material);
      if (!materialInStock) {
        setError(`Materijal s ID "${requiredMaterial.material}" nije pronađen u skladištu`);
        return false;
      }

      const requiredAmount = parseInt(requiredMaterial.quantity);
      const availableStock = parseInt(materialInStock.stock);

      if (availableStock < requiredAmount) {
        const materialName = materialInStock.name;
        setError(`Nedovoljno materijala "${materialName}" na stanju. Potrebno: ${requiredAmount}, dostupno: ${availableStock}`);
        return false;
      }
    }

    setError('');
    return true;
  };

  useEffect(() => {
    if (selectedProduct) {
      validateStock();
    }
  }, [selectedProduct, materials]);

  const calculateTotal = () => {
    if (!selectedProduct) return 0;
    const basePrice = parseFloat(selectedProduct.price);
    const discountAmount = (basePrice * parseFloat(formData.discount)) / 100;
    const pricePerUnit = basePrice - discountAmount;
    const units = parseInt(formData.no_of_units_sold) || 1;
    return (pricePerUnit * units).toFixed(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.product) {
      setError('Molimo odaberite proizvod');
      return;
    }

    if (formData.discount < 0 || formData.discount > 100) {
      setError('Popust mora biti između 0 i 100%');
      return;
    }

    if (!validateStock()) {
      return;
    }

    const saleData = {
      product: parseInt(formData.product),
      discount: parseInt(formData.discount),
      no_of_units_sold: parseInt(formData.no_of_units_sold),
      profit: parseFloat(calculateTotal()),
      date: formData.date
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
                <option key={index} value={product.id}>
                  {product.name} (€{product.price})
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="discount" className="form-label">Popust (%)</label>
            <input
              type="number"
              id="discount"
              value={formData.discount}
              onChange={(e) => handleInputChange('discount', e.target.value)}
              className="form-input"
              placeholder="0"
              min="0"
              max="100"
              step="1"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="no_of_units_sold" className="form-label">Broj jedinica</label>
            <input
              type="number"
              id="no_of_units_sold"
              value={formData.no_of_units_sold}
              onChange={(e) => handleInputChange('no_of_units_sold', e.target.value)}
              className="form-input"
              placeholder="1"
              min="1"
              step="1"
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
            <span className="product-price">€{selectedProduct.price}</span>
          </div>
          
          {selectedProduct.materials && selectedProduct.materials.length > 0 && (
            <div className="product-materials">
              <div className="materials-title">Potrebni materijali:</div>
              <div className="materials-list">
                {selectedProduct.materials.map((material, index) => (
                  <span key={index} className="material-tag">
                    {getMaterialName(material.material)}: {material.quantity}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {formData.discount >= 0 && (
            <div className="sale-summary">
              <div className="summary-row">
                <span>Osnovna cijena po jedinici:</span>
                <span>€{selectedProduct.price}</span>
              </div>
              <div className="summary-row">
                <span>Popust:</span>
                <span>{formData.discount}%</span>
              </div>
              <div className="summary-row">
                <span>Cijena po jedinici nakon popusta:</span>
                <span>€{(parseFloat(selectedProduct.price) - (parseFloat(selectedProduct.price) * parseFloat(formData.discount)) / 100).toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Broj jedinica:</span>
                <span>{formData.no_of_units_sold || 1}</span>
              </div>
              <div className="summary-row" style={{ fontWeight: 'bold', borderTop: '1px solid var(--border-color)', paddingTop: 'var(--spacing-2)', marginTop: 'var(--spacing-2)' }}>
                <span>Ukupna cijena:</span>
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