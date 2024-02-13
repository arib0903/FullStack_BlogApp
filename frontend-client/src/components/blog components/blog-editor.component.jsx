import {Link, useNavigate} from 'react-router-dom';
import logo from '../../imgs/quill-drawing-a-line.png';
import AnimationWrapper from '../../common/page-animation';
import defaultBanner from '../../imgs/blog banner.png';
import { uploadImage } from '../../common/aws';
import { useEffect, useRef } from 'react';
import {Toaster, toast} from "react-hot-toast";
import { useContext } from 'react';
import { EditorContext } from '../../pages/editor.pages';
import EditorJS from '@editorjs/editorjs';
import {tools} from '../tools.component';
import axios from 'axios';
import { UserContext } from '../../App';

const BlogEditor = () => {  

    let blogBanner = useRef();



    //import the blogStrucutre from the editor.js       and     the states
    let {blog, blog: {title, banner, content, tags,des},setBlog, textEditor, setTextEditor,setEditorState} = useContext(EditorContext)
    console.log(blog)

    let {userAuth: {access_token} } = useContext(UserContext);
    let navigate = useNavigate();

    // :
    useEffect(() => {
       
            setTextEditor(new EditorJS({
            holder: 'textEditor',
            data: content,
            tools: tools,
            placeholder: "Write your blog here...",
        }))
        

    },[])

    /** Creating Function for updating data for title */
     const handleTitleKeyDown = (e) => {
            // console.log(e)
            // prevent user pressig the enter key:
            if(e.keyCode == 13){
                e.preventDefault();
            }
    }

    const handleTitleChange = (e) => {
        let input= e.target;

        input.style.height = "auto";
        input.style.height = input.scrollHeight + "px";
        //give me the entire blog object and change the title property to the value of the input
        setBlog({...blog, title: input.value})
    }


        //To deal with the error with blank image
    const handleError = (e) => {
            let img = e.target;
            img.src = defaultBanner;
    }


    /** Creating Function For Uploading Banner to AWS */
    const handleBannerUpload = (e) => {
        // console.log(e)
        let img = e.target.files[0];
        console.log(img);
        if(img){
            let loadingToast = toast.loading("Uploading image...")
            //calling function to upload image to aws in aws.jsx
            uploadImage(img).then((url) => {
                if(url){

                    toast.dismiss(loadingToast);
                    toast.success("Uploaded!")

                    //here we get the ID of the image element and change the src to the uploaded image 
                    setBlog({...blog, banner: url})
                }
            }).catch((err) => {
                toast.dismiss(loadingToast);
                return toast.error(err)

            })

        }
    } 

    /** Creating Function For Publishing Blog */
    const handlePublishEvent = () => {  
        if(!banner.length){
            return toast.error("Please upload a banner")

        }
        if(!title.length){
            return toast.error("Please add a title to publish")

        }

        // Saving blog content to the blog object using setBlog 
        if(textEditor.isReady){
            textEditor.save().then((data) => {
                if(data.blocks.length){
                    //Updating the state with the blocks
                    console.log(data)
                    setBlog({...blog, content: data})
                    setEditorState("publish")
                 }
                 else{
                    return toast.error("Please add some content to publish")
             }
            })
            .catch((err) => {
                console.log(err)

            })
        }

    }


    /** Creating Function For Saving Draft **/
    const handleSaveDraft = (e) => {
        if(e.target.className.includes('disable')){
            return;
        }

        if(!title.length){
            return toast.error("Write blog title saving draft");

        }

        let loadingToast = toast.loading("Saving Draft...");

        e.target.classList.add('disable');

        if(textEditor.isReady){
            textEditor.save().then((content) => {
            let blogObject = {
            title,
            des,
            tags,
            banner,
            content,
            draft: true
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", blogObject,{
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(()=>{
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast);
            toast.success("Blog Saved!");

            setTimeout(() => {
                //just for now redirectng to home page, 
                navigate("/")
            }, 500);
        }).catch(({response}) => {
            //from axios, when u have an error, you have to destructur the response error because a lot of other things comes with it
            e.target.classList.remove('disable');
             toast.dismiss(loadingToast);
            return toast.error(response.data.error);


        })

            })
        }

        

    }

    return (

        <>
        {/* Creating navbar */}
            <nav className="navbar">
                <Link to = "/" className='flex-none w-15 '>
                    <img src={logo} className='flex-none h-10 object-contain' />
                     <p className='font-script text-lg '>Writer's Avenue</p>
                </Link>

                <p className='max-md:hidden text-black line-clamp-1 w-full'>
                    {title.length ? title : "New Blog"}
                </p>

                <div className='flex gap-4 ml-auto'>
                    <button className='btn-dark py-2' onClick={handlePublishEvent}>
                        Publish
                    </button>
                    <button className='btn-light py-2' onClick={handleSaveDraft}>
                        Save draft
                    </button>

                    
                </div>
            </nav>

        {/* Creating blog editor */}
        <Toaster/>
        <AnimationWrapper>
            <section>
                {/* editor + title + banner in this div */}
                <div className='mx-auto mx-w-[700px] w-full '>
                    <div className='relative aspect-video bg-white border-4 border-grey hover:opacity-80 '>
                        <label htmlFor='uploadBanner'>
                            <input id="uploadBanner" type='file' accept='.png, .jpg, .jpeg' hidden onChange ={handleBannerUpload}/>
                            <img id  = "blogImage" src={banner} className='z-20' onError = {handleError}/>

                        </label>


                    </div>

                    <textarea placeholder='Blog Title' className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40'
                    onKeyDown={handleTitleKeyDown}
                    onChange = {handleTitleChange}
                    defaultValue={title}
                    
                    >
                    </textarea>
                    <hr className='w-full opacity-10 my-5'/>

                    <div id = 'textEditor' className='font-gelasio'></div>

                </div>
            </section>
            
            
        </AnimationWrapper>    


        </>
        
        

    );

}
export default BlogEditor;