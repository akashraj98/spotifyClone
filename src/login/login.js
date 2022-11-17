//need to secure this in a file
//need to secure this and weather api urgent!

import { ACCESS_TOKEN, EXPIRES_IN, TOKEN_TYPE } from "../common";

const CLIENT_ID = import.meta.VITE_CLIENT_ID;
const scopers = "user-top-read user-follow-read playlist-read-private user-library-read";
const REDIRECT_URI = "http://localhost:3000/login/login.html";
var state = (Math.random()+1).toString(36).substring(1); //generate random number
const HOST = "http://localhost:3000"

const authorizeUser = () =>{
    var url = 'https://accounts.spotify.com/authorize';
    url += '?response_type=token';
    url += '&client_id='+CLIENT_ID;
    url += '&scope='+scopers;
    url += '&redirect_uri='+REDIRECT_URI;
    url += '&state='+ state;
    url += '&show_dialog=true'; //to not login again
    window.open(url,"login","width=800,height=600");
}
document.addEventListener("DOMContentLoaded",() =>{
    const loginButton = document.getElementById("login-to-spotify");
    loginButton.addEventListener("click",authorizeUser)
})

window.setItemsInLocalStorage = ({accessToken,tokenType,expiresIn})=>{
    localStorage.setItem(ACCESS_TOKEN,accessToken);
    localStorage.setItem(TOKEN_TYPE,tokenType);
    localStorage.setItem(EXPIRES_IN,expiresIn);
    window.location.href = HOST;
}
window.addEventListener("load",()=>{
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken){
        window.location.href = HOST+'/dashboard/dashboard.html';
    }
    if(window.opener!==null && !window.opener.closed){
        window.focus();
        if(window.location.href.includes("error")){
            window.close();
        }
        // okay
        const {hash} = window.location;
        const searchParams = new URLSearchParams(hash);
        const accessToken = searchParams.get("#access_token");
        const tokenType = searchParams.get("token_type");
        const expiresIn = searchParams.get("expires_in");
        

        if (accessToken){
            window.close();
            window.opener.setItemsInLocalStorage({accessToken,tokenType,expiresIn});
        } else{
            window.close();
        }


    }
    
})