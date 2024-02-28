
import React, {useState} from "react";
import "./NewItem.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const NewItem = ({titles, onSubmit, counter, setCounter}) => {


    const renderInput = (title) => {

        switch (title.type) {
            case "text":
                return (
                    <>
                        <label htmlFor={title.title} className="headline-2">{title.displayedTitle}</label>
                        <input type="text" id={title.title} placeholder="Upišite ovdje..." className="oneInputField"/>
                    </>
                );
            case "select":
                return (
                    <>
                        <label htmlFor={title.title} className="headline-2">{title.displayedTitle}</label>
                        <select id={title.title} className="oneInputField">
                            <option value={'-'} className="oneInputField"> -- Select Option -- </option> 
                            {title.data.map(item => (
                                <option value={item.id} key={item.id} className="oneInputField"> {item.name} </option> 
                            ))}
                        </select>
                    </>
                );
            case "checkbox":
                return (
                    <>
                        <label htmlFor={title.title} className="headline-2">{title.displayedTitle}</label>
                        <input type="checkbox" id={title.title} className="oneCheckboxField"/>
                    </>
                );
            case "date":
                return (
                    <>
                        <label htmlFor={title.title} className="headline-2">{title.displayedTitle}</label>
                        <input type="date" id={title.title} className="oneCheckboxField"/>
                    </>
                );
            case "textarea":
                return (
                    <>
                        <label htmlFor={title.title} className="headline-2">{title.displayedTitle}</label>
                        <textarea type="text" id={title.title} placeholder="Upišite ovdje..." className="oneBigInputField"/>
                    </>
                );
            case "image": 
                return (
                    <>
                        <label htmlFor={title.title} className="headline-2">{title.displayedTitle}</label>
                        <input type="file" id={title.title} className="imagesField"/>
                    </>
                )
            case "images":
                return (
                    <>
                        <label htmlFor={title.title} className="headline-2">{title.displayedTitle}</label>
                        <input type="file" multiple id={title.title} className="imagesField" onChange={handleFileChange}/>
                        <div className="">
                            Selected Images:
                            <div className="FlexRow">
                            {selectedFiles.map((file, index) => (
                                <div className="imagePreviewContainer"
                                key={index}
                                draggable
                                onDragStart={handleDragStart(index)}
                                onDragOver={handleDragOver(index)}
                                onDrop={handleDrop(index)}
                                >
                                    <img src={URL.createObjectURL(file)} alt={`Preview ${index}`} className="imagePreview"/>
                                </div>
                            ))}
                            </div>    
                        </div>
                    </>
                );
            case "image":
                
                break;
            

            default:
                break;
        }
    }

    const [selectedFiles, setSelectedFiles] = useState([]);

    const handleSubmit = (e) => {
        onSubmit(e);
        return;
    }

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedFiles(files);
    }

    const handleDragStart = (index) => (e) => {
        e.dataTransfer.setData('index', index.toString());
      };
    
      const handleDragOver = (index) => (e) => {
        e.preventDefault();
      };
    
      const handleDrop = (index) => (e) => {
        e.preventDefault();
    
        const draggedIndex = parseInt(e.dataTransfer.getData('index'), 10);
        const newOrder = [...selectedFiles];
        const [draggedItem] = newOrder.splice(draggedIndex, 1);
    
        newOrder.splice(index, 0, draggedItem);
        setSelectedFiles(newOrder);
      };
    
      const [childrenVisible, setChildrenVisible] = useState(false);


    return (
        <form className="newPostContainer" onSubmit={handleSubmit}>
            <div className="createPostContainer">
                {titles.filter(title => !title.advanced && !(title.type==="textarea" || title.type==="image" || title.type==="images" || title.type==="multiple")).map((title, index) => (
                    <div className="oneInputContainer" key={index}>
                        {renderInput(title)}
                    </div>
                ))}
            </div>
            <div className="createPostContainer">
                {titles.filter(title => !title.advanced && (title.type==="textarea" || title.type==="image" || title.type==="images")).map((title, index) => (
                    <div className="oneInputContainer" key={index}>
                        {renderInput(title)}
                    </div>
                ))}
            </div>
                {titles.filter(title => !title.advanced && (title.type==="multiple")).map((title, index) => (
                    <div key={index}>
                        <div className="createPostContainer">
                        <button onClick={(e) => {e.preventDefault(); setCounter(counter+1);}}>
                            Add more material
                        </button>
                        </div>
                        {Array.from({ length: counter }, (_, index) => (
                            <div className="createPostContainer" key={index}>
                                {title.titleHeaders.map((titleHeader, innerIndex) => {
                                    titleHeader.title = titleHeader.title.slice(0,-1) + index;
                                    return (
                                    <div className="oneInputContainer" key={innerIndex}>
                                        {renderInput(titleHeader)}
                                    </div>)
                                })}
                            </div>
                        ))}
                    </ div>
                ))}
            {titles.filter(title => title.advanced).length>0 && (
            <>
                <div className="advancedHeader" onClick={() => setChildrenVisible(!childrenVisible)}>Advanced settings{childrenVisible?<>&#9652;</>:<>&#9662;</>}</div>
                <div className="createPostContainer">
                {childrenVisible && titles.filter(title => title.advanced).map((title, index) => (
                    <div className="oneInputContainer" key={index}>
                        {renderInput(title)}
                    </div>
                ))}
                </div>
            </>
            )}
                <button type="submit" className="submitButton">
                    <FontAwesomeIcon icon={faCheck} size="2x" />
                </button>
        </form>
    );
}

export default NewItem;