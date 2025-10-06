import React, { useState, useEffect } from 'react';
import './Layout.css';
import Navbar from '../navbar/Navbar';
import Header from '../header/Header';
import HamburgerMenu from '../hamburgerMenu/HamburgerMenu';

const Layout = ({ pageName, children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className='App FlexRow'>
      <Navbar isOpen={isMenuOpen} onClose={closeMenu} />
      <div className="main-content">
        <Header pageName={pageName}>
          <HamburgerMenu isOpen={isMenuOpen} toggleMenu={toggleMenu} />
        </Header>
        <div className='RestOfScreen'>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
