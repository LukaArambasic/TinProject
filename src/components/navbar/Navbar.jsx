
import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const options = [
        {name: "Početna", icon: "🏠", to: "/home"}, 
        {name: "Materijal", icon: "🔧", to: "/material"}, 
        {name: "Proizvod", icon: "📦", to: "/product"}, 
        {name: "Prodaja", icon: "💰", to: "/sale"}, 
    ]

  return (
    <div className="navbar">
      <div className="navbarTitle">Admin</div>
        {options.map((option, index) => (
          <Link key={index} className="navOption" style={{color: 'inherit', textDecoration: 'none'}} to={option.to}>
                <div className='icon'>
                    {option.icon}
                </div>
                {option.name}
          </Link>
        ))}
    </div>
  );
};

export default Navbar;