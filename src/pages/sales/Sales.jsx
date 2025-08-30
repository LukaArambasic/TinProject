import React, { useEffect, useState } from "react";
import './Sales.css';
import '../../App.css';
import Header from "../../components/header/Header";
import AttributeValues from "../../components/attributeValues/AttributeValues";
import AttributeHeadline from "../../components/attributeHeadline/AttributeHeadline";
import NewItem from "../../components/newItem/NewItem";
import Container from "../../components/container/Container";
import Navbar from "../../components/navbar/Navbar";

const NewSaleForm = () => {
    const [selectData, setSelectData] = useState([]);
    const data = JSON.parse(localStorage.getItem('product'));

    useEffect(() => {
        const productData = data || [];
        setSelectData(productData);
    }, []);

    const titles = [
        {
            title: "product",
            displayedTitle: "Proizvod",
            type: "select",
            advanced: false,
            data: selectData,
        },
        {
            title: "quantity",
            displayedTitle: "Količina",
            type: "text",
            advanced: false,
        },
        {
            title: "date",
            displayedTitle: "Datum prodaje",
            type: "date",
            advanced: false,
        },
    ]

    const onSubmit = (e) => {
        e.preventDefault();
        const quantity = parseFloat(e.target.quantity.value);
        const selectedProduct = selectData.find(obj => obj.name === e.target.product.value);
        
        if (!selectedProduct) {
            alert("Molimo odaberite valjan proizvod");
            return;
        }
        
        const itemPrice = parseFloat(selectedProduct.pricePerUnit);
        const item = {
            product: e.target.product.value,
            quantity: e.target.quantity.value,
            date: e.target.date.value,
            profit: (itemPrice * quantity).toFixed(2),
        }

        const oldData = JSON.parse(localStorage.getItem('sale')) || [];
        const newData = [...oldData, item];
        localStorage.setItem('sale', JSON.stringify(newData));
        
        e.target.reset();
        window.location.reload();
    }

    return <NewItem titles={titles} onSubmit={onSubmit} />
}

const SalesList = () => {
    const [sortedData, setSortedData] = useState([]);
    const data = JSON.parse(localStorage.getItem('sale'));

    useEffect(() => {
        const salesData = data || [];
        setSortedData(salesData);
    }, []);

    const headlineArray = [
        {
            title: "product",
            displayedTitle: "Proizvod",
        },
        {
            title: "quantity",
            displayedTitle: "Količina",
        },
        {
            title: "date",
            displayedTitle: "Datum prodaje",
        },
        {
            title: "profit",
            displayedTitle: "Profit (€)",
        },
    ]

    if (sortedData.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-muted mb-4">Nema zabilježenih prodaja</p>
                    <p className="text-sm text-muted">Dodajte novu prodaju da biste je vidjeli ovdje</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ width: "100%" }}>
            <AttributeHeadline headlineArray={headlineArray} data={sortedData} setData={setSortedData} />
            {sortedData.map((item, index) => (
                <AttributeValues 
                    name={'sale'} 
                    item={item} 
                    key={`${item.product}-${item.date}-${index}`} 
                    headlineArray={headlineArray}
                />
            ))}
        </div>
    );
}

const Sales = () => {
    const [vw, setVw] = useState(window.innerWidth);
    
    useEffect(() => {
        const handleResize = () => {
            setVw(window.innerWidth);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className='App FlexRow'>
            <div style={{ position: 'fixed', zIndex: 40 }}>
                <Navbar />
            </div>
            <div style={{ flex: 1, marginLeft: "280px" }}>
                <div style={{ position: "fixed", width: `${vw - 280}px`, zIndex: 30 }}>
                    <Header pageName="Prodaja" />
                </div>
                <div className='RestOfScreen' style={{ paddingTop: "72px" }}>
                    <div className="grid grid-cols-1 gap-6">
                        <Container headline="💳 Nova prodaja">
                            <NewSaleForm />
                        </Container>
                        <Container headline="📊 Sve prodaje">
                            <SalesList />
                        </Container>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sales;