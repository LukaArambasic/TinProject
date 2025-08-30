import React, { useEffect, useState } from "react";
import './Material.css';
import '../../App.css';
import Header from "../../components/header/Header";
import AttributeValues from "../../components/attributeValues/AttributeValues";
import AttributeHeadline from "../../components/attributeHeadline/AttributeHeadline";
import NewItem from "../../components/newItem/NewItem";
import Container from "../../components/container/Container";
import Navbar from "../../components/navbar/Navbar";

const NewMaterialForm = () => {
    const titles = [
        {
            title: "name",
            type: "text",
            displayedTitle: "Naziv materijala",
            advanced: false,
        },
        {
            title: "costPerUnit",
            type: "text",
            displayedTitle: "Cijena po mjernoj jedinici (€)",
            advanced: false,
        },
        {
            title: "stock",
            type: "text",
            displayedTitle: "Početna količina na stanju",
            advanced: false,
        },
    ]

    const onSubmit = (e) => {
        e.preventDefault();

        const item = {
            name: e.target.name.value,
            stock: e.target.stock.value,
            costPerUnit: parseFloat(e.target.costPerUnit.value).toFixed(2),
        }

        const oldData = JSON.parse(localStorage.getItem('material')) || [];
        const newData = [...oldData, item];
        localStorage.setItem('material', JSON.stringify(newData));
        
        // Reset form
        e.target.reset();
        window.location.reload();
    }

    return <NewItem titles={titles} onSubmit={onSubmit} />
}

const PurchaseMaterialForm = () => {
    const [selectData, setSelectData] = useState([]);
    const data = localStorage.getItem("material");

    useEffect(() => {
        const refinedData = JSON.parse(data) || [];
        setSelectData(refinedData);
    }, []);

    const titles = [
        {
            title: "material",
            type: "select",
            displayedTitle: "Odaberite materijal",
            advanced: false,
            data: selectData,
        },
        {
            title: "quantity",
            type: "text",
            displayedTitle: "Kupljena količina",
            advanced: false,
        },
    ]

    const onSubmit = (e) => {
        e.preventDefault();

        const updatedData = selectData.map(item => {
            if (item.name === e.target.material.value) {
                return {
                    ...item,
                    stock: parseInt(item.stock) + parseInt(e.target.quantity.value)
                };
            }
            return item;
        });

        localStorage.setItem('material', JSON.stringify(updatedData));
        e.target.reset();
        window.location.reload();
    }

    return <NewItem titles={titles} onSubmit={onSubmit} />
}

const MaterialList = () => {
    const [sortedData, setSortedData] = useState([]);
    const data = localStorage.getItem('material');

    useEffect(() => {
        const refinedData = JSON.parse(data) || [];
        setSortedData(refinedData);
    }, []);

    const headlineArray = [
        {
            title: "name",
            displayedTitle: "Naziv",
        },
        {
            title: "stock",
            displayedTitle: "Količina na stanju",
        },
        {
            title: "costPerUnit",
            displayedTitle: "Cijena / mj. jed. (€)",
        },
    ]

    if (sortedData.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-muted mb-4">Nema dodanih materijala</p>
                    <p className="text-sm text-muted">Dodajte novi materijal da biste ga vidjeli ovdje</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ width: "100%" }}>
            <AttributeHeadline headlineArray={headlineArray} data={sortedData} setData={setSortedData} />
            {sortedData.map((item, index) => (
                <AttributeValues 
                    name={'material'} 
                    item={item} 
                    key={`${item.name}-${index}`} 
                    headlineArray={headlineArray}
                />
            ))}
        </div>
    );
}

const Material = () => {
    return (
        <div className='App FlexRow'>
            <Navbar />
            <div className="main-content">
                <Header pageName="Materijal" />
                <div className='RestOfScreen'>
                    <div className="grid grid-cols-1 gap-6">
                        <Container headline="➕ Novi materijal">
                            <NewMaterialForm />
                        </Container>
                        <Container headline="📦 Nabavka materijala">
                            <PurchaseMaterialForm />
                        </Container>
                        <Container headline="📋 Svi materijali">
                            <MaterialList />
                        </Container>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Material;