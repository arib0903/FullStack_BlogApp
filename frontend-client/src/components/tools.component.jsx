//importing tools

import Emdeb from "@editorjs/embed"
import List from "@editorjs/list"
import Image from "@editorjs/image"
import Header from "@editorjs/header"
import Quote from "@editorjs/quote"
import Marker from "@editorjs/marker"
import InlineCode from "@editorjs/inline-code"
import { uploadImage } from "../common/aws"


//Promise gets URL of event, then resolves it or if error, then
//From documentation:

const uploadImageByFile = (e) => {
    return uploadImage(e).then(url => {
        if(url){
            return {
                success: 1,
                file: {
                    url
                }
            }
        }
    })

}
const uploadImageByURL =(e) => {
    let link = new Promise((resolve,reject) => {
        try{
            resolve(e)
        }
        catch(err){
            reject(err)
        }
    })
    return link.then((url) => {
        return {
            success: 1,
            file: {url}
        }

    })
}


export const tools = {
    embed: Emdeb,
    list: {
        class: List,
        inlineToolbar: true,
    
    },
    header: {
        class: Header,
        config: {
            placeholder: "Type your heading here...",
            levels: [2,3,4],
            defaultLevel: 2
        }

    },
    image: {
        class: Image,
        config:{
            //how should it uplaod the image by link
            uploader:{
                uploadByUrl: uploadImageByURL,
                //where/how it uuploadImageByUrlploads the image from computer
             uploadByFile: uploadImageByFile
            }
        }
    },
    quote: Quote,
    marker: Marker,
    inlineCode: InlineCode
}