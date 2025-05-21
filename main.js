document.addEventListener("DOMContentLoaded",()=>{const slidesElements=document.querySelectorAll(".slide")
const dotsElements=document.querySelectorAll(".dot")
const prevBtnElement=document.querySelector(".arrow.prev")
const nextBtnElement=document.querySelector(".arrow.next")
const sliderElement=document.querySelector(".hero-slider")
const navLinks=document.querySelectorAll(".nav-links a")
const sections=document.querySelectorAll("section[id]")
const slider={slides:slidesElements,dots:dotsElements,prevBtn:prevBtnElement,nextBtn:nextBtnElement,currentSlide:0,slideInterval:null,isTransitioning:!1,init:function(){if(!this.slides.length)return
if(this.dots.length){const dotsContainer=document.querySelector(".slide-dots")
if(dotsContainer){dotsContainer.addEventListener("click",(e)=>{const dot=e.target.closest(".dot")
if(dot){const slideIndex=Number.parseInt(dot.dataset.slide,10)
if(!isNaN(slideIndex)){this.goToSlide(slideIndex)}}},{passive:!0},)}}
if(this.prevBtn){this.prevBtn.addEventListener("click",()=>this.prevSlide(),{passive:!0})}
if(this.nextBtn){this.nextBtn.addEventListener("click",()=>this.nextSlide(),{passive:!0})}
this.startAutoSlide()
if(sliderElement){sliderElement.addEventListener("mouseenter",()=>this.pauseAutoSlide(),{passive:!0})
sliderElement.addEventListener("mouseleave",()=>this.startAutoSlide(),{passive:!0})
let touchStartX=0
let touchEndX=0
sliderElement.addEventListener("touchstart",(e)=>{touchStartX=e.changedTouches[0].screenX},{passive:!0},)
sliderElement.addEventListener("touchend",(e)=>{touchEndX=e.changedTouches[0].screenX
if(touchStartX-touchEndX>50){this.nextSlide()}else if(touchEndX-touchStartX>50){this.prevSlide()}},{passive:!0},)}
document.addEventListener("keydown",(e)=>{if(e.key==="ArrowLeft"){this.prevSlide()}else if(e.key==="ArrowRight"){this.nextSlide()}},{passive:!0},)
this.preloadNextSlide()},goToSlide:function(index){if(index<0||index>=this.slides.length||index===this.currentSlide||this.isTransitioning)return
this.isTransitioning=!0
requestAnimationFrame(()=>{this.slides[this.currentSlide].classList.remove("active")
this.slides[index].classList.add("active")
if(this.dots.length){this.dots[this.currentSlide].classList.remove("active")
this.dots[index].classList.add("active")}
this.currentSlide=index
this.preloadNextSlide()
setTimeout(()=>{this.isTransitioning=!1},500)})},nextSlide:function(){const next=(this.currentSlide+1)%this.slides.length
this.goToSlide(next)},prevSlide:function(){const prev=(this.currentSlide-1+this.slides.length)%this.slides.length
this.goToSlide(prev)},startAutoSlide:function(){this.pauseAutoSlide()
this.slideInterval=setInterval(()=>{this.nextSlide()},5000)},pauseAutoSlide:function(){if(this.slideInterval){clearInterval(this.slideInterval)
this.slideInterval=null}},preloadNextSlide:function(){const nextIndex=(this.currentSlide+1)%this.slides.length
const nextSlide=this.slides[nextIndex]
if(nextSlide){const img=nextSlide.querySelector("img")
if(img&&img.dataset.src&&!img.src){img.src=img.dataset.src}
const source=nextSlide.querySelector("source")
if(source&&source.dataset.src&&!source.srcset){source.srcset=source.dataset.src}}},}
slider.init()
window.slider={pauseAutoSlide:()=>slider.pauseAutoSlide(),startAutoSlide:()=>slider.startAutoSlide(),}
if("IntersectionObserver" in window){const lazyLoadObserver=new IntersectionObserver((entries,observer)=>{entries.forEach((entry)=>{if(entry.isIntersecting){const element=entry.target
if(element.tagName==="IMG"&&element.dataset.src){element.src=element.dataset.src
element.removeAttribute("data-src")}
if(element.tagName==="SOURCE"&&element.dataset.src){element.srcset=element.dataset.src
element.removeAttribute("data-src")}
if(element.tagName==="IFRAME"&&element.dataset.src){element.src=element.dataset.src
element.removeAttribute("data-src")}
observer.unobserve(element)}})},{rootMargin:"200px 0px",threshold:0.01,},)
document.querySelectorAll('img[loading="lazy"], source[data-src], iframe[loading="lazy"]').forEach((element)=>{lazyLoadObserver.observe(element)})}
function throttle(func,delay){let scheduled=!1
return()=>{if(!scheduled){scheduled=!0
setTimeout(()=>{func()
scheduled=!1},delay)}}}
document.querySelectorAll('a[href^="#"]').forEach((anchor)=>{anchor.addEventListener("click",function(e){e.preventDefault()
const targetId=this.getAttribute("href")
if(targetId==="#")return
const targetElement=document.querySelector(targetId)
if(targetElement){targetElement.scrollIntoView({behavior:"smooth",block:"start",})}},{passive:!1},)})
const highlightNavigation=throttle(()=>{const scrollPosition=window.scrollY+100
requestAnimationFrame(()=>{sections.forEach((section)=>{const sectionTop=section.offsetTop
const sectionHeight=section.offsetHeight
const sectionId=section.getAttribute("id")
if(scrollPosition>=sectionTop&&scrollPosition<sectionTop+sectionHeight){navLinks.forEach((link)=>{link.classList.remove("active")
if(link.getAttribute("href")===`#${sectionId}`){link.classList.add("active")}})}})})},100)
window.addEventListener("scroll",highlightNavigation,{passive:!0})
if("IntersectionObserver" in window){const animatedElements=document.querySelectorAll(".feature-box, .testimonial-box, .pricing-box")
const animationObserver=new IntersectionObserver((entries)=>{entries.forEach((entry)=>{if(entry.isIntersecting){requestAnimationFrame(()=>{entry.target.classList.add("animated")})
animationObserver.unobserve(entry.target)}})},{threshold:0.1,rootMargin:"0px 0px 50px 0px",},)
animatedElements.forEach((element)=>{animationObserver.observe(element)})}})