(()=>{if("serviceWorker" in navigator){navigator.serviceWorker.register("/service-worker.js").catch((error)=>{console.error("Service Worker registration failed:",error)})}
if("IntersectionObserver" in window){const priorityObserver=new IntersectionObserver((entries)=>{entries.forEach((entry)=>{if(entry.isIntersecting){const target=entry.target
if(target.classList.contains("hero-content")){target.style.textShadow="0 2px 4px rgba(0, 0, 0, 0.7)"}
priorityObserver.unobserve(target)}})},{threshold:0.1,rootMargin:"0px",},)
document.querySelectorAll(".hero-content").forEach((el)=>{priorityObserver.observe(el)})}
function preloadCriticalResources(){if(navigator.connection&&(navigator.connection.saveData||(navigator.connection.effectiveType&&navigator.connection.effectiveType.includes("2g")))){return}
const preloads=[{href:"images/feature1.webp",as:"image",type:"image/webp"}]
preloads.forEach((resource)=>{const link=document.createElement("link")
link.rel="preload"
link.href=resource.href
link.as=resource.as
if(resource.type)link.type=resource.type
document.head.appendChild(link)})}
if(document.readyState==="interactive"||document.readyState==="complete"){preloadCriticalResources()}else{window.addEventListener("DOMContentLoaded",preloadCriticalResources,{once:!0})}})()