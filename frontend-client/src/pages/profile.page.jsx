import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AnimationWrapper from "../common/page-animation";
import Loader from "../components/loader.component";
import { UserContext } from "../App";
import AboutUser from "../components/about.component";
import { filterPaginationData } from "../common/filter-pagination-data";
import InPageNavigation from "../components/inpage-navigation.component";
import BlogPostCard from "../components/blog components/blog-post.component";
import NoDataMessage from "../components/nodata.component";
import LoadMoreDataBtn from "../components/load-more.component";

export const profileDataStructure = {
    personal_info: {
        fullname: "",
        username: "",
        profile_img: "",
        bio: "",

    },
    account_info: {
        total_posts: 0,
        total_blogs: 0
    },
    social_links: {},
    joinedAt: " "
}


const ProfilePage = () => {

    let {id: profileId} = useParams();

    let [profile, setProfile] = useState(profileDataStructure);
    let [loading, setLoading] = useState(true);
    let [blogs, setBlogs] = useState(null);

    let {personal_info: {fullname, username:profile_username, profile_img, bio}, account_info: {total_posts, total_reads}, social_links, joinedAt} = profile;
    let [profileLoaded, setProfileLoaded] = useState("")

    let { userAuth: {username}} = useContext(UserContext);
 
    const fetchUserProfile = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", {username: profileId})
        .then(({data:user}) => {
            setProfile(user);
            setProfileLoaded(profileId);
            getBlogs({user_id: user._id});
            setLoading(false);
        }).catch(err => {
            console.log(err);
            setLoading(false);

        })
    }

    const getBlogs = ({page = 1, user_id}) => {

        user_id = user_id == undefined ? blogs.user_id : user_id;

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {page, author: user_id})
        .then(async ({data}) => {
            let formatData = await filterPaginationData({
                state: blogs,
                data: data.blogs,
                page,
                countRoute : "/search-blogs-count",
                data_to_send: {author: user_id}
            })
            
            formatData.user_id = user_id;
            setBlogs(formatData);
        })



    }

    

    useEffect(() => {

        if(profileId != profileLoaded){
            setBlogs(null);
        }
        if(blogs == null){
            resetState();
            fetchUserProfile();
        }
        
    },[profileId,blogs])

    const resetState = () => {
        setLoading(true);
        
        setProfile(profileDataStructure);
        setProfileLoaded("");
        
    }


    return(
        <AnimationWrapper>
            {
                loading ?  <Loader></Loader>: 
                <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
                    <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pl-8 md:border-l border-grey md:sticky md:top-[100px] md:py-10 ">
                        <img src={profile_img} className="w-48 h-48 rounded-full bg-grey md:w-32 md:h-32" />
                        <h1 className="text-2xl font-medium">@{profile_username}</h1>
                        <p className="text-xl capitalize h-6">{fullname}</p>

                        <p>{total_posts.toLocaleString()} Blogs - {total_reads.toLocaleString()} reads</p>

                        <div className="flex gap-4 mt-2">
                            {
                                profileId == username ? <Link to = "/settings/edit-profile" className="btn-light rounded-md">Edit Profile</Link> :
                                ""
                            }
                            

                        </div>
                        {/* className="max-md:hidden" */}

                        <AboutUser className="max-md:hidden" bio = {bio} social_links={social_links} joinedAt={joinedAt} ></AboutUser>

                    </div>

                    <div className="max-md:mt-12 w-full">
                        <InPageNavigation defaultHidden = {["About"]}routes = {["Blogs Published", "About" ]}>  

                            {/* Rendering Blogs via BlogPostCard component */}
                            <>
                            {
                                blogs == null ? <Loader/> :
                                blogs.results.length ? 
                                    blogs.results.map((blog, index) => {
                                        return (
                                        <AnimationWrapper key = {index} transition={{duration:1,delay: index*.1}}>
                                            <BlogPostCard BlogContent = {blog} author = {blog.author.personal_info}></BlogPostCard>
                                        </AnimationWrapper>
                                        )
                                    }) : <NoDataMessage message={`No Blogs Published by ${blogs.username}`}></NoDataMessage>

                            }
                                <LoadMoreDataBtn state ={blogs} fetchDataFun={getBlogs}></LoadMoreDataBtn>
                            
                            </>
                            {/* Rendering Trending Blogs via MinimalBlogPost component */}
                            <AboutUser bio = {bio} social_links={social_links} joinedAt={joinedAt} ></AboutUser>

                    </InPageNavigation>

                    </div>

                </section>
            }
            

        </AnimationWrapper>
        
    )

}

export default ProfilePage;