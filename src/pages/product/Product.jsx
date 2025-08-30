import React, { useEffect, useState } from "react";
import './Product.css';
import '../../App.css';
import Header from "../../components/header/Header";
import AttributeValues from "../../components/attributeValues/AttributeValues";
import AttributeHeadline from "../../components/attributeHeadline/AttributeHeadline";
import NewItem from "../../components/newItem/NewItem";
import Container from "../../components/container/Container";
import Navbar from "../../components/navbar/Navbar";

const NewProductForm = () => {
    const [selectData, setSelectData] = useState([]);
    const [counter, setCounter] = useState(1);

    const data = JSON.parse(localStorage.getItem('material'));

    useEffect(() => {
        const materialData = data || [];
        setSelectData(materialData);
    }, []);

    const titles = [
        {
            title: "name",
            type: "text",
            displayedTitle: "Naziv proizvoda",
            advanced: false,
        },
        {
            title: "timeToMake",
            type: "text",
            displayedTitle: "Vrijeme izrade (min)",
            advanced: false,
        },
        {
            title: "pricePerUnit",
            type: "text",
            displayedTitle: "Prodajna cijena (€)",
            advanced: false,
        },
        {
            type: "multiple",
            titleHeaders: [
                {
                    title: "material0", 
                    type: "select",
                    displayedTitle: "Materijal",
                    advanced: false,
                    data: selectData,
                },
                {
                    title: "unit0",
                    type: "text",
                    displayedTitle: "Potrošeno materijala",
                    advanced: false,
                },
            ]
        }
    ]

    const onSubmit = (e) => {
        e.preventDefault();

        const title = titles.find(obj => obj.type === 'multiple');
        const names = title.titleHeaders.map(obj => obj.title.slice(0, -1));

        const tmpList = [];
        for (let i = 0; i < counter; i++) {
            const tmpItem = {}
            for (let j in names) {
                tmpItem[names[j]] = e.target[names[j] + i].value;
            }
            tmpList.push(tmpItem);
        }

        const newProduct = {
            name: e.target.name.value,
            timeToMake: e.target.timeToMake.value,
            pricePerUnit: parseFloat(e.target.pricePerUnit.value).toFixed(2),
            materials: tmpList,
        }

        const oldProducts = JSON.parse(localStorage.getItem('product')) || [];
        const newProducts = [...oldProducts, newProduct];
        localStorage.setItem('product', JSON.stringify(newProducts));
        
        e.target.reset();
        setCounter(1);
        window.location.reload();
    }

    return (
        <NewItem 
            titles={titles} 
            onSubmit={onSubmit} 
            counter={counter} 
            setCounter={setCounter}
        />
    );
}

const ProductList = () => {
    const [sortedData, setSortedData] = useState([]);
    const data = JSON.parse(localStorage.getItem('product'));

    useEffect(() => {
        const productData = data || [];
        setSortedData(productData);
    }, []);

    const headlineArray = [
        {
            displayedTitle: "Naziv",
            title: "name",
        }, 
        {
            displayedTitle: "Vrijeme izrade (min)",
            title: "timeToMake",
        }, 
        {
            displayedTitle: "Prodajna cijena (€)",
            title: "pricePerUnit",
        }, 
    ]

    if (sortedData.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-muted mb-4">Nema dodanih proizvoda</p>
                    <p className="text-sm text-muted">Dodajte novi proizvod da biste ga vidjeli ovdje</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ width: "100%" }}>
            <AttributeHeadline headlineArray={headlineArray} data={sortedData} setData={setSortedData} />
            {sortedData.map((item, index) => (
                <AttributeValues 
                    name={'product'} 
                    item={item} 
                    key={`${item.name}-${index}`} 
                    headlineArray={headlineArray}
                />
            ))}
        </div>
    );
}

const Product = () => {
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
                    <Header pageName="Proizvod" />
                </div>
                <div className='RestOfScreen' style={{ paddingTop: "72px" }}>
                    <div className="grid grid-cols-1 gap-6">
                        <Container headline="🔧 Novi proizvod">
                            <NewProductForm />
                        </Container>
                        <Container headline="📦 Svi proizvodi">
                            <ProductList />
                        </Container>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Product;