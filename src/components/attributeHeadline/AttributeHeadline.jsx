import React, {useState} from "react";
import "./AttributeHeadline.css";

const AttributeHeadline = ({headlineArray, data, setData}) => {
    const [sortByAttribute, setSortByAttribute] = useState("title")
    const [pointDirection, setPointDirection] = useState(true);

    const renderTriangle = (titleName) => {
        if (sortByAttribute!==titleName) return <></>;
        if (pointDirection===true) return <>&#9662;</>;
        else return <>&#9652;</>;
    }

    const sortFunction = (sortTitle, pointDirection) => {
        let tmpItems = [...data];
        tmpItems = tmpItems.sort((a,b) => {
            if (typeof(a[sortTitle])===typeof("A")) {
                if (pointDirection===1) {
                    return a[sortTitle].localeCompare(b[sortTitle]);
                } else {
                    return b[sortTitle].localeCompare(a[sortTitle]);
                }
            } else return (a[sortTitle]-b[sortTitle])*pointDirection;
        });
        setData(tmpItems);
    }

    const handleHeaderClick = (headerName) => {
        if (headerName.title===sortByAttribute) {
            setPointDirection(!pointDirection);
            sortFunction(headerName.title, pointDirection?-1:1);
        } else {
            setSortByAttribute(headerName.title);
            setPointDirection(true);
            sortFunction(headerName.title, 1);
        }
    }

    return (
        <div className="FlexRow" style={{width:"100%", marginBottom: "8px"}}>
            {headlineArray.map((headline, index) => (
                <div className="headline-2 attributeValue" key={index} onClick={() => {handleHeaderClick(headline)}}>
                    {headline.displayedTitle}{renderTriangle(headline.title)}
                </div>
            ))}
        </div>
    )
}

export default AttributeHeadline;

