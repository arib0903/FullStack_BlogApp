import { useParams } from "react-router-dom";

import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import BlogPostCard from "../components/blog components/blog-post.component";
import Loader from "../components/loader.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";
import AnimationWrapper from "../common/page-animation";
import { filterPaginationData } from "../common/filter-pagination-data";
import axios from "axios";
import UserCard from "../components/usercard.component";


const SearchPage = () => {

    let {query} = useParams();//takes the parameters of the address url

    let [blogs,setBlogs] = useState(null)
    let [users, setUsers] = useState(null);
    let [totalDocs, setTotalDocs] = useState(0);
   
    console.log(blogs)

    const searchBlogs = ({page = 1, create_new_array = false}) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {query, page})
        .then(async ({data}) => {
            // setBlogs(data.blogs);
            //data.blogs = new data, blogs = prev data
            let formatData = await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                countRoute : "/search-blogs-count",
                data_to_send: {query},
                create_new_array
            })
            console.log(formatData);
            setBlogs(formatData);
            setTotalDocs(formatData.totalDocs);
           
        }).catch(err => {
            console.log(err);
        })

    }

    const fetchUsers = ()=> {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", {query})
        .then(({data: {users}}) => {
            console.log(users)
            setUsers(users);
        }).catch(err => {
            console.log(err);
        })
    }


    useEffect(() => {
        resetState();
        searchBlogs({page: 1, create_new_array: true});
        fetchUsers();

    },[query])

    const resetState = () => {
        setBlogs(null);
        setUsers(null);
        
    }

    const UserCardWrapper = () => { 

        return(
            <>
                {
                    users == null ? <Loader/> : users.length ? users.map((user, index) => {
                        return <AnimationWrapper key = {index} transition={{duration:1,delay: index*.08}}>
                                    <UserCard user = {user}></UserCard>
                                </AnimationWrapper>}) : 
                    <NoDataMessage message="No Users Found"></NoDataMessage>
                }
            
            </>
        )
    }

    return(

        <section className="h-cover flex justify-center gap-10">

            {/* Blog posts Results section */}
            <div className="w-full">
                <InPageNavigation routes = {[`Search Results For "${query}" (${totalDocs})`, "Accounts Matched"]} defaultHidden = {["Accounts Matched"]}>
                    <>
                        {/* Rendering Blogs via BlogPostCard component */}
                            <div className="flex justify-end">
                                {
                                    totalDocs != 0 ? <b><p className="text-dark-grey">Displaying Blogs: {blogs.results.length} / {totalDocs} </p></b>: ""
                                }
                                
                            </div>

                    
                        {
                            blogs == null ? <Loader/> :
                            blogs.results.length ? 
                                blogs.results.map((blog, index) => {
                                    return (
                                    <AnimationWrapper key = {index} transition={{duration:1,delay: index*.1}}>
                                        <BlogPostCard BlogContent = {blog} author = {blog.author.personal_info}></BlogPostCard>
                                    </AnimationWrapper>
                                    )
                                }) : <NoDataMessage message="No Blogs Published"></NoDataMessage>

                        }
                            <LoadMoreDataBtn state = {blogs} fetchDataFun={searchBlogs}></LoadMoreDataBtn>

                            {
                               !blogs || blogs.results.length > 5 ?
                                <div className="flex justify-end">
                                {
                                    totalDocs != 0 ? <b><p className="text-dark-grey">Displaying Blogs: {blogs.results.length} / {totalDocs} </p></b>: ""
                                }
                                
                            </div> :
                            " "
                            }
                            

                    

                    </>

                    {/* Rendering Users */}
                    <UserCardWrapper></UserCardWrapper>
                        

                </InPageNavigation>

            </div>

            <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                <h1 className="font-medium text-xl mb-8"> Users related to search <i className="fi fi-rr-user mt-1"></i></h1>
                <UserCardWrapper></UserCardWrapper>

            </div>
        </section>


    )

}

export default SearchPage;