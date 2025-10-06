import React from 'react';
import './Header.css';

const Header = ({pageName="Home", children}) => {
    return (
        <div className="header">
            <div className="header-left">
                {children}
                <div className="pageName">{pageName}</div>
            </div>
        </div>
    );
};

export default Header;





