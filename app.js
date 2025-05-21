(()=>{const installPrompt=document.getElementById("installPrompt")
const installButton=document.getElementById("installButton")
const offlineNotification=document.getElementById("offlineNotification")
let deferredPrompt
if(window.matchMedia("(display-mode: standalone)").matches&&installPrompt){installPrompt.style.display="none"}
window.addEventListener("beforeinstallprompt",(e)=>{e.preventDefault()
deferredPrompt=e
if(installPrompt){requestAnimationFrame(()=>{installPrompt.style.display="flex"})}})
if(installButton){installButton.addEventListener("click",async()=>{if(!deferredPrompt)return
deferredPrompt.prompt()
const{outcome}=await deferredPrompt.userChoice
deferredPrompt=null
requestAnimationFrame(()=>{installPrompt.style.display="none"})},{passive:!0},)}
window.addEventListener("appinstalled",()=>{if(installPrompt){requestAnimationFrame(()=>{installPrompt.style.display="none"})}
requestIdleCallback(()=>{const slides=document.querySelectorAll(".slide")
slides.forEach((slide)=>{const img=slide.querySelector("img")
const source=slide.querySelector("source")
if(img&&img.dataset.src&&!img.src){img.src=img.dataset.src}
if(source&&source.dataset.src&&!source.srcset){source.srcset=source.dataset.src}})})})
let isShowingOfflineNotification=!1
window.addEventListener("online",()=>{if(offlineNotification){requestAnimationFrame(()=>{offlineNotification.style.display="none"})
isShowingOfflineNotification=!1}
requestIdleCallback(()=>{if("serviceWorker" in navigator&&"SyncManager" in window){navigator.serviceWorker.ready.then((registration)=>{registration.sync.register("contact-form-sync")})}})})
window.addEventListener("offline",()=>{if(offlineNotification&&!isShowingOfflineNotification){requestAnimationFrame(()=>{offlineNotification.style.display="block"})
isShowingOfflineNotification=!0
setTimeout(()=>{if(offlineNotification){requestAnimationFrame(()=>{offlineNotification.style.display="none"})
isShowingOfflineNotification=!1}},5000)}})
if(!navigator.onLine&&offlineNotification){requestAnimationFrame(()=>{offlineNotification.style.display="block"})
isShowingOfflineNotification=!0}
const contactForm=document.getElementById("contactForm")
if(contactForm){contactForm.addEventListener("submit",async(e)=>{e.preventDefault()
const formData=new FormData(contactForm)
const formValues=Object.fromEntries(formData.entries())
formValues.timestamp=new Date().toISOString()
try{if(navigator.onLine){const response=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json",},body:JSON.stringify(formValues),})
if(response.ok){alert("Mesajul a fost trimis cu succes! Vă vom contacta în curând.")
contactForm.reset()}else{throw new Error("Failed to submit form")}}else{await storeFormData(formValues)
alert("Sunteți offline. Mesajul dvs. va fi trimis automat când reveniți online.")
contactForm.reset()
if("serviceWorker" in navigator&&"SyncManager" in window){const registration=await navigator.serviceWorker.ready
await registration.sync.register("contact-form-sync")}}}catch(error){console.error("Error submitting form:",error)
alert("A apărut o eroare. Vă rugăm să încercați din nou mai târziu.")}})}
async function storeFormData(formData){return new Promise((resolve,reject)=>{const request=indexedDB.open("epicMediaDB",1)
request.onupgradeneeded=(event)=>{const db=event.target.result
if(!db.objectStoreNames.contains("offlineForms")){db.createObjectStore("offlineForms",{keyPath:"id",autoIncrement:!0})}}
request.onsuccess=(event)=>{const db=event.target.result
const transaction=db.transaction(["offlineForms"],"readwrite")
const store=transaction.objectStore("offlineForms")
const addRequest=store.add(formData)
addRequest.onsuccess=()=>resolve()
addRequest.onerror=()=>reject(addRequest.error)}
request.onerror=()=>reject(request.error)})}
if("Notification" in window&&Notification.permission!=="granted"&&Notification.permission!=="denied"){document.addEventListener("click",function requestNotificationPermission(){Notification.requestPermission()
document.removeEventListener("click",requestNotificationPermission)},{once:!0,passive:!0},)}
document.addEventListener("visibilitychange",()=>{const sliderObj=window.slider
if(document.visibilityState==="hidden"){if(sliderObj&&typeof sliderObj.pauseAutoSlide==="function"){sliderObj.pauseAutoSlide()}
document.body.classList.add("page-hidden")}else{if(sliderObj&&typeof sliderObj.startAutoSlide==="function"){sliderObj.startAutoSlide()}
document.body.classList.remove("page-hidden")}},{passive:!0},)
if("requestIdleCallback" in window){requestIdleCallback(()=>{const isIOS=/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream
const isInStandaloneMode=window.matchMedia("(display-mode: standalone)").matches||window.navigator.standalone
if(isIOS&&!isInStandaloneMode&&localStorage.getItem("iosInstallTipClosed")!=="true"){const iosInstallTip=document.createElement("div")
iosInstallTip.className="ios-install-tip"
iosInstallTip.innerHTML=`
          <div class="tip-content">
            <p>Instalați această aplicație pe dispozitivul dvs. iOS: apăsați <strong>Partajare</strong> și apoi <strong>Adăugați la ecranul principal</strong>.</p>
            <button class="close-tip">Închide</button>
          </div>
        `
const style=document.createElement("style")
style.textContent=`
          .ios-install-tip {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            background-color: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px;
            text-align: center;
            z-index: 9999;
          }
          .tip-content {
            max-width: 600px;
            margin: 0 auto;
            position: relative;
          }
          .close-tip {
            background-color: white;
            color: black;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            margin-left: 10px;
            cursor: pointer;
          }
        `
document.head.appendChild(style)
document.body.appendChild(iosInstallTip)
iosInstallTip.querySelector(".close-tip").addEventListener("click",()=>{iosInstallTip.style.display="none"
localStorage.setItem("iosInstallTipClosed","true")},{passive:!0},)}},{timeout:2000},)}})()