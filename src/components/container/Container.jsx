import React, { useState } from 'react';
import './Container.css'; // Import your styles

const Container = ({ headline, children }) => {
  const [childrenVisible, setChildrenVisible] = useState(true);
  return (
    <div className="customContainer">
      <div className="containerHeadline" onClick={() => setChildrenVisible(!childrenVisible)}>{headline}{childrenVisible?<>&#9652;</>:<>&#9662;</>}</div>
      {childrenVisible && children}
    </div>
  );
};

export default Container;