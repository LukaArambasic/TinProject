import './App.css';
import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/home/Home';
import Login from './pages/login/Login';
import Material from './pages/material/Material';
import Product from './pages/product/Product';
import Sales from './pages/sales/Sales';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />
    },
    {
      path: "/material",
      element: <Material />
    },
    {
      path: "/home",
      element: <Home />
    },
    {
      path: "/product",
      element: <Product />
    },
    {
      path: "/sale",
      element: <Sales />
    },
  ]);

  return (
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}

export default App;