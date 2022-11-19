
import { fetchRequest} from "../api";
import { ENDPOINT, logout} from "../common";

const onProfileClick = (event) =>{
    const profileMenu = document.querySelector("#profile-menu");
    profileMenu.classList.toggle("hidden");
    if (!profileMenu.classList.contains("hidden")){
        profileMenu.querySelector("li#logout").addEventListener("click",logout);
    }
}

const loadUserProfile =async () =>{
    const defaultImage = document.querySelector("#default-image");
    const profileButton = document.querySelector("#user-profile-btn");
    const displayNameElement = document.querySelector("#display-name");

    const {display_name:displayName, images } = await fetchRequest(ENDPOINT.userInfo);

    if (images?.length){
        defaultImage.classList.add("hidden");
    } else{
        defaultImage.classList.remove("hidden");
    }
    profileButton.addEventListener("click",onProfileClick)
    displayNameElement.textContent = displayName;

}

document.addEventListener("DOMContentLoaded",()=>{
    loadUserProfile();
})