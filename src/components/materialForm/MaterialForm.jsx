import React, { useState, useEffect } from 'react';
import './MaterialForm.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

const MaterialForm = ({ material, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    costPerUnit: '',
    stock: ''
  });

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name || '',
        costPerUnit: material.costPerUnit || '',
        stock: material.stock || ''
      });
    }
  }, [material]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name.trim()) {
      alert('Molimo unesite naziv materijala');
      return;
    }
    
    if (!formData.costPerUnit || isNaN(formData.costPerUnit)) {
      alert('Molimo unesite valjanu cijenu');
      return;
    }
    
    if (!formData.stock || isNaN(formData.stock)) {
      alert('Molimo unesite valjanu količinu');
      return;
    }

    const materialData = {
      ...formData,
      costPerUnit: parseFloat(formData.costPerUnit).toFixed(2),
      stock: parseInt(formData.stock)
    };

    onSubmit(materialData);
  };

  return (
    <form className="material-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name" className="form-label">Naziv materijala</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="form-input"
              placeholder="Unesite naziv materijala"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="costPerUnit" className="form-label">Cijena po jedinici (€)</label>
            <input
              type="number"
              id="costPerUnit"
              value={formData.costPerUnit}
              onChange={(e) => handleInputChange('costPerUnit', e.target.value)}
              className="form-input"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="stock" className="form-label">Početna količina</label>
            <input
              type="number"
              id="stock"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', e.target.value)}
              className="form-input"
              placeholder="0"
              min="0"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-cancel" onClick={onCancel}>
          <FontAwesomeIcon icon={faTimes} />
          Odustani
        </button>
        <button type="submit" className="btn btn-primary">
          <FontAwesomeIcon icon={faCheck} />
          {material ? 'Ažuriraj' : 'Stvori'} materijal
        </button>
      </div>
    </form>
  );
};

export default MaterialForm;