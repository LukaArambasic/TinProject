import React, { useEffect, useState } from "react";
import './Home.css';
import '../../App.css';
import apiService from '../services/api';
import Header from "../../components/header/Header";
import Container from "../../components/container/Container";
import Navbar from "../../components/navbar/Navbar";
import ColumnChart from "../../components/charts/columnChart/ColumnChart";
import MonthlyProfitChart from "../../components/charts/columnChart2/ColumnChart2";

const MaterialStockChart = () => {
    const [selectData, setSelectData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadMaterials = async () => {
            try {
                const data = await apiService.getMaterials();
                const processedData = data.map(obj => ({
                    ...obj,
                    stock: parseInt(obj.stock) || 0
                }));
                setSelectData(processedData);
            } catch (err) {
                console.error('Error loading materials for chart:', err);
                setSelectData([]);
            } finally {
                setLoading(false);
            }
        };
        
        loadMaterials();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-muted">Učitavanje podataka...</p>
            </div>
        );
    }

    if (selectData.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-muted mb-4">Nema podataka o materijalima</p>
                    <p className="text-sm text-muted">Dodajte materijale da biste vidjeli grafikon</p>
                </div>
            </div>
        );
    }

    return <ColumnChart data={selectData} />;
}

const SalesChart = () => {
    const [sortedData, setSortedData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSales = async () => {
            try {
                const data = await apiService.getSales();
                setSortedData(data);
            } catch (err) {
                console.error('Error loading sales for chart:', err);
                setSortedData([]);
            } finally {
                setLoading(false);
            }
        };
        
        loadSales();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-8">
                <p className="text-muted">Učitavanje podataka...</p>
            </div>
        );
    }

    if (sortedData.length === 0) {
        return (
            <div className="flex items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-muted mb-4">Nema podataka o prodaji</p>
                    <p className="text-sm text-muted">Dodajte prodaje da biste vidjeli grafikon</p>
                </div>
            </div>
        );
    }

    return <MonthlyProfitChart sales={sortedData} />;
}

const Home = () => {
    return (
        <div className='App FlexRow'>
            <Navbar />
            <div className="main-content">
                <Header pageName="Početna" />
                <div className='RestOfScreen'>
                    <div className="grid grid-cols-1 gap-6">
                        <Container headline="📊 Materijali na stanju">
                            <MaterialStockChart />
                        </Container>
                        <Container headline="💰 Prodaja po mjesecima">
                            <SalesChart />
                        </Container>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;