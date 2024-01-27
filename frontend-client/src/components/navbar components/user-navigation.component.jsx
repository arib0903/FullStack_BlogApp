import { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../App";
import { removeFromSession } from "../../common/session";
import AnimationWrapper from "../../common/page-animation";

const UserNavigationPanel = ()=>{
    const {userAuth: {username}, setUserAuth} = useContext(UserContext);

    const signOutUser = () => {
    removeFromSession("user");
    setUserAuth({ access_token: null });
    }

    return (
        <AnimationWrapper transition={{duration:0.2, y: {duration:0.1}}}>
            <div className="bg-white absolute right-0 border duration-200 border-grey w-60">
            <Link to = "/editor" className = "flex gap-2 link md:hidden"> 
                <i className='fi fi-rr-file-edit'></i>
                <p> Write </p>
            </Link>

            <Link to = {`/user/${username}` } className="link pl-8 py-4">
            Profile
            </Link>
            <Link to = "/dashboard/blogs" className="link pl-8 py-4">
            Dashboard
            </Link>
            <Link to = "/settings/edits-profile" className="link pl-8 py-4">
            Settings
            </Link>

            <span className="absolute border-t border-grey w-[100%]"></span>


            <button className="text-left p-4 hover:bg-grey w-full pl-8 py-4" onClick = {signOutUser}>
                <h1 className="font-bold text-xl mg-1">Sign out</h1>
                <p className = "text-dark-grey">@{username}</p>
            </button>
        </div>
        </AnimationWrapper>
        
    )

}

export default UserNavigationPanel;