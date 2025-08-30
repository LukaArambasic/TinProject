import React, { useState, useEffect } from 'react';
import './ProductForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faCog, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    timeToMake: '',
    pricePerUnit: '',
    materials: [{ material: '', unit: '' }]
  });
  const [availableMaterials, setAvailableMaterials] = useState([]);

  useEffect(() => {
    const materials = JSON.parse(localStorage.getItem('material')) || [];
    setAvailableMaterials(materials);

    if (product) {
      setFormData({
        name: product.name || '',
        timeToMake: product.timeToMake || '',
        pricePerUnit: product.pricePerUnit || '',
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
    
    if (!formData.timeToMake || isNaN(formData.timeToMake)) {
      alert('Molimo unesite valjano vrijeme izrade');
      return;
    }
    
    if (!formData.pricePerUnit || isNaN(formData.pricePerUnit)) {
      alert('Molimo unesite valjanu cijenu');
      return;
    }

    // Filter out empty materials
    const validMaterials = formData.materials.filter(
      material => material.material && material.unit
    );

    const productData = {
      ...formData,
      pricePerUnit: parseFloat(formData.pricePerUnit).toFixed(2),
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
            <label htmlFor="timeToMake" className="form-label">Vrijeme izrade (min)</label>
            <input
              type="number"
              id="timeToMake"
              value={formData.timeToMake}
              onChange={(e) => handleInputChange('timeToMake', e.target.value)}
              className="form-input"
              placeholder="0"
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="pricePerUnit" className="form-label">Prodajna cijena (€)</label>
            <input
              type="number"
              id="pricePerUnit"
              value={formData.pricePerUnit}
              onChange={(e) => handleInputChange('pricePerUnit', e.target.value)}
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
            <FontAwesomeIcon icon={faCog} />
            Potrebni materijali
          </div>
          <button
            type="button"
            className="add-material-btn"
            onClick={addMaterial}
          >
            <FontAwesomeIcon icon={faPlus} />
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
                  <FontAwesomeIcon icon={faTrash} />
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
          <FontAwesomeIcon icon={faTimes} />
          Odustani
        </button>
        <button type="submit" className="btn btn-primary">
          <FontAwesomeIcon icon={faCheck} />
          {product ? 'Ažuriraj' : 'Stvori'} proizvod
        </button>
      </div>
    </form>
  );
};

export default ProductForm;