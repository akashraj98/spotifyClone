import './style.css'

const APP_URL = import.meta.env.VITE_HOST;

document.addEventListener("DOMContentLoaded",() => {
  if(localStorage.getItem("accessToken")){
    window.location.href = `${APP_URL}/dashboard/dashboard.html`
  } else{
    window.location.href = `${APP_URL}/login/login.html`
  }
})

