import React, { useEffect, useState } from "react";
import './Sales.css';
import '../../App.css';
import Header from "../../components/header/Header";
import Container from "../../components/container/Container";
import Navbar from "../../components/navbar/Navbar";
import Modal from "../../components/modal/Modal";
import SaleCard from "../../components/saleCard/SaleCard";
import SaleForm from "../../components/saleForm/SaleForm";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSearch } from "@fortawesome/free-solid-svg-icons";

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = () => {
        const data = JSON.parse(localStorage.getItem('sale')) || [];
        setSales(data);
    };

    const handleCreateSale = () => {
        setIsModalOpen(true);
    };

    const handleDeleteSale = (saleToDelete) => {
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

        // Check and subtract materials from stock
        const requiredMaterials = selectedProduct.materials || [];
        const updatedMaterials = materials.map(material => {
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
        
        // Update materials in localStorage
        localStorage.setItem('material', JSON.stringify(updatedMaterials));
        
        // Add new sale
        const updatedSales = [...sales, saleData];
        localStorage.setItem('sale', JSON.stringify(updatedSales));
        setSales(updatedSales);
        setIsModalOpen(false);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
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
                                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
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
                                <FontAwesomeIcon icon={faPlus} />
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
                                                <FontAwesomeIcon icon={faPlus} />
                                                Dodaj prvu prodaju
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="sales-grid">
                                {sortedSales.map((sale, index) => (
                                    <SaleCard
                                        key={`${sale.product}-${sale.date}-${index}`}
                                        sale={sale}
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
                title="Nova prodaja"
            >
                <SaleForm
                    onSubmit={handleSubmitSale}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </div>
    );
}

export default Sales;