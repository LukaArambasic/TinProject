import { BarElement, CategoryScale, Chart, LinearScale, Title, Tooltip, Legend } from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';

const ColumnChart = ({ data }) => {
    Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
    
    const chartData = {
        labels: data.map(item => item.name),
        datasets: [{
            label: 'Količina na stanju',
            data: data.map(item => item.stock),
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
        }]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: '#f8fafc',
                    font: {
                        family: 'Inter',
                        size: 14,
                        weight: '500'
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                titleColor: '#f8fafc',
                bodyColor: '#cbd5e1',
                borderColor: '#374151',
                borderWidth: 1,
                cornerRadius: 8,
                titleFont: {
                    family: 'Inter',
                    size: 14,
                    weight: '600'
                },
                bodyFont: {
                    family: 'Inter',
                    size: 13
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#cbd5e1',
                    font: {
                        family: 'Inter',
                        size: 12
                    }
                },
                grid: {
                    color: 'rgba(55, 65, 81, 0.3)',
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: '#cbd5e1',
                    font: {
                        family: 'Inter',
                        size: 12
                    }
                },
                grid: {
                    color: 'rgba(55, 65, 81, 0.3)',
                    drawBorder: false
                },
                beginAtZero: true
            }
        },
        elements: {
            bar: {
                borderRadius: 4
            }
        }
    };

    return (
        <div style={{ height: '400px', width: '100%' }}>
            <Bar data={chartData} options={chartOptions} />
        </div>
    );
};

export default ColumnChart;