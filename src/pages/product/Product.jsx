import React, { useEffect, useState } from "react";
import './Product.css';
import '../../App.css';
import Header from "../../components/header/Header";
import AttributeValues from "../../components/attributeValues/AttributeValues";
import AttributeHeadline from "../../components/attributeHeadline/AttributeHeadline";
import NewItem from "../../components/newItem/NewItem";
import Container from "../../components/container/Container";
import Navbar from "../../components/navbar/Navbar";

const NewItemLocal = () => {
    const [selectData, setSelectData] = useState([]);
    const [counter, setCounter] = useState(1);

    const data = JSON.parse(localStorage.getItem('material'));

    useEffect(()=>{
        if (data===null) {
            localStorage.setItem('material', JSON.stringify([]));
            data=[];
        }

        setSelectData(data);
    },[]);

    const titles = [
        {
            title: "name",
            type: "text",
            displayedTitle: "Naziv",
            advanced: false,
        },
        {
            title: "timeToMake",
            type: "text",
            displayedTitle: "Vrijeme izrade u min",
            advanced: false,
        },
        {
            title: "pricePerUnit",
            type: "text",
            displayedTitle: "Cijena u €",
            advanced: false,
        },
        {
            // IMPORTANT: AT THE END OF THE NAME IS ADDED 0, CODE THEN ADDS +1 FOR EVERY NEXT. 
            // THIS WAY THE PROGRAM UNDERSTANDS ON WHICH EXACT ELEMENT WE ARE FOCUSED ON
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
                displayedTitle: "Potrošeno materijala:",
                advanced: false,
            },
        ]}
    ]

    const onSubmit = (e) => {
        e.preventDefault();

        const title = titles.find(obj => obj.type==='multiple');
        const names = title.titleHeaders.map(obj => obj.title.slice(0,-1));

        const tmpList = [];
        for(let i=0;i<counter;i++) {
            const tmpItem = {}

            for(let j in names) {
                tmpItem[names[j]] = e.target[names[j]+i].value;
            }
            tmpList.push(tmpItem);
        }

        
        const newProduct = {
            name: e.target.name.value,
            timeToMake: e.target.timeToMake.value,
            pricePerUnit: e.target.pricePerUnit.value,
            materials: tmpList,
        }

        const oldProducts = JSON.parse(localStorage.getItem('product'));
        const newProducts = [...oldProducts, newProduct];
        localStorage.setItem('product', JSON.stringify(newProducts));

        console.log(JSON.parse(localStorage.getItem('product')));


    }

    return (
        <NewItem titles={titles} onSubmit={onSubmit} counter={counter} setCounter={setCounter}/>
    )
}

const AllItemsLocal = () => {
    const [sortedData, setSortedData] = useState([]);
    // const data = useGetAll("member");
    const data = JSON.parse(localStorage.getItem('product'));

    useEffect(()=>{
        if (data===null) {
            localStorage.setItem('product', JSON.stringify([]));
            data=[];
        }
        setSortedData(data);

    },[]);

    const headlineArray = [
        {
            displayedTitle: "Ime",
            title: "name",
        }, 
        {
            displayedTitle: "Vrijeme izrade u min",
            title: "timeToMake",
        }, 
        {
            displayedTitle: "Prodajna cijena u €",
            title: "pricePerUnit",
        }, 
    ]

    return (
        <div style={{width: "100%"}}>
            <AttributeHeadline headlineArray={headlineArray} data={sortedData} setData={setSortedData}/>
            {sortedData.length>0 && sortedData.map(item => (
                <AttributeValues name={'product'} item={item} key={item.memberId} headlineArray={headlineArray}/>
            ))}
        </div>
    )
}


const Product = () => {
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
                <Header pageName="Proizvod"/>
            </div>
            <div className='RestOfScreen' style={{paddingTop: "72px"}}>
                <Container children={<NewItemLocal />} headline="Novi proizvod" />
                <Container children={<AllItemsLocal />} headline="Svi proizvodi" />
            </div>
        </div>
    </div>
  );

}

export default Product;