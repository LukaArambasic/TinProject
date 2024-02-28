import React, { useEffect, useState } from "react";
import './Sales.css';
import '../../App.css';
import Header from "../../components/header/Header";
import AttributeValues from "../../components/attributeValues/AttributeValues";
import AttributeHeadline from "../../components/attributeHeadline/AttributeHeadline";
import axios from "axios";
import NewItem from "../../components/newItem/NewItem";
import Container from "../../components/container/Container";
import Navbar from "../../components/navbar/Navbar";

const NewItemLocal = () => {
    const [selectData, setSelectData] = useState([]);
    // const data = useGetAll("belt");
    const data = JSON.parse(localStorage.getItem('product'));

    useEffect(()=>{
        if (data===null) {
            localStorage.setItem('product', JSON.stringify([]));
            data=[];
        }
        setSelectData(data);
    },[]);

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
        const itemPrice = parseFloat(selectData.find(obj => obj.name===e.target.product.value).pricePerUnit);
        const item = {
            product: e.target.product.value,
            quantity: e.target.quantity.value,
            date: e.target.date.value,
            profit: itemPrice*quantity,
        }

        const oldData = JSON.parse(localStorage.getItem('sale'));

        if (oldData===null) {
            localStorage.setItem('sale', JSON.stringify([]));
            oldData=[];
        }
        const newData = [...oldData, item];
        localStorage.setItem('sale', JSON.stringify(newData));
        console.log(localStorage);

    }
    return (
        <NewItem titles={titles} onSubmit={onSubmit}/>
    )
}

const AllItemsLocal = () => {
    const [sortedData, setSortedData] = useState([]);
    // const data = useGetAll("member");
    const data = JSON.parse(localStorage.getItem('sale'));

    useEffect(()=>{
        if (data===null) {
            localStorage.setItem('sale', JSON.stringify([]));
            data=[];
        }
        setSortedData(data);
    },[]);

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
            displayedTitle: "Profit u €",
        },
    ]

    return (
        <div style={{width: "100%"}}>
            <AttributeHeadline headlineArray={headlineArray} data={sortedData} setData={setSortedData}/>
            {sortedData.map(item => (
                <AttributeValues name={'sale'} item={item} key={item.memberId} headlineArray={headlineArray}/>
            ))}
        </div>
    )
}


const Sales = () => {
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
                <Header pageName="Prodaja"/>
            </div>
            <div className='RestOfScreen' style={{paddingTop: "72px"}}>
                <Container children={<NewItemLocal />} headline="Nova prodaja" />
                <Container children={<AllItemsLocal />} headline="Sve prodaje" />
            </div>
        </div>
    </div>
  );

}

export default Sales;