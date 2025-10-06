
import React from 'react';
import './Navbar.css';
import { Link } from 'react-router-dom';

const Navbar = ({ isOpen, onClose }) => {
    const options = [
        {name: "Početna", icon: "🏠", to: "/home"},
        {name: "Materijal", icon: "🔧", to: "/material"},
        {name: "Proizvod", icon: "📦", to: "/product"},
        {name: "Prodaja", icon: "💰", to: "/sale"},
    ]

    const handleLinkClick = () => {
      if (window.innerWidth <= 768) {
        onClose();
      }
    };

  return (
    <>
      {isOpen && <div className="navbar-overlay" onClick={onClose}></div>}
      <div className={`navbar ${isOpen ? 'open' : ''}`}>
        <div className="navbarTitle">Admin</div>
          {options.map((option, index) => (
            <Link
              key={index}
              className="navOption"
              style={{color: 'inherit', textDecoration: 'none'}}
              to={option.to}
              onClick={handleLinkClick}
            >
                  <div className='icon'>
                      {option.icon}
                  </div>
                  {option.name}
            </Link>
          ))}
      </div>
    </>
  );
};

export default Navbar;