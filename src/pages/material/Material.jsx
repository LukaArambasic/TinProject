import React, { useEffect, useState } from "react";
import './Material.css';
import '../../App.css';
import Header from "../../components/header/Header";
import Container from "../../components/container/Container";
import Navbar from "../../components/navbar/Navbar";
import Modal from "../../components/modal/Modal";
import MaterialCard from "../../components/materialCard/MaterialCard";
import MaterialForm from "../../components/materialForm/MaterialForm";

const Material = () => {
    const [materials, setMaterials] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadMaterials();
    }, []);

    const loadMaterials = () => {
        const data = JSON.parse(localStorage.getItem('material')) || [];
        setMaterials(data);
    };

    const handleCreateMaterial = () => {
        setEditingMaterial(null);
        setIsModalOpen(true);
    };

    const handleEditMaterial = (material) => {
        setEditingMaterial(material);
        setIsModalOpen(true);
    };

    const handleDeleteMaterial = (materialToDelete) => {
        const updatedMaterials = materials.filter(material => 
            JSON.stringify(material) !== JSON.stringify(materialToDelete)
        );
        localStorage.setItem('material', JSON.stringify(updatedMaterials));
        setMaterials(updatedMaterials);
    };

    const handleSupplyMaterial = (materialToSupply, amount) => {
        const updatedMaterials = materials.map(material => {
            if (JSON.stringify(material) === JSON.stringify(materialToSupply)) {
                return {
                    ...material,
                    stock: parseInt(material.stock) + amount
                };
            }
            return material;
        });
        
        localStorage.setItem('material', JSON.stringify(updatedMaterials));
        setMaterials(updatedMaterials);
    };

    const handleSubmitMaterial = (materialData) => {
        let updatedMaterials;
        
        if (editingMaterial) {
            // Update existing material
            updatedMaterials = materials.map(material => 
                JSON.stringify(material) === JSON.stringify(editingMaterial) 
                    ? materialData 
                    : material
            );
        } else {
            // Add new material
            updatedMaterials = [...materials, materialData];
        }
        
        localStorage.setItem('material', JSON.stringify(updatedMaterials));
        setMaterials(updatedMaterials);
        setIsModalOpen(false);
        setEditingMaterial(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingMaterial(null);
    };

    const filteredMaterials = materials.filter(material =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='App FlexRow'>
            <Navbar />
            <div className="main-content">
                <Header pageName="Materijali" />
                <div className='RestOfScreen'>
                    <Container headline="📦 Upravljanje materijalima">
                        <div className="materials-header">
                            <div className="search-container">
                                <div className="search-input-wrapper">
                                    <span className="search-icon">🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Pretraži materijale..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                            </div>
                            <button 
                                className="btn btn-primary"
                                onClick={handleCreateMaterial}
                            >
                                ➕
                                Novi materijal
                            </button>
                        </div>

                        {filteredMaterials.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-content">
                                    {searchTerm ? (
                                        <>
                                            <p className="text-muted mb-4">
                                                Nema materijala koji odgovaraju pretraživanju "{searchTerm}"
                                            </p>
                                            <button 
                                                className="btn btn-secondary"
                                                onClick={() => setSearchTerm('')}
                                            >
                                                Očisti pretraživanje
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-muted mb-4">Nema dodanih materijala</p>
                                            <button 
                                                className="btn btn-primary"
                                                onClick={handleCreateMaterial}
                                            >
                                                ➕
                                                Dodaj prvi materijal
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="materials-grid">
                                {filteredMaterials.map((material, index) => (
                                    <MaterialCard
                                        key={`${material.name}-${index}`}
                                        material={material}
                                        onEdit={handleEditMaterial}
                                        onEdit={handleEditMaterial}
                                        onDelete={handleDeleteMaterial}
                                        onSupply={handleSupplyMaterial}
                                    />
                                ))}
                            </div>
                        )}
                    </Container>
                </div>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingMaterial ? 'Uredi materijal' : 'Novi materijal'}
            >
                <MaterialForm
                    material={editingMaterial}
                    onSubmit={handleSubmitMaterial}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
}

export default Material;