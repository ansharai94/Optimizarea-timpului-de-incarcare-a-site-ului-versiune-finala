function setTextContrast(){const heroContent=document.querySelector(".hero-content")
if(heroContent){heroContent.style.textShadow="0 2px 4px rgba(0, 0, 0, 0.7)"}}
setTextContrast()
if("serviceWorker" in navigator){navigator.serviceWorker.register("/service-worker.js").then((registration)=>{console.log("Service Worker registered with scope:",registration.scope)}).catch((error)=>{console.error("Service Worker registration failed:",error)})}