import React, { useState, useEffect } from 'react';
import './Material.css';
import Header from '../../components/header/Header';
import MaterialCard from '../../components/materialCard/MaterialCard';
import MaterialForm from '../../components/materialForm/MaterialForm';
import Modal from '../../components/modal/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const Material = () => {
  const [materials, setMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = () => {
    const storedMaterials = JSON.parse(localStorage.getItem('material')) || [];
    setMaterials(storedMaterials);
  };

  const handleSubmit = (materialData) => {
    const existingMaterials = JSON.parse(localStorage.getItem('material')) || [];
    
    if (editingMaterial) {
      // Update existing material
      const updatedMaterials = existingMaterials.map(material => 
        JSON.stringify(material) === JSON.stringify(editingMaterial) 
          ? materialData 
          : material
      );
      localStorage.setItem('material', JSON.stringify(updatedMaterials));
    } else {
      // Add new material
      existingMaterials.push(materialData);
      localStorage.setItem('material', JSON.stringify(existingMaterials));
    }
    
    loadMaterials();
    setShowModal(false);
    setEditingMaterial(null);
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setShowModal(true);
  };

  const handleDelete = (materialToDelete) => {
    const existingMaterials = JSON.parse(localStorage.getItem('material')) || [];
    const updatedMaterials = existingMaterials.filter(material => 
      JSON.stringify(material) !== JSON.stringify(materialToDelete)
    );
    localStorage.setItem('material', JSON.stringify(updatedMaterials));
    loadMaterials();
  };

  const handleSupply = (material, amount) => {
    const existingMaterials = JSON.parse(localStorage.getItem('material')) || [];
    const updatedMaterials = existingMaterials.map(m => {
      if (JSON.stringify(m) === JSON.stringify(material)) {
        return {
          ...m,
          stock: (parseInt(m.stock) + parseInt(amount)).toString()
        };
      }
      return m;
    });
    localStorage.setItem('material', JSON.stringify(updatedMaterials));
    loadMaterials();
  };

  const filteredMaterials = materials.filter(material =>
    material.name && material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="material-page">
      <Header pageName="Materijal" />
      
      <div className="material-content">
        <div className="material-header">
          <div className="search-section">
            <input
              type="text"
              placeholder="Pretraži materijale..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <button 
            className="btn btn-primary"
            onClick={() => setShowModal(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
            Novi materijal
          </button>
        </div>

        <div className="materials-grid">
          {filteredMaterials.length > 0 ? (
            filteredMaterials.map((material, index) => (
              <MaterialCard
                key={index}
                material={material}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onSupply={handleSupply}
              />
            ))
          ) : (
            <div className="no-materials">
              {searchTerm ? 'Nema materijala koji odgovaraju pretrazi.' : 'Nema dodanih materijala.'}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <Modal onClose={() => {
          setShowModal(false);
          setEditingMaterial(null);
        }}>
          <MaterialForm
            material={editingMaterial}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowModal(false);
              setEditingMaterial(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};

export default Material;