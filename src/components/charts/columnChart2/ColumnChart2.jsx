import React from 'react';
import { Bar } from 'react-chartjs-2';
import apiService from '../../../services/api';

const MonthlyProfitChart = ({ sales }) => {
  const [materials, setMaterials] = React.useState([]);
  const [products, setProducts] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadData = async () => {
      try {
        const [materialsData, productsData] = await Promise.all([
          apiService.getMaterials(),
          apiService.getProducts()
        ]);
        setMaterials(materialsData);
        setProducts(productsData);
      } catch (err) {
        console.error('Error loading data for chart:', err);
        setMaterials([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ height: '400px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#94a3b8' }}>Učitavanje podataka...</p>
      </div>
    );
  }

  // Calculate actual profit for each sale
  const calculateActualProfit = (sale) => {
    const product = products.find(p => p.id === sale.product_id);
    if (!product || !product.materials) {
      return parseFloat(sale.profit); // Return original profit if no materials data
    }

    // Calculate material costs for this sale
    let materialCosts = 0;
    product.materials.forEach(materialUsed => {
      const material = materials.find(m => m.name === materialUsed.material);
      if (material) {
        const costPerUnit = parseFloat(material.price_per_unit);
        const unitsUsed = parseFloat(materialUsed.unit);
        materialCosts += costPerUnit * unitsUsed;
      }
    });

    // Actual profit = sales revenue - material costs
    const salesRevenue = parseFloat(sale.profit);
    return salesRevenue - materialCosts;
  };

  // Aggregate profits by month
  const monthlyData = sales.reduce((acc, sale) => {
    const date = new Date(sale.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    acc[monthYear] = (acc[monthYear] || 0) + calculateActualProfit(sale);
    return acc;
  }, {});

  // Sort the month-year keys in ascending order
  const sortedLabels = Object.keys(monthlyData).sort((a, b) => {
    const dateA = new Date(`${a}/01`);
    const dateB = new Date(`${b}/01`);
    return dateA - dateB;
  });

  // Extract labels and data for the chart
  const labels = sortedLabels;
  const chartValues = sortedLabels.map(monthYear => monthlyData[monthYear]);

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