import React, { useEffect, useState } from "react";
import './Product.css';
import '../../App.css';
import apiService from '../../services/api';
import Layout from "../../components/layout/Layout";
import Container from "../../components/container/Container";
import Modal from "../../components/modal/Modal";
import ProductCard from "../../components/productCard/ProductCard";
import ProductForm from "../../components/productForm/ProductForm";

const Product = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await apiService.getProducts();
            setProducts(data);
        } catch (err) {
            setError('Greška pri dohvaćanju proizvoda');
            console.error('Error loading products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = async (productToDelete) => {
        try {
            await apiService.deleteProduct(productToDelete.id);
            // Reload products to get fresh data
            await loadProducts();
        } catch (err) {
            alert('Greška pri brisanju proizvoda');
            console.error('Error deleting product:', err);
        }
    };

    const handleSubmitProduct = async (productData) => {
        try {
            if (editingProduct) {
                // Update existing product
                await apiService.updateProduct(editingProduct.id, productData);
            } else {
                // Add new product
                await apiService.createProduct(productData);
            }
            
            // Reload products to get fresh data
            await loadProducts();
            setIsModalOpen(false);
            setEditingProduct(null);
        } catch (err) {
            alert('Greška pri spremanju proizvoda');
            console.error('Error saving product:', err);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <Layout pageName="Proizvodi">
            <Container headline="🔧 Upravljanje proizvodima">
                        {error && (
                            <div className="error-message mb-4">
                                {error}
                            </div>
                        )}
                        
                        {loading ? (
                            <div className="flex items-center justify-center p-8">
                                <p className="text-muted">Učitavanje proizvoda...</p>
                            </div>
                        ) : (
                        <>
                        <div className="products-header">
                            <div className="search-container">
                                <div className="search-input-wrapper">
                                    <span className="search-icon">🔍</span>
                                    <input
                                        type="text"
                                        placeholder="Pretraži proizvode..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="search-input"
                                    />
                                </div>
                            </div>
                            <button 
                                className="btn btn-primary"
                                onClick={handleCreateProduct}
                            >
                                ➕
                                Novi proizvod
                            </button>
                        </div>

                        {filteredProducts.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-content">
                                    {searchTerm ? (
                                        <>
                                            <p className="text-muted mb-4">
                                                Nema proizvoda koji odgovaraju pretraživanju "{searchTerm}"
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
                                            <p className="text-muted mb-4">Nema dodanih proizvoda</p>
                                            <button 
                                                className="btn btn-primary"
                                                onClick={handleCreateProduct}
                                            >
                                                ➕
                                                Dodaj prvi proizvod
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="products-grid">
                                {filteredProducts.map((product, index) => (
                                    <ProductCard
                                        key={`${product.name}-${index}`}
                                        product={product}
                                        onEdit={handleEditProduct}
                                        onDelete={handleDeleteProduct}
                                    />
                                ))}
                            </div>
                        )}
                        </>
                        )}
            </Container>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingProduct ? 'Uredi proizvod' : 'Novi proizvod'}
            >
                <ProductForm
                    product={editingProduct}
                    onSubmit={handleSubmitProduct}
                    onCancel={handleCloseModal}
                />
            </Modal>
        </Layout>
    );
}

export default Product;