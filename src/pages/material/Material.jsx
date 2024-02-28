import React, { useEffect, useState } from "react";
import './Material.css';
import '../../App.css';
import Header from "../../components/header/Header";
import AttributeValues from "../../components/attributeValues/AttributeValues";
import AttributeHeadline from "../../components/attributeHeadline/AttributeHeadline";
import axios from "axios";
import NewItem from "../../components/newItem/NewItem";
import Container from "../../components/container/Container";
import Navbar from "../../components/navbar/Navbar";

const NewItemLocal = () => {
    const titles = [
        {
            title: "name",
            type: "text",
            displayedTitle: "Naziv",
            advanced: false,
        },
        {
            title: "costPerUnit",
            type: "text",
            displayedTitle: "Cijena po mjernoj jedinici:",
            advanced: false,
        },
        {
            title: "stock",
            type: "text",
            displayedTitle: "Količina na stanju",
            advanced: false,
        },
    ]

    const onSubmit = (e) => {
        e.preventDefault();

        const item = {
            name: e.target.name.value,
            stock: e.target.stock.value,
            costPerUnit: e.target.costPerUnit.value,
        }

        const oldData = JSON.parse(localStorage.getItem('material'));

        if (oldData===null) {
            localStorage.setItem('material', JSON.stringify([item]));
        }
        const newData = [...oldData, item];
        localStorage.setItem('material', JSON.stringify(newData));
        console.log(localStorage);

    }

    return (
        <NewItem titles={titles} onSubmit={onSubmit}/>
    )
}
const NewItemLocal2 = () => {
    const [selectData, setSelectData] = useState([]);
    // const data = useGetAll("belt");
    const data = localStorage.getItem("material");

    useEffect(()=>{
        const refinedData = JSON.parse(data);
        setSelectData(refinedData);
    },[]);

    const titles = [
        {
            title: "material",
            type: "select",
            displayedTitle: "Materijal",
            advanced: false,
            data: selectData,
        },
        {
            title: "quantity",
            type: "text",
            displayedTitle: "Kupljena količina materijala",
            advanced: false,
        },
    ]

    const onSubmit = (e) => {
        e.preventDefault();

        selectData.forEach(item => {
            if (item.name===e.target.material.value) {

                item.stock = parseInt(item.stock) + parseInt(e.target.quantity.value);
            }
        });
        console.log(selectData);

        localStorage.setItem('material', JSON.stringify(selectData));

        

        

    }

    return (
        <NewItem titles={titles} onSubmit={onSubmit}/>
    )
}

const AllItemsLocal = () => {
    const [sortedData, setSortedData] = useState([]);
    // const data = useGetAll("member");
    const data = localStorage.getItem('material');

    useEffect(()=>{
        if (data===null) {
            localStorage.setItem('material',JSON.stringify([]));
            data = [];
        }
        const refinedData = JSON.parse(data);
        setSortedData(refinedData);
    },[]);

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
            displayedTitle: "Cijena / mj. jed.",
        },
    ]

    return (
        <div style={{width: "100%"}}>
            <AttributeHeadline headlineArray={headlineArray} data={sortedData} setData={setSortedData}/>
            {sortedData.map(item => (
                <AttributeValues name={'material'} item={item} key={item.name} headlineArray={headlineArray}/>
            ))}
        </div>
    )
}


const Material = () => {
    const [vw, setVw] = useState(window.innerWidth);
    const handleResize = () => {
        const viewportWidth = window.innerWidth;
        setVw(viewportWidth);
    };
    
    // Attach the event listener
    window.addEventListener('resize', handleResize);

  return (
    <div className='App FlexRow'>
        <div style={{ position: 'fixed'}}>
            <Navbar />
        </div>
        <div style={{flex: 1, marginLeft: "240px"}}>
            <div style={{position: "fixed", width: `${vw-240}px`}}>
                <Header pageName="Materijal"/>
            </div>
            <div className='RestOfScreen' style={{paddingTop: "72px"}}>
                <Container children={<NewItemLocal />} headline="Novi materijal" />
                <Container children={<NewItemLocal2 />} headline="Nabavka materijala" />
                <Container children={<AllItemsLocal />} headline="Svi materijali" />
            </div>
        </div>
    </div>
  );

}

export default Material;