import React from 'react';
import './Header.css'; // Import your CSS file for styling

const Header = ({pageName="Home"}) => {
    return (
        <div className="header">
            <div className="pageName">{pageName}</div>
        </div>
    );
};

export default Header;





