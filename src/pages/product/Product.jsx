import React, { useEffect, useState } from "react";
import './Product.css';
import '../../App.css';
import Header from "../../components/header/Header";
import Container from "../../components/container/Container";
import Navbar from "../../components/navbar/Navbar";
import Modal from "../../components/modal/Modal";
import ProductCard from "../../components/productCard/ProductCard";
import ProductForm from "../../components/productForm/ProductForm";

const Product = () => {
    const [vw, setVw] = useState(window.innerWidth);
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        const data = JSON.parse(localStorage.getItem('product')) || [];
        setProducts(data);
    };

    const handleCreateProduct = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleDeleteProduct = (productToDelete) => {
        const updatedProducts = products.filter(product => 
            JSON.stringify(product) !== JSON.stringify(productToDelete)
        );
        localStorage.setItem('product', JSON.stringify(updatedProducts));
        setProducts(updatedProducts);
    };

    const handleSubmitProduct = (productData) => {
        let updatedProducts;
        
        if (editingProduct) {
            // Update existing product
            updatedProducts = products.map(product => 
                JSON.stringify(product) === JSON.stringify(editingProduct) 
                    ? productData 
                    : product
            );
        } else {
            // Add new product
            updatedProducts = [...products, productData];
        }
        
        localStorage.setItem('product', JSON.stringify(updatedProducts));
        setProducts(updatedProducts);
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingProduct(null);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className='App FlexRow'>
            <Navbar />
            <div className="main-content">
                <Header pageName="Proizvodi" />
                <div className='RestOfScreen'>
                    <Container headline="🔧 Upravljanje proizvodima">
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
                    </Container>
                </div>
            </div>

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
        </div>
    );
}

export default Product;