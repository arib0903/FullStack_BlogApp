
import React, { useEffect,useState } from 'react'


const TestLike = () => {
    const [blogs, setBlogs] = useState([]);
    const [likedBlogs, setLikedBlogs] = useState([]);
    const [changed, setChanged] = useState(false);

    const handleLike = (id) => {
        setChanged(false)
        console.log(id)
        const LikedBlog = {
            blog_id: id,
            user_email: "mahboobarib@gmail.com",
            liked: true
        }
        fetch('http://localhost:3000/test', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(LikedBlog)
        })
            .then(res => res.json())
            .then(data => {
                 console.log('save user:', data);
            
                setChanged(true)

            })



    }


    useEffect(() => {
        fetch("http://localhost:3000/trending-blogs").then(response=>response.json())
        .then(data=>{
            // console.log(data)
            setBlogs(data.blogs)
        })
        .catch(error=>console.log(error))

        


    }, [])

     useEffect(() => {
        fetch("http://localhost:3000/test").then(response=>response.json())
        .then(data=>{
            console.log(data)
            // setBlogs(data.blogs)
            setLikedBlogs(data)
        })
        .catch(error=>console.log(error))

        


    }, [])

    return (
        <div>
            
            <ul>
                {blogs.map(blog=>(
                    <li className = "flex gap-5" key={blog.blog_id}>
                        <p>{blog.title}</p>
                        {likedBlogs.map(likedBlog=>
                            <button style = {{background:"red"}} onClick={()=>handleLike(blog.blog_id)}>{likedBlog.blog_id === blog.blog_id && likedBlog.liked === true ? "liked":"like"}</button>)
                            
                            }
                        {/* {likedBlogs.length === 0 && <button style = {{background:"red"}} onClick={()=>handleLike(blog.blog_id)}>like</button>} */}
                    </li>
                ))}
            </ul>
            
        </div>
    )
    
}

export default TestLike
