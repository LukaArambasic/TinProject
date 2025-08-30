import React from "react";
import './AttributeValues.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const AttributeValues = ({ item, name, colorDate = [], headlineArray = [] }) => {
    const filter = (a) => {
        for (let x in headlineArray) {
            if (a === headlineArray[x].title) {
                return true;
            }
        }
        return false;
    }

    const handleDelete = () => {
        const old = JSON.parse(localStorage.getItem(name));
        let removeIndex;
        old.forEach((obj, index) => {
            const areEqual = JSON.stringify(item) === JSON.stringify(obj);
            if (areEqual) {
                removeIndex = index;
            }
        });
        old.splice(removeIndex, 1);
        localStorage.setItem(name, JSON.stringify(old));
        window.location.reload(); // Refresh to show updated data
    };

    const renderAttribute = (key, index) => {
        let colorDateTrue = false;
        colorDate.forEach(number => {
            if (number === index) {
                colorDateTrue = true;
            }
        });

        const className = colorDate.length > 0 && colorDateTrue 
            ? "attributeValueItem highlighted" 
            : "attributeValueItem";

        return (
            <div className={className}>
                {item[key]}
            </div>
        );
    }

    return (
        <div className="postContainer">
            <div className="postContent">
                {Object.keys(item).filter(item => filter(item)).map((key, index) => (
                    <React.Fragment key={index}>
                        {renderAttribute(key, index)}
                    </React.Fragment>
                ))}
            </div>
            <div className="buttonContainerPost">
                <button 
                    className="actionButton deleteButton" 
                    onClick={handleDelete}
                    title="Delete item"
                >
                    <FontAwesomeIcon icon={faTrashCan} />
                </button>
            </div>
        </div>
    );
}

export default AttributeValues;