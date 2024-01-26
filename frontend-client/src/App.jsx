import Navbar from "./components/navbar components/navbar.component";
import {Routes, Route} from "react-router-dom";
import UserAuthForm from "./pages/userAuthForm.page";
const App = () => {
    return (
        <Routes>
            {/* We nest the Navbar route(Parent route) with the other routes so we are able to see the navbar on each of these pages */}
            <Route path="/" element={<Navbar />}>
                <Route path="/signin" element={<UserAuthForm type = "sign-in"></UserAuthForm>} />
                <Route path="/signup" element={<UserAuthForm type = "sign-up"></UserAuthForm>} />
            </Route>
            

        </Routes>
    )
}

export default App;