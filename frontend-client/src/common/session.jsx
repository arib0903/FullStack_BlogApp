// this file is used for creating and storing a user session so it can be referenced throoughout the web


const storeInSession = (key, value) => {
    return sessionStorage.setItem(key, value);
}

const lookInSession = (key) => {
    return sessionStorage.getItem(key);
}

const removeFromSession = (key) => {
    return sessionStorage.removeItem(key);
}

const logOut = ()=>{
    sessionStorage.clear();
}

export {storeInSession, lookInSession, removeFromSession, logOut};  