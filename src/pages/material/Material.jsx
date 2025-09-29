import React, { useEffect, useState } from "react";
import './Material.css';
import '../../App.css';
import apiService from '../../services/api';
import Header from "../../components/header/Header";
import Container from "../../components/container/Container";
import Navbar from "../../components/navbar/Navbar";
import Modal from "../../components/modal/Modal";
import MaterialCard from "../../components/materialCard/MaterialCard";
import MaterialForm from "../../components/materialForm/MaterialForm";

const Material = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadMaterials();
    }, []);

    const loadMaterials = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getMaterials();
            setMaterials(data);
        } catch (err) {
            setError('Greška pri dohvaćanju materijala');
            console.error('Error loading materials:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateMaterial = () => {
        setEditingMaterial(null);
        setIsModalOpen(true);
    };

    const handleEditMaterial = (material) => {
        setEditingMaterial(material);
        setIsModalOpen(true);
    };

    const handleDeleteMaterial = async (materialToDelete) => {
        try {
            await apiService.deleteMaterial(materialToDelete.id);
            // Reload materials to get fresh data
            await loadMaterials();
        } catch (err) {
            alert('Greška pri brisanju materijala');
            console.error('Error deleting material:', err);
        }
    };

    const handleSupplyMaterial = async (materialToSupply, amount) => {
        try {
            const updatedMaterial = {
                ...materialToSupply,
                stock: parseInt(materialToSupply.stock) + amount
            };
            
            await apiService.updateMaterial(materialToSupply.id, updatedMaterial);
            // Reload materials to get fresh data
            await loadMaterials();
        } catch (err) {
            alert('Greška pri ažuriranju zaliha');
            console.error('Error updating material stock:', err);
        }
    };

    const handleSubmitMaterial = async (materialData) => {
        try {
            if (editingMaterial) {
                // Update existing material
                await apiService.updateMaterial(editingMaterial.id, materialData);
            } else {
                // Add new material
                await apiService.createMaterial(materialData);
            }
            
            // Reload materials to get fresh data
            await loadMaterials();
            setIsModalOpen(false);
            setEditingMaterial(null);
        } catch (err) {
            alert('Greška pri spremanju materijala');
            console.error('Error saving material:', err);
        }
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
                        {error && (
                            <div className="error-message mb-4">
                                {error}
                            </div>
                        )}
                        
                        {loading ? (
                            <div className="flex items-center justify-center p-8">
                                <p className="text-muted">Učitavanje materijala...</p>
                            </div>
                        ) : (
                        <>
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
                        </>
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