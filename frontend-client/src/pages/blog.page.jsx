import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog components/blog-interaction.component";
import BlogPostCard from "../components/blog components/blog-post.component";
import BlogContent from "../components/blog components/blog-content.component";


export const blogStructure = {  
        title: '',
        banner: '',
        content : [],
        des: '',
        author: {
          personal_info: {}
        },
        publishedAt: ''
    }

    export const BlogContext = createContext({})


const BlogPage = () => {

    

    let {blog_id} = useParams();
    const [blog, setBlog] = useState(blogStructure);
    const [loading, setLoading] = useState(true);
    const [similarBlogs, setSimilarBlogs] = useState(blogStructure);
    const [isLikedByUser, setIsLikedByUser] = useState(false)

    let {title, publishedAt, banner, content, des, author:{personal_info:{fullname, username: author_username, profile_img}}} = blog;

    const fetchBlog = () => {
        
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", {blog_id})
        .then(({data : {blog}}) => {
            setBlog(blog)
            console.log(blog.content)
            //
            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {tag: blog.tags[0], limit: 5, eliminate_current_blog : blog_id}
            ).then(({data}) => {
                 setSimilarBlogs(data.blogs)
            })

            setLoading(false);

        }).catch(err => {
            console.log(err);
        })

    }

    useEffect(() => {
        resetStates();
        fetchBlog();
    },[blog_id])

    const resetStates = () => {
        // setBlog(blogStructure);
        setLoading(true);
        // setSimilarBlogs(blogStructure);
    }
    return(
        <AnimationWrapper>
            {
                loading ? <Loader></Loader>
                :
                <BlogContext.Provider value = {{blog, isLikedByUser, setIsLikedByUser, setBlog}}>
                    <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
                    <img src={banner} className="aspect-video" />

                    <div className="mt-12">
                        <h2>{title}</h2>
                        <div className="flex max-sm:flex-col justify-between my-8">
                            <div className="flex gap-5 items-start">
                                <img src={profile_img} className=" w-12 h-12 rounded-full" />
                                <p>
                                    {fullname}
                                    <br />
                                    @
                                    <Link to = {`/user/${author_username}`} className="underline">{author_username}</Link>
                                
                                </p>
                            </div>
                            <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:ml-12 max-sm:pl-5">Published on {getDay(publishedAt)}</p>
                            </div>

                    </div>

                    <BlogInteraction>

                    </BlogInteraction>

                        <div className="my-12 font-gelasio blog-page-content">
                            {
                                content[0].blocks.map((blocks, index) => {
                                    // console.log(blocks)
                                    return (
                                        <div className="my-4 md:my-8" key = {index}>
                                            <BlogContent block = {blocks}></BlogContent>
                                         </div>
                                    )
                                })
                            }

                        </div>

                      {/* <BlogInteraction>
                        {/* Blog content:

                        


                    </BlogInteraction> */}

                    {
                        console.log(similarBlogs)
                    }
                    {
                        similarBlogs.length > 0  && similarBlogs != null?
                        <>
                        <h1 className="text-2xl mt-14 mb-10 font-medium">Similar Blogs</h1>
                        {
                            similarBlogs.map((blogs, index) => {
                             let {author: {personal_info}} = blogs;
                             return(
                                <AnimationWrapper key = {index} transition={{duration:1, delay: index *0.08}}>
                                    <BlogPostCard BlogContent= {blogs} author = {personal_info}></BlogPostCard>

                                </AnimationWrapper>
                             )

                        })
                        }

                        </>
                        : " "
                        
                    }
                   



                </div>
                </BlogContext.Provider>
                
            }
        </AnimationWrapper>
    )

}

export default BlogPage;