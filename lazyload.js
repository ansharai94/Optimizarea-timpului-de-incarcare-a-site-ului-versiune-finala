// Enhanced lazy loading with modern browser support
export function lazyLoadMedia() {
  // Check for native lazy loading support
  const supportsNativeLazy = "loading" in HTMLImageElement.prototype;

  // Function to load an image
  const loadImage = (img) => {
    const src = img.dataset.src;
    if (!src) return;

    // If it's a picture element with sources
    if (img.parentNode.tagName === "PICTURE") {
      const sources = img.parentNode.querySelectorAll("source");
      sources.forEach((source) => {
        if (source.dataset.srcset) {
          source.srcset = source.dataset.srcset;
          source.removeAttribute("data-srcset");
        }
      });
    }

    // Set the src and remove data-src
    img.src = src;
    img.removeAttribute("data-src");

    // If there's a srcset, load that too
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
      img.removeAttribute("data-srcset");
    }

    // Add loaded class for animations if needed
    img.classList.add("loaded");
  };

  // Function to load an iframe
  const loadIframe = (iframe) => {
    const src = iframe.dataset.src;
    if (!src) return;

    iframe.src = src;
    iframe.removeAttribute("data-src");
    iframe.classList.add("loaded");
  };

  // Handle all images
  const images = document.querySelectorAll("img[data-src]");
  images.forEach((img) => {
    if (supportsNativeLazy) {
      // Use native lazy loading
      img.loading = "lazy";
      loadImage(img);
    } else {
      // Use Intersection Observer as fallback
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadImage(img);
              observer.unobserve(img);
            }
          });
        },
        { rootMargin: "50px" }
      );

      observer.observe(img);
    }
  });

  // Handle all iframes
  const iframes = document.querySelectorAll("iframe[data-src]");
  iframes.forEach((iframe) => {
    if (supportsNativeLazy) {
      // Use native lazy loading
      iframe.loading = "lazy";
      loadIframe(iframe);
    } else {
      // Use Intersection Observer as fallback
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadIframe(iframe);
              observer.unobserve(iframe);
            }
          });
        },
        { rootMargin: "200px" }
      );

      observer.observe(iframe);
    }
  });

  // Apply content-visibility for better rendering performance
  if ("contentVisibility" in document.documentElement.style) {
    const sections = document.querySelectorAll("section:not(.hero)");
    sections.forEach((section) => {
      section.style.contentVisibility = "auto";
      section.style.containIntrinsicSize = "1px 5000px";
    });
  }
}
