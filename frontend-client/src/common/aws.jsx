import axios from "axios";

export const uploadImage = async (img) => {
    //return the image URL:
    let imgUrl = null;

    //make request to the server
    
    await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url" )
    .then( async ({data: {uploadUrl}}) => {
        await axios({
            method: "PUT",
            url: uploadUrl,
            headers: {
                "Content-Type": "multipart/form-data"
            },
            data: img
        }).then(() => {
            imgUrl = uploadUrl.split("?")[0];
            console.log(imgUrl);
        })

    })

    return imgUrl;

}

