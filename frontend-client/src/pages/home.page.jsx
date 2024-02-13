import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component";
import { useEffect, useState } from "react";
import Loader from "../components/loader.component";
import BlogPostCard from "../components/blog components/blog-post.component";
import MinimalBlogPost from "../components/nobanner-blog-post.component";
import NoDataMessage from "../components/nodata.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import LoadMoreDataBtn from "../components/load-more.component";
const HomePage = () => {

    let [blogs, setBlogs] = useState(null);
    let [trendingBlogs, setTrendingBlogs] = useState(null);
    let categories = ["Tech", "Science", "Health", "Business", "Entertainment", "Sports", "Education", "Lifestyle", "Travel"]
    let [pageState, setPageState] = useState("home");
    let [totaldocs, setTotaldocs] = useState(0);



    /********************************************** Fetching data ********************************************/

    const fetchLatestBlogs = ({page = 1}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs", {page})
        .then(async ({data}) => {
            // setBlogs(data.blogs);
            //data.blogs = new data, blogs = prev data
            let formatData = await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                countRoute : "/all-latest-blogs-count"
            })
            // console.log(formatData);
            setBlogs(formatData);
            setTotaldocs(formatData.totalDocs);
           
        }).catch(err => {
            console.log(err);
        })
    }
    const fetchTrendingBlogs = () => {
            axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/trending-blogs")
            .then(({data}) => {
                setTrendingBlogs(data.blogs);
            }).catch(err => {
                console.log(err);
            })
        }

    const fetchBlogsByCategory = ({page = 1}) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs",{tag: pageState, page})
        .then(async ({data}) => {
            let formatData = await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                countRoute : "/search-blogs-count",
                data_to_send: {tag: pageState}
            })
            setBlogs(formatData);
            setTotaldocs(formatData.totalDocs);
        }).catch(err => {
            console.log(err);
        })
    }

    /********************************************** Topics Button Functionality ********************************************/

    const loadBlogByCategory = (e) => {
        let category = e.target.innerText.toLowerCase();
        console.log("category",category);
        setBlogs(null);
        console.log("pagestate",pageState);
        if(pageState == category){
            setPageState("home");
            return;

    }
    setPageState(category);
}

    /********************************************** Call Function To Fetch Blogs On Render ********************************************/


    useEffect(() => {

        if(pageState == "home"){
            fetchLatestBlogs({page: 1});
        }
        else{
            fetchBlogsByCategory({page:1});
        }

        if(trendingBlogs == null){
            fetchTrendingBlogs();
        }
        
    },[pageState])

    
      


    return (
        <AnimationWrapper>
            <section className="h-cover flex justify-center gap-10">
                {/* Latest blogs */}
                <div className="w-full">
                    <InPageNavigation defaultHidden = {["trending blogs"]}routes = {[pageState, "trending blogs" ]}>  

                        {/* Rendering Blogs via BlogPostCard component */}
                        <> 
                            {
                                blogs ? 
                                 <div className="flex justify-end">
                                {
                                    totaldocs != 0 ? <b><p className="text-dark-grey">Displaying Blogs: {blogs.results.length} / {totaldocs} </p></b>: ""
                                }
                                
                            </div>: ""
                             
                            }
                           
                           
                            
                        

                    
                        <br />
                        {
                            blogs == null ? <Loader/> :
                            blogs.results.length ? 
                                blogs.results.map((blog, index) => {
                                    return (
                                    <AnimationWrapper key = {index} transition={{duration:1,delay: index*.1}}>
                                        <BlogPostCard BlogContent = {blog} author = {blog.author.personal_info}></BlogPostCard>
                                    </AnimationWrapper>
                                    )
                                }) : <NoDataMessage message={`No Blogs Published in ${pageState}`}></NoDataMessage>

                        }
                            <LoadMoreDataBtn state ={blogs} fetchDataFun={(pageState == "home" ? fetchLatestBlogs : fetchBlogsByCategory)}></LoadMoreDataBtn>
                            {
                                blogs ? 
                                 <div className="flex justify-end">
                                {
                                    totaldocs != 0 ? <b><p className="text-dark-grey">Displaying Blogs: {blogs.results.length} / {totaldocs} </p></b>: ""
                                }
                                
                            </div>: ""
                             
                            }
                                 
                               
                                    
                            
                        </>
                        {/* Rendering Trending Blogs via MinimalBlogPost component */}
                        {
                            trendingBlogs == null ? <Loader/> :
                            trendingBlogs.map((blog, index) => {
                                return (
                                <AnimationWrapper key = {index} transition={{duration:1,delay: index*.1}}>
                                    <MinimalBlogPost blog = {blog} index = {index}></MinimalBlogPost>
                                </AnimationWrapper>
                                )
                            })
                        }

                    </InPageNavigation>
                    
                </div>

                {/* Rendering Filters + Functionalities */}
                <div className="min w-[40%] lg:min-w-[400px] max-w-min border-l border-grey pl-8 pt-3 max-md:hidden">
                    <div className="flex flex-col gap-10">

                        <h1 className="font-medium text-xl mb-8">Stories from all interest</h1>
                        <div className="flex gap-3 flex-wrap">

                            {
                                categories.map((category, index) => {
                                    return (
                                    <button onClick = {loadBlogByCategory} key = {index} className={"tag " + ( category.toLowerCase() == pageState ? " bg-black text-white " : " ")}>{category}
                                    </button>
                                    
                                    )
                                })
                            }

                        </div>

                    

                    <div>
                        <h1 className="font-medium text-xl mb-8">Trending <i className="fi fi-rr-arrow-trend-up"></i>
                        
                        </h1>

                        {
                            trendingBlogs == null ? <Loader/> :
                            trendingBlogs.map((blog, index) => {
                                return (
                                <AnimationWrapper key = {index} transition={{duration:1,delay: index*.1}}>
                                    <MinimalBlogPost blog = {blog} index = {index}></MinimalBlogPost>
                                </AnimationWrapper>
                                )
                            })
                        }
                    </div>

                    
                </div>
                </div>
            </section>


        </AnimationWrapper>
    )

}

export default HomePage;
