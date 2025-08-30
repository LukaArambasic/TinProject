import React, { useState } from 'react';
import './Container.css';

const Container = ({ headline, children }) => {
  const [childrenVisible, setChildrenVisible] = useState(true);
  
  return (
    <div className="customContainer">
      <div 
        className="containerHeadline" 
        onClick={() => setChildrenVisible(!childrenVisible)}
      >
        <span>{headline}</span>
        <span className="expandIcon">
          {childrenVisible ? '▲' : '▼'}
        </span>
      </div>
      {childrenVisible && (
        <div className="containerContent animate-fade-in">
          {children}
        </div>
      )}
    </div>
  );
};

export default Container;