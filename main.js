import { initSlider } from "./slider.js";
import { setupNavigation } from "./navigation.js";

document.addEventListener("DOMContentLoaded", () => {
  initSlider();
  setupNavigation();

  // Dynamically import non-critical features
  Promise.all([
    import("./lazyload.js").then((module) => module.lazyLoadMedia()),
    import("./animations.js").then((module) => module.animateOnScroll()),
  ]).catch((error) => {
    console.error("Error loading modules:", error);
  });

  // Register intersection observer for lazy loading below-the-fold content
  if ("IntersectionObserver" in window) {
    const lazyLoadObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const section = entry.target;

            // Stop observing after loading
            observer.unobserve(section);
          }
        });
      },
      {
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    // Observe sections for lazy loading
    document.querySelectorAll("section[id]:not(#home)").forEach((section) => {
      lazyLoadObserver.observe(section);
    });
  }
});
