import React, { useEffect, useState } from "react";
import './Sales.css';
import '../../App.css';
import apiService from '../../services/api';
import Header from "../../components/header/Header";
import Container from "../../components/container/Container";
import Navbar from "../../components/navbar/Navbar";
import Modal from "../../components/modal/Modal";
import SaleCard from "../../components/saleCard/SaleCard";
import SaleForm from "../../components/saleForm/SaleForm";

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSale, setEditingSale] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadSales();
    }, []);

    const loadSales = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getSales();
            setSales(data);
        } catch (err) {
            setError('Greška pri dohvaćanju prodaja');
            console.error('Error loading sales:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateSale = () => {
        setEditingSale(null);
        setIsModalOpen(true);
    };

    const handleEditSale = (sale) => {
        setEditingSale(sale);
        setIsModalOpen(true);
    };

    const handleDeleteSale = async (saleToDelete) => {
        try {
            await apiService.deleteSale(saleToDelete.id);
            // Reload sales to get fresh data
            await loadSales();
        } catch (err) {
            alert('Greška pri brisanju prodaje');
            console.error('Error deleting sale:', err);
        }
    };

    const handleSubmitSale = async (saleData) => {
        try {
            if (editingSale) {
                // Update existing sale
                await apiService.updateSale(editingSale.id, saleData);
            } else {
                // Add new sale
                await apiService.createSale(saleData);
            }
            
            // Reload sales to get fresh data
            await loadSales();
            setIsModalOpen(false);
            setEditingSale(null);
        } catch (err) {
            alert('Greška pri spremanju prodaje');
            console.error('Error saving sale:', err);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingSale(null);
    };

    const filteredSales = sales.filter(sale =>
        (sale.product && sale.product.toString().includes(searchTerm.toLowerCase())) ||
        (sale.date && sale.date.includes(searchTerm))
    );

    // Sort sales by date (newest first), fallback to ID if no date
    const sortedSales = [...filteredSales].sort((a, b) => {
        if (a.date && b.date) {
            return new Date(b.date) - new Date(a.date);
        }
        return b.id - a.id;
    });

    return (
        <div className='App FlexRow'>
            <Navbar />
            <div className="main-content">
                <Header pageName="Prodaja" />
                <div className='RestOfScreen'>
                    <Container headline="💳 Upravljanje prodajama">
                        {error && (
                            <div className="error-message mb-4">
                                {error}
                            </div>
                        )}
                        
                        {loading ? (
                            <div className="flex items-center justify-center p-8">
                                <p className="text-muted">Učitavanje prodaja...</p>
                            </div>
                        ) : (
                        <>
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
                                    <div className="header-cell">Popust</div>
                                    <div className="header-cell">Datum</div>
                                    <div className="header-cell">Profit</div>
                                    <div className="header-cell">Akcije</div>
                                </div>
                                {sortedSales.map((sale, index) => (
                                    <SaleCard
                                        key={`${sale.product}-${sale.id}-${index}`}
                                        sale={sale}
                                        onEdit={handleEditSale}
                                        onDelete={handleDeleteSale}
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