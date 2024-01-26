
import React, {useState} from "react";
const InputBox = ({name, type, id, value, placeholder, icon}) => {

    const [passwordVisibile, setPasswordVisibile] = useState(false);
    return (


        <div className="relative w-[100%] mb-4 "> 

        <input type = { type === "password" ? passwordVisibile ? "text" : "password" : type} 
        name = {name} 
        placeholder={placeholder} 
        defaultValue={value} 
        id = {id}
        className = "input-box"

        
        />

        <i className= {"fi " + icon + " input-icon"}></i>

        {
            type === "password" ? <i className={"fi fi-rr-eye" + (!passwordVisibile ? "-crossed": "") + " input-icon left-[auto] right-4 cursor-pointer"} onClick={()=> setPasswordVisibile(currentVal => !currentVal)}></i> : ""
        }

        

        </div>
    )

};
export default InputBox;