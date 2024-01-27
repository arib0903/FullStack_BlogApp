import Navbar from "./components/navbar components/navbar.component";
import {Routes, Route} from "react-router-dom";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useEffect,useState } from "react";
import { lookInSession } from "./common/session";
export const UserContext = createContext({});
const App = () => {

    const [userAuth, setUserAuth] = useState({}); //userAuth is the global state

    useEffect(() => {
        let userInSession = lookInSession("user"); //gets the user's session string

        userInSession ? setUserAuth(JSON.parse(userInSession)) : setUserAuth({access_token: null})
    }, []);

    return (
        // wrapping the app around userContext allows for us to have a global state.
        // all of the children of the userContext will have access to the global state
        <UserContext.Provider value = {{userAuth, setUserAuth}}>
            <Routes>
            {/* We nest the Navbar route(Parent route) with the other routes so we are able to see the navbar on each of these pages */}
            <Route path="/" element={<Navbar />}>
                <Route path="/signin" element={<UserAuthForm type = "sign-in"></UserAuthForm>} />
                <Route path="/signup" element={<UserAuthForm type = "sign-up"></UserAuthForm>} />
            </Route>
        </Routes>
        </UserContext.Provider>
        
    )
}

export default App;