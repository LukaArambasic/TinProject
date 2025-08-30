
import React from 'react';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faScrewdriverWrench, faGhost, faPiggyBank } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const options = [
        {name: "Početna", icon: faHouse, to: "/home"}, 
        {name: "Materijal", icon: faScrewdriverWrench, to: "/material"}, 
        {name: "Proizvod", icon: faGhost, to: "/product"}, 
        {name: "Prodaja", icon: faPiggyBank, to: "/sale"}, 
    ]

  return (
    <div className="navbar">
      <div className="navbarTitle">Admin</div>
        {options.map((option, index) => (
          <Link key={index} className="navOption" style={{color: 'inherit', textDecoration: 'none'}} to={option.to}>
                <div className='icon'>
                    <FontAwesomeIcon icon={option.icon} />
                </div>
                {option.name}
          </Link>
        ))}
    </div>
  );
};

export default Navbar;