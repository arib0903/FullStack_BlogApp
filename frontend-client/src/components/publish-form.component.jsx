import { Toaster } from "react-hot-toast";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { EditorContext } from "../pages/editor.pages";
import Tag from "./tags.component";


const PublishForm = () => {  

    let {blog, blog:{banner,title,tags,des},setEditorState,setBlog} = useContext(EditorContext);
    let characterLimit = 200;
    let tagLimit = 10;
    const handleBlogTitleChange = (e) => {  
        let input = e.target
        setBlog({...blog, title: input.value})


    }
    const handleCloseEvent = () => {
        setEditorState("editor");
    }

    const handleBlogDescriptionChange = (e) => {    
        let input = e.target
        setBlog({...blog, des: input.value})
    }

         const handleTitleKeyDown = (e) => {
            // console.log(e)
            // prevent user pressig the enter key:
            if(e.keyCode == 13){
                e.preventDefault();
            }
        }

    const handleKeyDownFunction = (e) => {
        //if enter key is pressed or comma
        if(e.keyCode == 13 || e.keyCode == 118){
            e.preventDefault();//prevent from submitting empty
            let tag = e.target.value;
            if(tags.length<tagLimit){
                if(!tags.includes(tag) && tag.length){
                    setBlog({...blog,tags:[...tags,tag]})
                }
                e.target.value = "";
            }
        }
    }
    return (
        <AnimationWrapper>
            <section className="w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4">
                <Toaster />

                <button className="w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]" 
                onClick={handleCloseEvent}>
                    <i className="fi fi-br-cross"></i>

                </button>
                <div className="max-w-[550px] center">
                    <p className="text-dark-grey mb-1">Preview</p>
                    <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
                        <img src={banner} alt="" />

                    </div>
                    <h1 className="text-4xl font-medium mt-2 leading-tight-line-clamp-2">{title}</h1>
                    <p className="text-xl leading-7 font-gelasio mt-4 line-clamp-3">{des}</p>
                </div>

                <div className=" border-grey lg:border-1">
                    <p className="text-dark-grey mb-2 mt-9">Blog Title</p>
                    <input type="text" placeholder="Blog Title" defaultValue={title} className="input-box pl-4" onChange = {handleBlogTitleChange}/>

                    <p className="text-dark-grey mb-2 mt-9">Short description about your blog</p>

                    <textarea maxLength = {characterLimit} defaultValue={des} className="h-40 resize-none leading-7 input-box pl-4"
                    onChange={handleBlogDescriptionChange} onKeyDown={handleTitleKeyDown}>

                    </textarea>

                    <p className="mt-1 text-dark-grey text-sm text-right">
                        {characterLimit-des.length} characters left
                        </p>
                    <p className="text-dark-grey mb-2 mt-9">topics - (Helps is searching and ranking your blog post)</p>

                    <div className="relative input-box pl-2 py-2 pb-4">
                        <input type="text" placeholder="Limit: 10 Topics" className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white" 
                        onKeyDown={handleKeyDownFunction}/>

                        {tags.map((tag, index) => {
                            return <Tag tag = {tag} key = {index}></Tag>
                        })} 
                        
                    </div>

                    <br />
                    <button className="btn-dark px-8">Publish</button>
                    
                    
                </div>
            </section>
        </AnimationWrapper>
    );
    

}
export default PublishForm;