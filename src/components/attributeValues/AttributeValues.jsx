
import React from "react";
import './AttributeValues.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";

const AttributeValues = ({item, name, colorDate=[], headlineArray=[]}) => {
    const filter = (a) => {
        for (let x in headlineArray) {
            if (a===headlineArray[x].title) {
                return true;
            }
        }
        return false;
    }

    const handleDelete = () => {
        const old = JSON.parse(localStorage.getItem(name));
        console.log(item);
        let removeIndex;
        old.forEach((obj, index) => {
            console.log(obj);
            const areEqual = JSON.stringify(item) === JSON.stringify(obj);

            if (areEqual) {
                console.log("found it", obj);
                removeIndex=index;
            }
        })
        old.splice(removeIndex,1);
        console.log(old);
        localStorage.setItem(name,JSON.stringify(old));
    };

    const renderAttribute = (key, index) => {
        let progressBarTrue = false;
        let colorDateTrue = false;
        colorDate.forEach(number => {
            if (number===index) {
                colorDateTrue=true;
            }
        })
    
        if (colorDate.length>0 && colorDateTrue) {
            return (
                <span style={{color: "red", fontWeight: "600"}}>
                    {item[key]}
                </span>
            )
        }
        return (
            <>
                {item[key]}
            </>
        )
    }

    return (
        <div className="postContainer">
            <div className="FlexRow">
                {Object.keys(item).filter(item=>filter(item)).map((key, index) => (
                    <div key={index} className="attributeValue">
                        {renderAttribute(key, index)}
                    </div>
                ))}
            </div>
            <div className="FlexRow">
                <div className="buttonContainerPost" onClick={handleDelete}>
                    <FontAwesomeIcon icon={faTrashCan} size="xl"/>
                </div>
            </div>
        </div>
    );
}

export default AttributeValues;
