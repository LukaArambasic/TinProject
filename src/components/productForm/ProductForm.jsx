import React, { useState, useEffect } from 'react';
import './ProductForm.css';
import apiService from '../../services/api';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    production_time: '',
    price: '',
    materials: [{ material: '', unit: '' }]
  });
  const [availableMaterials, setAvailableMaterials] = useState([]);

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const materials = await apiService.getMaterials();
        setAvailableMaterials(materials);
      } catch (err) {
        console.error('Error loading materials:', err);
        setAvailableMaterials([]);
      }
    };
    
    loadMaterials();

    if (product) {
      setFormData({
        name: product.name || '',
        production_time: product.production_time || '',
        price: product.price || '',
        materials: product.materials && product.materials.length > 0 
          ? product.materials 
          : [{ material: '', unit: '' }]
      });
    }
  }, [product]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMaterialChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      materials: prev.materials.map((material, i) => 
        i === index ? { ...material, [field]: value } : material
      )
    }));
  };

  const addMaterial = () => {
    setFormData(prev => ({
      ...prev,
      materials: [...prev.materials, { material: '', unit: '' }]
    }));
  };

  const removeMaterial = (index) => {
    if (formData.materials.length > 1) {
      setFormData(prev => ({
        ...prev,
        materials: prev.materials.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      alert('Molimo unesite naziv proizvoda');
      return;
    }
    
    if (!formData.production_time || isNaN(formData.production_time)) {
      alert('Molimo unesite valjano vrijeme izrade');
      return;
    }
    
    if (!formData.price || isNaN(formData.price)) {
      alert('Molimo unesite valjanu cijenu');
      return;
    }

    // Filter out empty materials
    const validMaterials = formData.materials.filter(
      material => material.material && material.unit
    );

    const productData = {
      ...formData,
      price: parseFloat(formData.price).toFixed(2),
      materials: validMaterials
    };

    onSubmit(productData);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Naziv proizvoda</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="form-input"
              placeholder="Unesite naziv proizvoda"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="production_time" className="form-label">Vrijeme izrade (min)</label>
            <input
              type="number"
              id="production_time"
              value={formData.production_time}
              onChange={(e) => handleInputChange('production_time', e.target.value)}
              className="form-input"
              placeholder="0"
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price" className="form-label">Prodajna cijena (€)</label>
            <input
              type="number"
              id="price"
              value={formData.price}
              onChange={(e) => handleInputChange('price', e.target.value)}
              className="form-input"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>
      </div>

      <div className="materials-section">
        <div className="materials-header">
          <div className="materials-title">
            ⚙️
            Potrebni materijali
          </div>
          <button
            type="button"
            className="add-material-btn"
            onClick={addMaterial}
          >
            ➕
            Dodaj materijal
          </button>
        </div>

        {formData.materials.map((material, index) => (
          <div key={index} className="material-group">
            <div className="material-group-header">
              <span className="material-group-title">Materijal {index + 1}</span>
              {formData.materials.length > 1 && (
                <button
                  type="button"
                  className="remove-material-btn"
                  onClick={() => removeMaterial(index)}
                >
                  🗑️
                </button>
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Materijal</label>
                <select
                  value={material.material}
                  onChange={(e) => handleMaterialChange(index, 'material', e.target.value)}
                  className="form-select"
                  required
                >
                  <option value="">-- Odaberite materijal --</option>
                  {availableMaterials.map((mat, i) => (
                    <option key={i} value={mat.name}>
                      {mat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Količina</label>
                <input
                  type="number"
                  value={material.unit}
                  onChange={(e) => handleMaterialChange(index, 'unit', e.target.value)}
                  className="form-input"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-cancel" onClick={onCancel}>
          ❌
          Odustani
        </button>
        <button type="submit" className="btn btn-primary">
          ✅
          {product ? 'Ažuriraj' : 'Stvori'} proizvod
        </button>
      </div>
    </form>
  );
};

export default ProductForm;