import { Link } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { useContext, useRef } from "react";
import {Toaster, toast} from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { Navigate } from "react-router-dom";

import AnimationWrapper from "../common/page-animation";


// gets the prop "type"(sign-in or sign-up) from App.jsx
const UserAuthForm = ({type}) => {
    const authForm = useRef();// to be able to access the form elements

    let {userAuth: {access_token}, setUserAuth} = useContext(UserContext);

    // console.log(access_token);



    // 1. FUNCTION TO SEND DATA TO BACKEND 
    const userAuthThroughServer = (serverRoute,formData) =>{

        //use axios to create request to the server
        //sends the form data to the server via the vite server domain + server route
        console.log(import.meta.env.VITE_SERVER_DOMAIN + serverRoute);
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
        .then(({data}) =>{
           
            storeInSession("user", JSON.stringify(data));  //here we store the user's session as a string 
            setUserAuth(data); //here we update the user data from App.jsx's setUserAuth function
        }).catch(({response}) => {
            toast.error(response.data.error);
        })
        //we destructure just "data" from the response because we get other shit we don't need

    }
    const handleSubmit = (e) => {
        e.preventDefault(); //prevent form from submission initially
        let serverRoute = type == "sign-in" ? "/signin" : "/signup";
        let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
        let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


        // 1.Form Data retrieval
        let form = new FormData(formElement); //authForm.current is the HTML tag. FormData function retreives all that data 
        let formData = {};

        // 2. POPULATING formData WITH DATA:
        //form.entries = the 3 inputs in the form
        for(let [key, value] of form.entries()){
            formData[key] = value;
        }
        // console.log(formData);

        // 3. DESTRUCTURING VALUES FROM formData
        let {fullname, email, password} = formData;

        // 4. FORM VALIDATIONS:
        if(fullname){
            if (fullname.length < 3) {return toast.error("fullname must be 3 letters long" );}
        }
        if (!email.length) {return toast.error( "enter email" );}

        if (!emailRegex.test(email)) {return toast.error( "email is invalid" );}

        if (!passwordRegex.test(password)) {return toast.error("Password should be 6-20 chars long with numeric, 1 lowercase and 1 uppercase letters",); }      
        
        // 5. SEND DATA TO BACKEND 
        userAuthThroughServer(serverRoute, formData);  
        
  
    }

    return(
        access_token ? 
        <Navigate to = "/" /> 
        :
        <AnimationWrapper keyValue={type}> 
            <section className="h-cover flex items-center justify-center">
                <Toaster/>
                <form id = "formElement" className="w-[80%] max-w-[400px]">
                    <h1 className="text-4xl font-gelasio capitalize text-center mb-24">
                        {type == 'sign-in' ? 'Welcome back' : 'Onboarding'}
                    </h1>

                    {/* MAKING FOR SIGN IN/ REGISTER BOXES */}
                    {
                        type != "sign-in" ? <InputBox name = "fullname" type = "text" placeholder="Full name" icon = "fi-rr-user"/> : ""
                    }
                    <InputBox name = "email" type = "email" placeholder="Email" icon = "fi-rr-envelope"/>
                    <InputBox name = "password" type = "password" placeholder="Password" icon = "fi-rr-key"/>
                    <button className = "btn-dark center mt-14" type = "submit" onClick={handleSubmit}>
                        {type.replace('-', ' ')}
                    </button>

                    <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
                        <hr className="w-1/2 border-black"/>
                        <p>OR</p>
                        <hr className="w-1/2 border-black"/>
                    </div>

                    <button className="btn-dark flex items-center justify-center gap-4 q-[90%] center">
                        <img src={googleIcon} className="w-5"/>
                        Continue with Google 
                    </button>

                    {
                        type == "sign-in" ? <p className="mt-6 text-dark-grey text-xl text-center">Don't have an account ? <Link to = "/signup" className="underline">Sign up</Link></p> : 
                        <p className="mt-6 text-dark-grey text-xl text-center">Already a member?<Link to = "/signin" className="underline"> Sign in here</Link></p> 
                    }

                </form>
            </section>
    </AnimationWrapper>

    )
}

export default UserAuthForm;