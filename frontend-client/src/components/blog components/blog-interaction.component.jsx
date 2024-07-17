import { useContext, useState} from "react";
import { BlogContext } from "../../pages/blog.page";
import { Link, useNavigate} from "react-router-dom";
import { UserContext } from "../../App";
import {Toaster,toast} from "react-hot-toast";
import axios from "axios";


const BlogInteraction = () => {

    let {blog, blog:{blog_id, _id, activity, activity:{total_likes,total_comments},author: {personal_info: {username: author_username}}}, setBlog,setIsLikedByUser, isLikedByUser} = useContext(BlogContext);

    let {userAuth:{username,access_token}} = useContext(UserContext);
    const navigate= useNavigate()
    
    

    const handleLike= ()=>{

        if(access_token){
            //Like the blog
            setIsLikedByUser((currVal) => !currVal);
            

            isLikedByUser ? total_likes--: total_likes++; 

            setBlog({...blog, activity: {...activity, total_likes}})
            console.log(blog)
            localStorage.setItem('isLikedByUser', JSON.stringify(!isLikedByUser));

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", {_id, isLikedByUser, total_likes}, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(({data})=>{

                console.log(data)
            })
            .catch(err =>{
                console.log(err)
            })
        }

        else{
            //Not logged in
            // toast.error("Login to like this blog");
             navigate("/signin") //use this to navigate to the signin page 
        }



    }

    const handleDelete = () => {
        const enteredUsername = prompt("Please enter your username to confirm deletion:");
            if (enteredUsername !== author_username) { 
                toast.error("Username is incorrect. Deletion cancelled.");
                return;
            }
        let loadingToast = toast.loading("Deleting Blog...");
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/delete-blog", {_id, blog_id}, {
                headers: {
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(({data})=>{
                console.log(data)
                toast.dismiss(loadingToast);
                toast.success("Blog Deleted!");
                navigate("/")
                
            })
            .catch(err =>{
                console.log(err)})
}

    // console.log(isLikedByUser, total_likes)
    return(
        <>
        <Toaster />
        <hr className="border-grey my-2" />
        
            <div className={"flex gap-6 " + (username == author_username ? "justify-between" : " " )}>
                {/* <div className="flex gap-3 items-center">
                    <button className={"w-10 h-10 rounded-full flex items-center justify-center bg-grey/80 " + (isLikedByUser ? " bg-red/20 text-red": "bg-grey/80")}
                    onClick={handleLike}>
                        <i className="fi fi-rr-heart"></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_likes}</p>

                </div>
                <div className="flex gap-3 items-center">
                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
                        <i className="fi fi-rr-comment-dots"></i>
                    </button>
                    <p className="text-xl text-dark-grey">{total_comments}</p>
                </div> */}

                <div className="flex items-center justify-between w-full">
                    {
                        username === author_username ?
                        (
                        <>
                            <Link to = {`/editor/${blog_id}`} className="underline hover:text-purple">Edit Post</Link>
                            <button className="flex items-center justify-center w-32 h-10 rounded-full bg-black hover:bg-red text-white focus:outline-none"onClick={handleDelete}> delete</button>

                        </>
                        ): " "
                        
                    }
                    
                </div>
            </div>

                

            


        
        </>
        
    )

}

export default BlogInteraction;