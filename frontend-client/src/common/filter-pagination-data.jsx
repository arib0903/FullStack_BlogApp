
//arr = prev data

import axios from "axios";

/****This File Is To Restructure The Data into a different data structure */
export const filterPaginationData = async ({create_new_array = false, state, data, page, countRoute, data_to_send = {}}) => {
    let obj;
    console.log(state);
    if(state != null && !create_new_array ){
        // console.log("running if block")
        obj = {...state, results: [...state.results, ...data], page: page}

    }
    else{ 
        // console.log("running else block")
       await axios.post(import.meta.env.VITE_SERVER_DOMAIN + countRoute, data_to_send)
       .then((totalDocs) => {
            console.log(totalDocs)
           obj = {results: data, page: 1, totalDocs: totalDocs.data.totalDocs}
       })
       .catch(err => {
           console.log(err);
       })
    }

    return obj;

}