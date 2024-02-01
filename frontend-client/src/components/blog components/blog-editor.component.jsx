import {Link} from 'react-router-dom';
import logo from '../../imgs/logo.png';
import AnimationWrapper from '../../common/page-animation';
import defaultBanner from '../../imgs/blog banner.png';
import { uploadImage } from '../../common/aws';
import { useEffect, useRef } from 'react';
import {Toaster, toast} from "react-hot-toast";
import { useContext } from 'react';
import { EditorContext } from '../../pages/editor.pages';
import EditorJS from '@editorjs/editorjs';
import {tools} from '../tools.component';

const BlogEditor = () => {  

    let blogBanner = useRef();



    //import
    let {blog, blog: {title, banner, content, tags,des},setBlog, textEditor, setTextEditor,setEditorState} = useContext(EditorContext)


    //useEffect:
    useEffect(() => {
        setTextEditor(new EditorJS({
            holder: 'textEditor',
            data: content,
            tools: tools,
            placeholder: "Write your blog here...",
        }))


    },[])
     const handleTitleKeyDown = (e) => {
            // console.log(e)
            // prevent user pressig the enter key:
            if(e.keyCode == 13){
                e.preventDefault();
            }
        }




        //To deal with the error with blank image
        const handleError = (e) => {
            let img = e.target;
            img.src = defaultBanner;
        }
    const handlePublishEvent = () => {  
        if(!banner.length){
            return toast.error("Please upload a banner")

        }
        if(!title.length){
            return toast.error("Please add a title to publish")

        }
        if(textEditor.isReady  ){
            textEditor.save().then((data) => {
                if(data.blocks.length){
                    //Updating the state with the blocks
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
    const handleTitleChange = (e) => {
        let input= e.target;

        input.style.height = "auto";
        input.style.height = input.scrollHeight + "px";
        //give me the entire blog object and change the title property to the value of the input
        setBlog({...blog, title: input.value})
    }


    const handleBannerUpload = (e) => {
        // console.log(e)
        let img = e.target.files[0];
        console.log(img);
        if(img){
            let loadingToast = toast.loading("Uploading image...")
            //calling function to upload image to aws 
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

    return (

        <>
        {/* Creating navbar */}
            <nav className="navbar">
                <Link to = "/">
                    <img src={logo} className='flex-none w-10' />
                </Link>

                <p className='max-md:hidden text-black line-clamp-1 w-full'>
                    {title.length ? title : "New Blog"}
                </p>

                <div className='flex gap-4 ml-auto'>
                    <button className='btn-dark py-2' onClick={handlePublishEvent}>
                        Publish
                    </button>
                    <button className='btn-light py-2'>
                        Save draft
                    </button>

                    
                </div>
            </nav>

        {/* Creating blog editor */}
        <Toaster/>
        <AnimationWrapper>
            <section>
                {/* editor + title + banner in this div */}
                <div className='mx-auto mx-w-[900px] w-full '>
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