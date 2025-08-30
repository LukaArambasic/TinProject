import React, { useState } from "react";
import "./AttributeHeadline.css";

const AttributeHeadline = ({ headlineArray, data, setData }) => {
    const [sortByAttribute, setSortByAttribute] = useState("title");
    const [pointDirection, setPointDirection] = useState(true);

    const renderTriangle = (titleName) => {
        if (sortByAttribute !== titleName) return null;
        return (
            <span className="sortIcon">
                {pointDirection ? '▼' : '▲'}
            </span>
        );
    }

    const sortFunction = (sortTitle, pointDirection) => {
        let tmpItems = [...data];
        tmpItems = tmpItems.sort((a, b) => {
            if (typeof(a[sortTitle]) === typeof("A")) {
                if (pointDirection === 1) {
                    return a[sortTitle].localeCompare(b[sortTitle]);
                } else {
                    return b[sortTitle].localeCompare(a[sortTitle]);
                }
            } else {
                return (a[sortTitle] - b[sortTitle]) * pointDirection;
            }
        });
        setData(tmpItems);
    }

    const handleHeaderClick = (headerName) => {
        if (headerName.title === sortByAttribute) {
            setPointDirection(!pointDirection);
            sortFunction(headerName.title, pointDirection ? -1 : 1);
        } else {
            setSortByAttribute(headerName.title);
            setPointDirection(true);
            sortFunction(headerName.title, 1);
        }
    }

    return (
        <div className="attributeHeader">
            {headlineArray.map((headline, index) => (
                <div 
                    className="attributeValue" 
                    key={index} 
                    onClick={() => handleHeaderClick(headline)}
                >
                    <span>{headline.displayedTitle}</span>
                    {renderTriangle(headline.title)}
                </div>
            ))}
        </div>
    );
}

export default AttributeHeadline;