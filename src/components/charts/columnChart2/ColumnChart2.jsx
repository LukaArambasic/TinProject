import React from 'react';
import { Bar } from 'react-chartjs-2';

const MonthlyProfitChart = ({ sales }) => {
  // Debug: Log the sales data
  console.log('Sales data received:', sales);
  
  // Aggregate profits by month
  const monthlyData = sales.reduce((acc, sale) => {
    const date = new Date(sale.date);
    // Ensure the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date found:', sale.date);
      return acc;
    }
    
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    const profit = parseFloat(sale.profit) || 0;
    acc[monthYear] = (acc[monthYear] || 0) + profit;
    console.log(`Adding ${profit} to ${monthYear}, total now: ${acc[monthYear]}`);
    return acc;
  }, {});

  console.log('Monthly data aggregated:', monthlyData);
  
  // Sort the month-year keys in ascending order
  const sortedLabels = Object.keys(monthlyData).sort((a, b) => {
    const [monthA, yearA] = a.split('/');
    const [monthB, yearB] = b.split('/');
    const dateA = new Date(parseInt(yearA), parseInt(monthA) - 1, 1);
    const dateB = new Date(parseInt(yearB), parseInt(monthB) - 1, 1);
    return dateA - dateB;
  });

  // Extract labels and data for the chart
  const labels = sortedLabels;
  const chartValues = sortedLabels.map(monthYear => monthlyData[monthYear]);
  
  console.log('Chart labels:', labels);
  console.log('Chart values:', chartValues);
  
  // If no data, show empty state
  if (labels.length === 0 || chartValues.every(val => val === 0)) {
    return (
      <div style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#94a3b8' }}>
          <p>Nema podataka o prodaji za prikaz</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>Dodajte prodaje da biste vidjeli grafikon</p>
        </div>
      </div>
    );
  }

  // Chart data object
  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Mjesečni profit',
      data: chartValues,
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderColor: 'rgba(16, 185, 129, 1)',
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  // Chart options object
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
        },
        callbacks: {
          label: function(context) {
            return `Profit: ${context.parsed.y.toLocaleString('hr-HR', { 
              style: 'currency', 
              currency: 'EUR' 
            })}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString('hr-HR', { 
              style: 'currency', 
              currency: 'EUR' 
            });
          },
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

export default MonthlyProfitChart;