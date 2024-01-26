import Navbar from "./components/navbar.component";
import {Routes, Route} from "react-router-dom";
const App = () => {
    return (
        <Routes>
            {/* We nest the Navbar route(Parent route) with the other routes so we are able to see the navbar on each of these pages */}
            <Route path="/" element={<Navbar />}>
                <Route path="/signin" element={<h1>Sign In page</h1>} />
                <Route path="/signup" element={<h1>Sign Up page</h1>} />
            </Route>
            

        </Routes>
    )
}

export default App;