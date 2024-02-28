import React, { useEffect, useState } from "react";
import './Home.css';
import '../../App.css';
import Header from "../../components/header/Header";
import AttributeValues from "../../components/attributeValues/AttributeValues";
import AttributeHeadline from "../../components/attributeHeadline/AttributeHeadline";
import axios from "axios";
import NewItem from "../../components/newItem/NewItem";
import Container from "../../components/container/Container";
import Navbar from "../../components/navbar/Navbar";
import ColumnChart from "../../components/charts/columnChart/ColumnChart";
import MonthlyProfitChart from "../../components/charts/columnChart2/ColumnChart2";

const NewItemLocal = () => {
    const [selectData, setSelectData] = useState([]);
    // const data = useGetAll("belt");
    const data = JSON.parse(localStorage.getItem('material'));

    useEffect(()=>{
        if (data===null) {
            localStorage.setItem('material', JSON.stringify([]));
            data=[];
        }
        data.map(obj => {
            obj.stock = parseInt(obj.stock);
        })
        console.log(data);
        setSelectData(data);
    },[]);

    return (
        <>
        {selectData.length>0 && (
            <ColumnChart data={selectData}/>
        )}
        </>
    )
}

const AllItemsLocal = () => {
    const [sortedData, setSortedData] = useState([]);
    // const data = useGetAll("belt");
    const data = JSON.parse(localStorage.getItem('sale'));

    useEffect(()=>{
        if (data===null) {
            localStorage.setItem('sale', JSON.stringify([]));
            data=[];
        }
        setSortedData(data);
    },[]);

    return (
        <div style={{width: "100%"}}>
            {sortedData.length>0 && (
                <MonthlyProfitChart  sales={sortedData}/>
            )}
        </div>
    )
}


const Home = () => {
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
                <Header pageName="Početna"/>
            </div>
            <div className='RestOfScreen' style={{paddingTop: "72px"}}>
                <Container headline="Materijali na stanju" children={<NewItemLocal />}/>
                <Container headline="Prodaja po mjesecima" children={<AllItemsLocal />}/>
            </div>
        </div>
    </div>
  );

}

export default Home;