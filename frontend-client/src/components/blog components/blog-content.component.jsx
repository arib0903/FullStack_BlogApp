import { List } from "@editorjs/list";
import { Quote } from "@editorjs/quote";

const Img = ({url, caption}) => {
    return (
        <div className="blog-image">
            <img src={url}/>
            {caption.length ? <p className="w-full text-center my-3 md:mb-12 text-base text-dark-grey">{caption}</p> : " "}
        </div>
    )
}

const QuoteComp = ({quote, caption}) => {
    return (
        <div className="bg-purple/10 p-3 pl-5 border-l-4 border-purple">
            <p className="text-xl leading-10 md:text-2xl ">{quote}</p>
            {caption.length ? <p className="w-full text-purple text-base">{caption}</p> : " "}


        </div>
    )

}

const ListComp = ({items, style}) => {
    return(
        <ol className={`pl-5 ${style == "ordered" ? " list-decimal" : " list-disc"}`}>
            {items.map((item, index) => {
                return <li key = {index} className="my-4" dangerouslySetInnerHTML={{__html: item}}></li>
            })}
        </ol>
    )
}

const BlogContent = ({block}) => {
    let {type, data} = block;

    if(type === "paragraph"){
        return <p dangerouslySetInnerHTML={{__html: data.text}}></p>
    }
    if(type === "header"){
        if(data.level === 3){
        return <h3 dangerouslySetInnerHTML={{__html: data.text}}></h3>
    }
        return <h2 dangerouslySetInnerHTML={{__html: data.text}}></h2>
    }

    if(type === "image"){
        return <Img url={data.file.url} caption={data.caption} />
    }
    if(type === "quote"){
        return <QuoteComp quote={data.text} caption = {data.caption} />
    }

    if(type ==="list"){
        return (
            <ListComp items={data.items} style = {data.style} />
        )
    }

}

export default BlogContent;