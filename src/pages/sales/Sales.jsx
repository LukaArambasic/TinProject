import React, { useEffect, useState } from "react";
import './Sales.css';
import '../../App.css';
import Header from "../../components/header/Header";
import Container from "../../components/container/Container";
import Navbar from "../../components/navbar/Navbar";
import Modal from "../../components/modal/Modal";
import SaleCard from "../../components/saleCard/SaleCard";
import SaleForm from "../../components/saleForm/SaleForm";

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSale, setEditingSale] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = () => {
        const data = JSON.parse(localStorage.getItem('sale')) || [];
        setSales(data);
    };

    const handleCreateSale = () => {
        setEditingSale(null);
        setIsModalOpen(true);
    };

    const handleEditSale = (sale) => {
        setEditingSale(sale);
        setIsModalOpen(true);
    };

    const handleDeleteSale = (saleToDelete) => {
        // First, restore materials to stock when deleting a sale
        const materials = JSON.parse(localStorage.getItem('material')) || [];
        const products = JSON.parse(localStorage.getItem('product')) || [];
        
        const soldProduct = products.find(p => p.name === saleToDelete.product);
        if (soldProduct && soldProduct.materials) {
            const updatedMaterials = materials.map(material => {
                const requiredMaterial = soldProduct.materials.find(rm => rm.material === material.name);
                if (requiredMaterial) {
                    const usedAmount = parseFloat(requiredMaterial.unit) * parseInt(saleToDelete.quantity);
                    return {
                        ...material,
                        stock: parseInt(material.stock) + usedAmount
                    };
                }
                return material;
            });
            localStorage.setItem('material', JSON.stringify(updatedMaterials));
        }
        
        const updatedSales = sales.filter(sale => 
            JSON.stringify(sale) !== JSON.stringify(saleToDelete)
        );
        localStorage.setItem('sale', JSON.stringify(updatedSales));
        setSales(updatedSales);
    };

    const handleSubmitSale = (saleData) => {
        // Get current materials and products
        const materials = JSON.parse(localStorage.getItem('material')) || [];
        const products = JSON.parse(localStorage.getItem('product')) || [];
        
        const selectedProduct = products.find(p => p.name === saleData.product);
        if (!selectedProduct) {
            alert("Proizvod nije pronađen");
            return;
        }

        let updatedSales;
        let updatedMaterials = [...materials];
        
        if (editingSale) {
            // When editing, first restore materials from the old sale
            const oldProduct = products.find(p => p.name === editingSale.product);
            if (oldProduct && oldProduct.materials) {
                updatedMaterials = updatedMaterials.map(material => {
                    const requiredMaterial = oldProduct.materials.find(rm => rm.material === material.name);
                    if (requiredMaterial) {
                        const usedAmount = parseFloat(requiredMaterial.unit) * parseInt(editingSale.quantity);
                        return {
                            ...material,
                            stock: parseInt(material.stock) + usedAmount
                        };
                    }
                    return material;
                });
            }
            
            // Update existing sale
            updatedSales = sales.map(sale => 
                JSON.stringify(sale) === JSON.stringify(editingSale) 
                    ? saleData 
                    : sale
            );
        } else {
            // Add new sale
            updatedSales = [...sales, saleData];
        }
        
        // Subtract materials for the new/updated sale
        const requiredMaterials = selectedProduct.materials || [];
        updatedMaterials = updatedMaterials.map(material => {
            const requiredMaterial = requiredMaterials.find(rm => rm.material === material.name);
            if (requiredMaterial) {
                const usedAmount = parseFloat(requiredMaterial.unit) * parseInt(saleData.quantity);
                return {
                    ...material,
                    stock: parseInt(material.stock) - usedAmount
                };
            }
            return material;
        });
        
        // Update both materials and sales in localStorage
        localStorage.setItem('material', JSON.stringify(updatedMaterials));
        localStorage.setItem('sale', JSON.stringify(updatedSales));
        setSales(updatedSales);
        setIsModalOpen(false);
        setEditingSale(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSale(null);
    };

    const filteredSales = sales.filter(sale =>
        sale.product.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort sales by date (newest first)
    const sortedSales = [...filteredSales].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className='App FlexRow'>
            <Navbar />
            <div className="main-content">
                <Header pageName="Prodaja" />
                <div className='RestOfScreen'>
                    <Container headline="💳 Upravljanje prodajama">
                        <div className="sales-header">
                            <div className="search-container">
                                <div className="search-input-wrapper">
                                    <span className="search-icon">🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Pretraži prodaje..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                            </div>
                            <button 
                                className="btn btn-primary"
                                onClick={handleCreateSale}
                            >
                                ➕
                                Nova prodaja
                            </button>
                        </div>

                        {sortedSales.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-content">
                                    {searchTerm ? (
                                        <>
                                            <p className="text-muted mb-4">
                                                Nema prodaja koji odgovaraju pretraživanju "{searchTerm}"
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
                                            <p className="text-muted mb-4">Nema zabilježenih prodaja</p>
                                            <button 
                                                className="btn btn-primary"
                                                onClick={handleCreateSale}
                                            >
                                                ➕
                                                Dodaj prvu prodaju
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="sales-list">
                                <div className="sales-header-row">
                                    <div className="header-cell">Proizvod</div>
                                    <div className="header-cell">Količina</div>
                                    <div className="header-cell">Datum</div>
                                    <div className="header-cell">Profit</div>
                                    <div className="header-cell">Akcije</div>
                                </div>
                                {sortedSales.map((sale, index) => (
                                    <SaleCard
                                        key={`${sale.product}-${sale.date}-${index}`}
                                        sale={sale}
                                        onEdit={handleEditSale}
                                        onDelete={handleDeleteSale}
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
                title={editingSale ? 'Uredi prodaju' : 'Nova prodaja'}
            >
                <SaleForm
                    sale={editingSale}
                    onSubmit={handleSubmitSale}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
}

export default Sales;