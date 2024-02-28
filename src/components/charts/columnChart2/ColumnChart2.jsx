import React from 'react';
import { Bar } from 'react-chartjs-2';

const MonthlyProfitChart = ({ sales }) => {
  // Aggregate profits by month
  const monthlyData = sales.reduce((acc, sale) => {
    const date = new Date(sale.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    acc[monthYear] = (acc[monthYear] || 0) + sale.profit;
    return acc;
  }, {});

  // Sort the month-year keys in ascending order
  const sortedLabels = Object.keys(monthlyData).sort((a, b) => {
    const dateA = new Date(`${a}/01`); // Assume day is the first day of the month
    const dateB = new Date(`${b}/01`); // Assume day is the first day of the month
    return dateA - dateB;
  });

  // Extract labels and data for the chart
  const labels = sortedLabels;
  const data = sortedLabels.map(monthYear => monthlyData[monthYear]);

  // Chart data object
  const chartData = {
    labels: labels,
    datasets: [{
      label: 'Monthly Profit',
      data: data,
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  // Chart options object
  const chartOptions = {
    maintainAspectRatio: false,
    responsive: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
          },
          color: 'white' // Set y-axis label color to white
        }
      },
      x: {
        ticks: {
          color: 'white' // Set x-axis label color to white
        }
      }
    }
  };

  return <Bar data={chartData} options={chartOptions} />;
};

export default MonthlyProfitChart;
