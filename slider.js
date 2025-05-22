// Optimized slider with better performance and accessibility
export function initSlider() {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  let slideInterval;
  let currentSlide = 0;

  // Skip if no slides
  if (slides.length <= 1) return;

  // Function to change slide
  function goToSlide(index) {
    // Use requestAnimationFrame for smoother transitions
    requestAnimationFrame(() => {
      // Remove active class from current slide and dot
      slides[currentSlide].classList.remove("active");
      dots[currentSlide]?.classList.remove("active");

      // Add active class to new slide and dot
      slides[index].classList.add("active");
      dots[index]?.classList.add("active");

      // Update current slide index
      currentSlide = index;

      // Preload the next slide's image if it exists
      const nextIndex = (index + 1) % slides.length;
      const nextSlide = slides[nextIndex];
      const nextImage = nextSlide.querySelector("img");

      if (nextImage && nextImage.loading !== "eager") {
        nextImage.loading = "eager";
      }
    });
  }

  // Function to go to next slide
  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  // Function to start auto-sliding
  function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  // Initialize slider
  slides[0].classList.add("active");
  dots[0]?.classList.add("active");
  startAutoSlide();

  // Pause auto-sliding on hover
  const sliderContainer = document.querySelector(".hero-slider");
  if (sliderContainer) {
    sliderContainer.addEventListener("mouseenter", () => {
      clearInterval(slideInterval);
    });

    sliderContainer.addEventListener("mouseleave", startAutoSlide);

    // Add touch support
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true }
    );

    sliderContainer.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      { passive: true }
    );

    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe left - next slide
        clearInterval(slideInterval);
        nextSlide();
        startAutoSlide();
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe right - previous slide
        clearInterval(slideInterval);
        goToSlide((currentSlide - 1 + slides.length) % slides.length);
        startAutoSlide();
      }
    }
  }

  // Dot navigation
  const dotsContainer = document.querySelector(".slide-dots");
  if (dotsContainer) {
    dotsContainer.addEventListener("click", (e) => {
      const dot = e.target.closest(".dot");
      if (dot) {
        const slideIndex = Number(dot.dataset.slide);
        if (!isNaN(slideIndex)) {
          clearInterval(slideInterval);
          goToSlide(slideIndex);
          startAutoSlide();
        }
      }
    });

    // Make dots keyboard accessible
    dotsContainer.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        const dot = e.target.closest(".dot");
        if (dot) {
          const slideIndex = Number(dot.dataset.slide);
          if (!isNaN(slideIndex)) {
            clearInterval(slideInterval);
            goToSlide(slideIndex);
            startAutoSlide();
            e.preventDefault();
          }
        }
      }
    });
  }

  // Arrow navigation
  const prevArrow = document.querySelector(".arrow.prev");
  const nextArrow = document.querySelector(".arrow.next");

  if (prevArrow) {
    prevArrow.addEventListener("click", () => {
      clearInterval(slideInterval);
      goToSlide((currentSlide - 1 + slides.length) % slides.length);
      startAutoSlide();
    });
  }

  if (nextArrow) {
    nextArrow.addEventListener("click", () => {
      clearInterval(slideInterval);
      nextSlide();
      startAutoSlide();
    });
  }
}
