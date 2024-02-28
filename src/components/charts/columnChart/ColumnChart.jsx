import { BarElement, CategoryScale, Chart, LinearScale } from 'chart.js';
import React from 'react';
import { Bar } from 'react-chartjs-2';

const ColumnChart = ({ data }) => {
    Chart.register(CategoryScale);
    Chart.register(LinearScale);
    Chart.register(BarElement);
  const chartData = {
    labels: data.map(item => item.name),
    datasets: [{
      label: 'Remaining Stock',
      data: data.map(item => item.stock),
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1
    }]
  };

  const chartOptions = {
    maintainAspectRatio: false, // Prevent the chart from maintaining aspect ratio
    responsive: false, // Disable responsiveness
    plugins: {
      legend: {
        labels: {
          color: 'white' // Set legend label color to white
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: 'white' // Set x-axis label color to white
        }
      },
      y: {
        ticks: {
          color: 'white' // Set y-axis label color to white
        }
      }
    }
  };


  return <Bar data={chartData} options={chartOptions} height={400} />;
};

export default ColumnChart;
