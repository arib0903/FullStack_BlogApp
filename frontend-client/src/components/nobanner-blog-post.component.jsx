
import {Link} from 'react-router-dom';
import { getDay } from '../common/date';
const MinimalBlogPost = ({blog, index}) => {

    let {title, blog_id: id, author: {personal_info:{fullname, username, profile_img}}, publishedAt} = blog 
    return(
   
        <Link to = {`/blog/${id}`} className="flex gap-5 mb-8 hover:bg-grey rounded-lg pl-2 pr-2 pt-2 pb-2">
            <h1 className='text-4xl sm:text-3xl lg:text-5xl font-bold text-purple-400 leading-none; '>{index<10 ? "0" + (index+1): index}</h1>

            <div>
                <div className="flex gap-2 items-center mb-7">
                    <img src={profile_img} className="w-6 h-6 rounded-full" />
                    <p className="line-clamp-1">{fullname} @{username}</p>
                    <p className="min-w-fit" >{getDay(publishedAt)}</p>
            </div>

            <h1 className="blog-title">{title}</h1>

            </div>
        </Link>

    )

}

export default MinimalBlogPost;