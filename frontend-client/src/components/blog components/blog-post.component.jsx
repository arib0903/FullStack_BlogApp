import { Link } from "react-router-dom";
import { getDay } from "../../common/date";


const BlogPostCard = ({BlogContent, author}) => {
    // console.log(BlogContent)

    let {publishedAt, tags, title, des, banner, activity:{total_likes}, blog_id:id} = BlogContent;
    let {fullname, profile_img, username } = author;
   

    /*** Creating Blog Card Layout ****/
    return (
        <Link to = {`/blog/${id}`}className="flex gap-8 items-center border-b border-grey pb-5 mb-4 hover:bg-grey rounded-lg pl-2 pr-2 pt-2">
        <div className="w-full ">
            <div className="flex gap-2 items-center mb-7 hover:bg-blue-700">
                <img src={profile_img} className="w-6 h-6 rounded-full" />
                <p className="line-clamp-1">{fullname} @{username}</p>
                <p className="min-w-fit" >{getDay(publishedAt)}</p>
            </div>

            <h1 className="blog-title">{title}</h1>
            <p className="my-3 text-xl font-gelasio leading-7 max-sm:hidden md:max-[1100px] line-clamp-2">{des}</p>

            <div className="flex gap-4 mt-7">
                {tags.length>1 ? 
                <div><span className="btn-light py-1 px-4">{tags[0]}</span> more tags...</div> : 
                <span className="btn-light py-1 px-4">{tags[0]}</span>
                }
                
                <span className="ml-3 flex items-center gap-2 text-dark">
                </span>
            </div>
        </div>

        <div className="h-28 aspect-square bg-grey ">
            <img src={banner} className="w-full h-full aspect-square" />


        </div>
        </Link>
        
    )

}

export default BlogPostCard;
