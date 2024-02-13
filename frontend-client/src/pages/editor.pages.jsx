import { useContext,useState } from 'react';
import { UserContext } from '../App';
import { Navigate } from 'react-router-dom';
import BlogEditor from '../components/blog components/blog-editor.component';
import PublishForm from '../components/publish-form.component';
import { createContext } from 'react';

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
    
    // 1. Creating the blogStructure so BlogEditor and PublishForm can use it
    const [blog, setBlog] = useState(blogStructure); //blog is the global state

    // 2. make a state to track which of the 2 components we want to render
    const [editorState, setEditorState] = useState("editor"); //default is publish-form
    const [textEditor, setTextEditor] = useState({isReady:false}); //updated by blog-editor.component with editor contents

    // 3. get userAuth from App.js to check if user is logged in 
    let {userAuth: {access_token}} = useContext(UserContext);
    // alternative to the code above: UserContext.userAuth.access_token



    return (
        <EditorContext.Provider value = {{blog, setBlog, editorState, setEditorState,textEditor, setTextEditor}}>
            {
                !access_token  ? <Navigate to = "/signin"></Navigate>:
                 editorState == "editor" ? <BlogEditor/> : <PublishForm/>
            }
        </EditorContext.Provider>
        // check if user in session/logged in so they can access the editor
        

    )
}

export default Editor;