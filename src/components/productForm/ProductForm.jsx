import React, { useState, useEffect } from 'react';
import './ProductForm.css';
import apiService from '../../services/api';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    production_time: '',
    price: '',
    assemblies: [{ material: '', unit: '' }]
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
      // Load product assemblies for editing
      const loadProductAssemblies = async () => {
        try {
          const assemblies = await apiService.getProductAssemblies();
          const productAssemblies = assemblies.filter(assembly => assembly.product_id === product.id);
          const assemblyData = productAssemblies.map(assembly => ({
            material: assembly.material || '',
            unit: assembly.unit || ''
          }));
          
          setFormData({
            name: product.name || '',
            production_time: product.production_time || '',
            price: product.price || '',
            assemblies: assemblyData.length > 0 ? assemblyData : [{ material: '', unit: '' }]
          });
        } catch (err) {
          console.error('Error loading product assemblies:', err);
          setFormData({
            name: product.name || '',
            production_time: product.production_time || '',
            price: product.price || '',
            assemblies: [{ material: '', unit: '' }]
          });
        }
      };
      
      loadProductAssemblies();
    }
  }, [product]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAssemblyChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      assemblies: prev.assemblies.map((assembly, i) => 
        i === index ? { ...assembly, [field]: value } : assembly
      )
    }));
  };

  const addAssembly = () => {
    setFormData(prev => ({
      ...prev,
      assemblies: [...prev.assemblies, { material: '', unit: '' }]
    }));
  };

  const removeAssembly = (index) => {
    if (formData.assemblies.length > 1) {
      setFormData({
        ...formData,
        assemblies: formData.assemblies.filter((_, i) => i !== index)
      });
    }
  };

  const handleSubmit = async (e) => {
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

    // Filter out empty assemblies
    const validAssemblies = formData.assemblies.filter(
      assembly => assembly.material && assembly.unit
    );

    const productData = {
      name: formData.name,
      production_time: formData.production_time,
      price: parseFloat(formData.price).toFixed(2),
    };

    try {
      let savedProduct;
      if (product) {
        // Update existing product
        savedProduct = await apiService.updateProduct(product.id, productData);
        
        // Delete existing assemblies
        const existingAssemblies = await apiService.getProductAssemblies();
        const productAssemblies = existingAssemblies.filter(assembly => assembly.product_id === product.id);
        for (const assembly of productAssemblies) {
          await apiService.deleteProductAssembly(assembly.id);
        }
      } else {
        // Create new product
        savedProduct = await apiService.createProduct(productData);
      }
      
      // Create new assemblies
      for (const assembly of validAssemblies) {
        await apiService.createProductAssembly({
          product_id: savedProduct.id,
          material: assembly.material,
          unit: parseFloat(assembly.unit)
        });
      }
      
      onSubmit(savedProduct);
    } catch (err) {
      console.error('Error saving product:', err);
      alert('Greška pri spremanju proizvoda');
    }
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

      <div className="assemblies-section">
        <div className="assemblies-header">
          <div className="assemblies-title">
            ⚙️
            Potrebni materijali
          </div>
          <button
            type="button"
            className="add-assembly-btn"
            onClick={addAssembly}
          >
            ➕
            Dodaj materijal
          </button>
        </div>

        {formData.assemblies.map((assembly, index) => (
          <div key={index} className="assembly-group">
            <div className="assembly-group-header">
              <span className="assembly-group-title">Materijal {index + 1}</span>
              {formData.assemblies.length > 1 && (
                <button
                  type="button"
                  className="remove-assembly-btn"
                  onClick={() => removeAssembly(index)}
                >
                  🗑️
                </button>
              )}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Materijal</label>
                <select
                  value={assembly.material}
                  onChange={(e) => handleAssemblyChange(index, 'material', e.target.value)}
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
                  value={assembly.unit}
                  onChange={(e) => handleAssemblyChange(index, 'unit', e.target.value)}
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