export const ACCESS_TOKEN = "ACCESS_TOKEN";
export const TOKEN_TYPE ="TOKEN_TYPE";
export const EXPIRES_IN = "EXPIRES_IN";
const APP_URL = import.meta.env.VITE_HOST;

export const ENDPOINT = {
    userInfo: "me",
    featuredPlaylist: "browse/featured-playlists?limit=7",
    topLists:"browse/categories/toplists/playlists?limit=7",
    punjabi:"browse/categories/0JQ5DAqbMKFKSopHMaeIeI/playlists?limit=7",
    pop:"browse/categories/0JQ5DAqbMKFEC4WFtoNRpw/playlists?limit=7",
    devotion:"browse/categories/0JQ5DAqbMKFOTGtSOysEXE/playlists?limit=7",
    bollywood:"browse/categories/0JQ5DAqbMKFHCxg5H5PtqW/playlists?limit=7",
    playList:"playlists",
    userPlaylist: "me/playlists"
}

export const logout = ()=>{
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(EXPIRES_IN);
    localStorage.removeItem(TOKEN_TYPE);
    window.location.href = APP_URL;  // sets url of current page to APP_url
}

export const SECTIONTYPE = {
    DASHBOARD: "DASHBOARD",
    PLAYLIST:"PLAYLIST"
}