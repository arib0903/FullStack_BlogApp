import { useContext,useEffect,useState } from 'react';
import { UserContext } from '../App';
import { Navigate, useParams } from 'react-router-dom';
import BlogEditor from '../components/blog components/blog-editor.component';
import PublishForm from '../components/publish-form.component';
import { createContext } from 'react';
import Loader from '../components/loader.component';
import axios from 'axios';

//create global state ...
const blogStructure = {
    title: '',
    banner: '',
    content : [],
    tags: [],
    des: '',
    author: {personal_info: {}},
    

}

export const EditorContext = createContext({})

//components being used: publish-form.component & blog-editor.component
const Editor = () => {

    let {blog_id} = useParams();
    
    // 1. Creating the blogStructure so BlogEditor and PublishForm can use it
    const [blog, setBlog] = useState(blogStructure); //blog is the global state

    // 2. make a state to track which of the 2 components we want to render
    const [editorState, setEditorState] = useState("editor"); //default is publish-form
    const [textEditor, setTextEditor] = useState({isReady:false}); //updated by blog-editor.component with editor contents
    const [loading, setLoading] = useState(true); 

    // 3. get userAuth from App.js to check if user is logged in 
    let {userAuth: {access_token}} = useContext(UserContext);
    // alternative to the code above: UserContext.userAuth.access_token

    useEffect(() => {
        if(!blog_id){
            return setLoading(false);
        }

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", {blog_id, draft: true, mode:'edit'})
        .then(({data: {blog}}) => {
            setBlog(blog);
            setLoading(false);
        }).catch(err => {
            console.log(err);
        })

    },[])


    return (
        <EditorContext.Provider value = {{blog, setBlog, editorState, setEditorState,textEditor, setTextEditor}}>
            {
                !access_token  ? <Navigate to = "/signin"></Navigate>
                :
                 loading ? <Loader/> :
                 editorState == "editor" ? <BlogEditor/> : <PublishForm/>
            }
        </EditorContext.Provider>
        // check if user in session/logged in so they can access the editor
        

    )
}

export default Editor;