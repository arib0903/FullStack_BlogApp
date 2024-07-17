import Navbar from "./components/navbar components/navbar.component";
import {Routes, Route} from "react-router-dom";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useEffect,useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor.pages";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import BlogPage from "./pages/blog.page";
import TestLike from "./components/blog components/test";
import FooterComp from "./components/footer-component";
// 1. CREATE GLOBAL STATE 
export const UserContext = createContext({});
const App = () => {

    // 2. SET GLOBAL STATE VARIABLE (userAuth)
    const [userAuth, setUserAuth] = useState({}); //userAuth is the global state

    // 3. UPDATE GLOBAL STATE VARIABLE (userAuth) 
    useEffect(() => {
        let userInSession = lookInSession("user"); //gets the user's session string
        console.log(userInSession)
        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({access_token: null})
    }, []);

    return (
        // wrapping the app around userContext allows for us to have a global state variable (userAuth)
        // all of the children of the userContext will have access to this
        <UserContext.Provider value = {{userAuth, setUserAuth}}>
            <Routes>
            {/* We nest the Navbar route(Parent route) with the other routes so we are able to see the navbar on each of these pages */}
            <Route path="/editor" element={<Editor></Editor>}/>
            <Route path="/editor/:blog_id" element={<Editor></Editor>}/>

            <Route path="/" element={<Navbar />}>
                <Route index element = {<HomePage/>}></Route>
                <Route path="/signin" element={<UserAuthForm type = "sign-in"></UserAuthForm>} />
                <Route path="/signup" element={<UserAuthForm type = "sign-up"></UserAuthForm>} />
                <Route path="search/:query" element ={<SearchPage ></SearchPage>}/>
                <Route path = "user/:id" element = {<ProfilePage></ProfilePage>}></Route>
                <Route path = "blog/:blog_id" element = {<BlogPage></BlogPage>}></Route>
                <Route path = "*" element = {<PageNotFound></PageNotFound>}></Route>
                <Route path = "test" element = {<TestLike></TestLike>}></Route>
            </Route>
        </Routes>
        <FooterComp></FooterComp>
        </UserContext.Provider>
        
    )
}

export default App;