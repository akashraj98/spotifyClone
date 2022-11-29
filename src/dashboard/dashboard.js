import { fetchRequest} from "../api";
import { ENDPOINT, logout, SECTIONTYPE} from "../common";

const audio = new Audio();
let displayName;
const onProfileClick = (event) =>{
    event.stopPropagation();
    const profileMenu = document.querySelector("#profile-menu");
    profileMenu.classList.toggle("hidden");
    if (!profileMenu.classList.contains("hidden")){
        profileMenu.querySelector("li#logout").addEventListener("click",logout);
    }
}

const loadUserProfile =async () =>{
    return new Promise(async (resolve,reject)=>{
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
        resolve({displayName});
    })
    
}

const onPlaylistItemClicked = (event,id)=>{
    const section = {type: SECTIONTYPE.PLAYLIST, playlist:id};
    history.pushState(section,"",`playlist/${id}`);
    loadSections(section)
}
const loadPlaylist = async(endpoint,elementId) =>{
    const {playlists:{items}} = await fetchRequest(endpoint);
    const playListItemsSection = document.querySelector(`#${elementId}`)

    for (let {name,description,images,id} of items){
        const playlistItem = document.createElement("section");
        playlistItem.className = "bg-black-secondary rounded p-4 hover:cursor-pointer hover:bg-light-black";
        playlistItem.id = id;
        playlistItem.setAttribute("data-type","playlist");
        playlistItem.addEventListener("click",(event)=>onPlaylistItemClicked(event,id));
        const [{url:imageUrl}] = images
        playlistItem.innerHTML = ` <img src="${imageUrl}" alt="${name}" class="rounded object-contain shadow mb-2"/>
            <h2 class="text-base font-semibold mb-4 truncate">${name}</h2>
            <h3 class="text-sm text-secondary line-clamp-2">${description}</h3>`

        playListItemsSection.appendChild(playlistItem);
    }
}

const loadPlaylists = ()=>{
    loadPlaylist(ENDPOINT.featuredPlaylist,"featured-playlist-items");
    loadPlaylist(ENDPOINT.topLists,"top-playlist-items");
    loadPlaylist(ENDPOINT.punjabi,"punjabi-items");
    loadPlaylist(ENDPOINT.bollywood,"bollywood-items");
    loadPlaylist(ENDPOINT.pop,"pop-items");
    loadPlaylist(ENDPOINT.devotion,"devotion-items");
    

}

const fillContentForDashboard = () =>{
    let pageContent = document.querySelector("#page-content");
    const coverContent = document.querySelector("#cover-content");
    coverContent.innerHTML = `<h1 class="text-6xl">Hello ${displayName}</h1>`
    const playlistMap = new Map([
        ["featured","featured-playlist-items"],
        ["top playlist","top-playlist-items"],
        ["punjabi","punjabi-items"],
        ["devotion","devotion-items"],
        ["pop","pop-items"],
        ["bollywood","bollywood-items"]]);
    let innerHTML = "";
    for (let [type,id] of playlistMap){
        innerHTML +=`<article class="p-4">
        <h1 class="text-2xl mb-2 font-bold capitalize">${type}</h1>
        <section id="${id}" class="featured-songs grid grid-cols-auto-fill-cards gap-4" >
        </section>
        </article>`
    }
    pageContent.innerHTML = innerHTML;
}

const formatTime = (duration) =>{
    const min = Math.floor(duration/60_000);
    const sec = ((duration %6_000)/1000).toFixed(0);
    const formattedTime = sec == 60?
    min+1 +":00": min +":" + (sec< 10? "0": "") + sec ;
    return formattedTime
}

const onTrackSelection = (id,event) => {
    document.querySelectorAll("#tracks .track").forEach(trackItem => {
        if(trackItem.id === id){
            trackItem.classList.add("bg-gray","selected");    
        } else {
            trackItem.classList.remove("bg-gray","selected");
        }
    })
    }


const updateIconsForPlayMode = (id) =>{
    const playButton = document.querySelector("#play");
    playButton.querySelector("span").textContent = "pause_circle";
    const playButtonFromTracks = document.querySelector(`#play-track-${id}`);
    if (playButtonFromTracks){
        playButtonFromTracks.textContent = "pause"
    }
    playButtonFromTracks.textContent = "pause";
}

const updateIconsForPauseMode = (id)=>{
    const playButton = document.querySelector("#play");
    playButton.querySelector("span").textContent = "play_circle";
    const playButtonFromTracks = document.querySelector(`#play-track-${id}`);
    if (playButtonFromTracks){
        playButtonFromTracks.textContent = "play_arrow"
    }
}

const onAudioMetaDataLoaded = (id) =>{
    const totalSongDuration  = document.querySelector("#total-song-duration");
    totalSongDuration.textContent = `0:${audio.duration.toFixed(0)}`;
}

const togglePlay = () =>{
    if(audio.src){
        if(audio.paused){
            audio.play()
        } else{
            audio.pause()
        }
    }
}



const playTrack = (event,{image,artistNames,name,duration,previewUrl,id})=>{
    if (event?.stopPropagation){
        event.stopPropagation();
    }
    if (audio.src === previewUrl){
        togglePlay();
    } else{
        const songTitle = document.querySelector("#now-playing-song");
        songTitle.textContent = name
        const nowPlayingImage = document.querySelector("#now-playing-image");
        nowPlayingImage.src = image.url;
        const artists = document.querySelector("#now-playing-artists");
        const audioControl = document.querySelector("#audio-control");
        const songInfo = document.querySelector("#song-info")
        audioControl.setAttribute("data-track-id",id);
        artists.textContent = artistNames;
        audio.src = previewUrl;
        audio.play();
        songInfo.classList.remove("invisible");
    }
}

const loadPlaylistTracks = ({tracks}) =>{
    const trackSection = document.querySelector("#tracks");
    let trackNo = 1;
    const loadedTracks = [];
    for (let trackItems of tracks.items){
        let {id,artists,name,album,duration_ms:duration, preview_url:previewUrl} = trackItems.track;
        let track = document.createElement("section");
        track.id = id;
        track.className = " track p-1 grid grid-cols-[50px_1fr_1fr_50px] items-center gap-4 justify-items-start rounded-md text-secondary hover:bg-light-black";
        let image = album.images.find(img => img.height === 64);
        let artistNames = Array.from(artists,artists=> artists.name).join(", ");
        track.innerHTML = `
        <p class="relative w-full flex items-center justify-center justify-self-center"><span class="track-no">${trackNo++}</span></p>
        <section class="grid grid-cols-[auto_1fr] place-items-center gap-2" >
        <img class="h-10 w-10" src="${image.url}" alt="${name}"/>
        <article class="flex flex-col gap-2 justify-center">
            <h2 class="song-title text-primary text-base line-clamp-1">${name}</h2>
            <p class="text-xs line-clamp-1">${artistNames}</p>
        </article>
        </section>
        <p class = "text-sm">${album.name}</p>
        <p class = "text-sm">${formatTime(duration)}</p>
        `;

        track.addEventListener("click",(event)=> onTrackSelection(id,event));
        const playButton = document.createElement("button");
        playButton.id = `play-track-${id}`;
        playButton.className = `play w-full absolute left-0 text-lg invisible material-symbols-outlined`;
        playButton.textContent = "play_arrow";
        playButton.addEventListener("click",(event) => playTrack(event,{image,artistNames,name,duration,previewUrl,id}))
        track.querySelector("p").appendChild(playButton);
        trackSection.appendChild(track);

        loadedTracks.push({id,artists,name,album,duration,previewUrl,artistNames,image})
    }
    setItemInLocalStorage("LOADED_TRACKS", loadedTracks);

}

const fillContentForPlaylist = async(playlistId)=>{
    const playList = await fetchRequest(`${ENDPOINT.playList}/${playlistId}`)
    const {name,description,images, tracks} = playList;
    const coverElement = document.querySelector("#cover-content");
    coverElement.innerHTML= `
        <img class="object-contain h-48 w-48" src="${images[0].url}" alt="">
        <section id="playlist-info">
            <h2 id="playlist-name" class="text-4xl">${name}</h2>
            <p id="playlist-artists">artists</p>
            <p id="playlist-details">${tracks.items.length} songs</p>
        </section>`
    let pageContent = document.querySelector("#page-content");
    pageContent.innerHTML = `
    <header id="playlist-header" class="mx-8 py-4 border-secondary border-b-[0.5px] z-10">
        <nav class="py-2">
        <ul class="grid grid-cols-[50px_2fr_1fr_50px] gap-4 text-secondary ">
            <li class="justify-self-center">#</li>
            <li>Titles</li>
            <li>Album</li>
            <li>Time</li>
        </ul>
        </nav>
    </header>
    <section class="px-8 mt-4" id="tracks">
    </section>`
    loadPlaylistTracks(playList);
    
}

const onContentScroll =(event)=>{
    const{scrollTop} = event.target;
    const header = document.querySelector(".header");
    const coverElement = document.querySelector("#cover-content");
    const totalHeight = coverElement.offsetHeight;
    const fiftyPercentHeight = totalHeight/2;
    const coverOpacity = 100 - (scrollTop >= totalHeight? 100:((scrollTop/totalHeight)*100));

    let headerOpacity = 0 //scrollTop >= header.offsetHeight? 100 : ((scrollTop/header.offsetHeight)*100);
    coverElement.style.opacity = `${coverOpacity}%`
    // header.style.background = `rgba(0 0 0/${headerOpacity}%)`;

    if (scrollTop >= fiftyPercentHeight && scrollTop <= totalHeight) {
        let totalDistance = totalHeight - fiftyPercentHeight;
        let coveredDistance = scrollTop - fiftyPercentHeight;
        headerOpacity = (coveredDistance / totalDistance) * 100;
    } else if (scrollTop > totalHeight) {
        headerOpacity = 100;
    } else if (scrollTop < fiftyPercentHeight) {
        headerOpacity = 0;
    }

    header.style.background = `rgba(0 0 0 / ${headerOpacity}%)`
    if(history.state.type === SECTIONTYPE.PLAYLIST){
        // let coverContent = document.querySelector("#cover-content");
        const playListHeader = document.querySelector("#playlist-header");
        if (headerOpacity >= 60){
            playListHeader.classList.add("sticky","bg-black-secondary","px-8");
            playListHeader.classList.remove("mx-8")
            playListHeader.style.top = `${header.offsetHeight}px`;

        } else{
            playListHeader.classList.remove("sticky","bg-black-secondary","px-8");
            playListHeader.classList.add("mx-8")
            playListHeader.style.top = `revert`;
        }
    }

}

const getItemFromLocalStorage = (key) =>{
    return JSON.parse(localStorage.getItem(key));
}

const setItemInLocalStorage = (key,value) => {
    return localStorage.setItem(key, JSON.stringify(value));
}

const findCurrentTrack = () => {
    const audioControl = document.querySelector("#audio-control");
    const trackId = audioControl.getAttribute("data-track-id");
    if (trackId){
        const loadedTracks = getItemFromLocalStorage("LOADED_TRACKS");
        const currentTrackIndex = loadedTracks?.findIndex(track => track.id === trackId);
        return { currentTrackIndex,tracks: loadedTracks};
    }
    return null;
}

const playPrevTrack = () =>{
    const { currentTrackIndex = -1, tracks = null}  = findCurrentTrack() ?? {};
    if (currentTrackIndex>0){
        const prevTrack = tracks[currentTrackIndex -1];
        playTrack(null,prevTrack);
    }
}

const playNextTrack = () => {
    const { currentTrackIndex = -1, tracks = null}  = findCurrentTrack() ?? {};
    if  (currentTrackIndex >-1 && currentTrackIndex < tracks?.length-1){
        const currentTrack = tracks[currentTrackIndex +1];
        playTrack(null,currentTrack)
    }
}
const loadSections = (section) =>{
    if (section.type=== SECTIONTYPE.DASHBOARD){
        fillContentForDashboard();
        loadPlaylists();
    } else if (section.type=== SECTIONTYPE.PLAYLIST){
        fillContentForPlaylist(section.playlist)
    }
    document.querySelector(".content").removeEventListener("scroll",onContentScroll);

    document.querySelector(".content").addEventListener("scroll",onContentScroll);
}

const onUserPlaylistClicked = (id)=>{
    const section = {type:SECTIONTYPE.PLAYLIST,playlist:id};
    history.pushState(section,"",`dashboard/playlist/${id}`);
    loadSections(section);
}

const loadUserPlaylist = async() =>{
    const playlists = await fetchRequest(ENDPOINT.userPlaylist)
    const userPlaylistSection = document.querySelector("#user-playlist > ul");
    userPlaylistSection.innerHTML = "";
    for (let {name,id} of playlists.items){
        const li = document.createElement("li");
        li.textContent = name;
        li.className = "cursor-pointer hover:text-primary";
        li.addEventListener("click",()=>onUserPlaylistClicked(id))
        userPlaylistSection.appendChild(li);
    }
}

document.addEventListener("DOMContentLoaded",async ()=>{
    ({displayName} = await loadUserProfile());
    
    const volume = document.querySelector("#volume");
    const playButton = document.querySelector("#play");
    const songDurationCompleted = document.querySelector("#song-duration-completed");
    const songProgress = document.querySelector("#progress")
    const timeline = document.querySelector("#timeline")
    const audioControl = document.querySelector("#audio-control")
    const nextTrack = document.querySelector("#next");
    const prevTrack = document.querySelector("#prev")
    let progressInterval;
    loadUserPlaylist();

    const section = {type: SECTIONTYPE.DASHBOARD};
    // playlist/37i9dQZF1DX5cZuAHLNjGz
    // const section = { type:SECTIONTYPE.PLAYLIST, playlist:"37i9dQZF1DX5cZuAHLNjGz"}
    history.pushState(section,"","");
    // history.pushState(section,"",`/dashboard/playlist/${section.playlist}`)
    loadSections(section)
    document.addEventListener("click",()=>{
        const profileMenu = document.querySelector("#profile-menu");
        if(!profileMenu.classList.contains("hidden")){
            profileMenu.classList.add("hidden");
        }
    })

    audio.addEventListener("play",()=>{

        const selectedTrackId = audioControl.getAttribute("data-track-id")
        const tracks = document.querySelector("#tracks");
        
        const playingTrack = tracks?.querySelector("section.playing")
        const selectedTrack = tracks?.querySelector(`[id="${selectedTrackId}"]`);
        if (playingTrack?.id !== selectedTrack?.id){
            playingTrack?.classList.remove("playing");
        }
        selectedTrack?.classList.add("playing");
        progressInterval = setInterval(()=>{
            if(audio.paused){
                return
            }
            songDurationCompleted.textContent = `${audio.currentTime.toFixed(0) < 10? "0:0"+ audio.currentTime.toFixed(0) : "0:" + audio.currentTime.toFixed(0)}`;
            songProgress.style.width = `${(audio.currentTime / audio.duration) *100}%`;
        },100);
        updateIconsForPlayMode(selectedTrackId);
    })
    
    audio.addEventListener("pause",()=>{
        if (progressInterval){
            clearInterval(progressInterval);
        }
        const selectedTrackId = audioControl.getAttribute("data-track-id");
        updateIconsForPauseMode(selectedTrackId);
    })
    audio.addEventListener("loadedmetadata",onAudioMetaDataLoaded);
    playButton.addEventListener("click",togglePlay);
    volume.addEventListener("change",()=>{
        audio.volume = volume.value / 100
    })

    timeline.addEventListener("click",(e)=>{
        const timelineWidth = window.getComputedStyle(timeline).width;
        const timeToSeek = (e.offsetX/ parseInt(timelineWidth)) * audio.duration;
        audio.currentTime  = timeToSeek;
        songProgress.style.width = `${(audio.currentTime/ audio.duration) * 100}%`;
    },false)

    prevTrack.addEventListener("click",playPrevTrack);
    nextTrack.addEventListener("click",playNextTrack);
    window.addEventListener("popstate",(event)=>{
        loadSections(event.state)
    })
})