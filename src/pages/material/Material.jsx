import React, { useState, useEffect } from 'react';
import './Material.css';
import Container from '../../components/container/Container';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faEdit, faTrash, faSearch } from '@fortawesome/free-solid-svg-icons';

const Material = () => {
  const [materials, setMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: ''
  });

  useEffect(() => {
    const storedMaterials = localStorage.getItem('materials');
    if (storedMaterials) {
      setMaterials(JSON.parse(storedMaterials));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('materials', JSON.stringify(materials));
  }, [materials]);

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingMaterial) {
      setMaterials(materials.map(material =>
        material.id === editingMaterial.id
          ? { ...material, ...formData, price: parseFloat(formData.price), stock: parseInt(formData.stock) }
          : material
      ));
    } else {
      const newMaterial = {
        id: Date.now(),
        name: formData.name,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };
      setMaterials([...materials, newMaterial]);
    }

    setFormData({ name: '', price: '', stock: '' });
    setShowModal(false);
    setEditingMaterial(null);
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
      name: material.name,
      price: material.price.toString(),
      stock: material.stock.toString()
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setMaterials(materials.filter(material => material.id !== id));
  };

  const handleSupply = (id, amount) => {
    setMaterials(materials.map(material =>
      material.id === id
        ? { ...material, stock: material.stock + parseInt(amount) }
        : material
    ));
  };

  const openModal = () => {
    setFormData({ name: '', price: '', stock: '' });
    setEditingMaterial(null);
    setShowModal(true);
  };

  return (
    <Container>
      <div className="material-page">
        <div className="material-header">
          <h1>Materijali</h1>
          <button className="btn-primary" onClick={openModal}>
            <FontAwesomeIcon icon={faPlus} />
            Novi materijal
          </button>
        </div>

        <div className="search-bar">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            placeholder="Pretraži materijale..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="materials-grid">
          {filteredMaterials.map(material => (
            <MaterialCard
              key={material.id}
              material={material}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onSupply={handleSupply}
            />
          ))}
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>{editingMaterial ? 'Uredi materijal' : 'Novi materijal'}</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Naziv:</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Cijena (KM):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Zaliha:</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
                <div className="form-actions">
                  <button type="button" onClick={() => setShowModal(false)}>
                    Otkaži
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingMaterial ? 'Ažuriraj' : 'Dodaj'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
};

const MaterialCard = ({ material, onEdit, onDelete, onSupply }) => {
  const [supplyAmount, setSupplyAmount] = useState('');

  const handleSupplySubmit = (e) => {
    e.preventDefault();
    if (supplyAmount && parseInt(supplyAmount) > 0) {
      onSupply(material.id, supplyAmount);
      setSupplyAmount('');
    }
  };

  const getStockColor = (stock) => {
    if (stock <= 10) return '#ff4757';
    if (stock >= 50) return '#2ed573';
    return '#ffa502';
  };

  return (
    <div className="material-card">
      <div className="material-info">
        <h3>{material.name}</h3>
        <p className="price">{material.price.toFixed(2)} KM</p>
        <p className="stock" style={{ color: getStockColor(material.stock) }}>
          Zaliha: {material.stock}
        </p>
      </div>
      
      <div className="material-actions">
        <button onClick={() => onEdit(material)} className="btn-edit">
          <FontAwesomeIcon icon={faEdit} />
        </button>
        <button onClick={() => onDelete(material.id)} className="btn-delete">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>

      <div className="supply-section">
        <form onSubmit={handleSupplySubmit} className="supply-form">
          <input
            type="number"
            placeholder="Količina"
            value={supplyAmount}
            onChange={(e) => setSupplyAmount(e.target.value)}
            min="1"
            className="supply-input"
          />
          <button type="submit" className="supply-btn">
            Dodaj
          </button>
        </form>
      </div>
    </div>
  );
};

export default Material;