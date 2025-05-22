function a() {
  var A = "loading" in HTMLImageElement.prototype,
    b = (_) => {
      const B = _.dataset.src;
      if (!B) return;
      if (_.parentNode.tagName === "PICTURE") {
        const C = _.parentNode.querySelectorAll("source");
        for (const _a of C)
          _a.dataset.srcset &&
            ((_a.srcset = _a.dataset.srcset),
            _a.removeAttribute("data-srcset"));
      }
      _.src = B;
      _.removeAttribute("data-src");
      _.dataset.srcset &&
        ((_.srcset = _.dataset.srcset), _.removeAttribute("data-srcset"));
      _.classList.add("loaded");
    },
    c = (D) => {
      const _b = D.dataset.src;
      if (!_b) return;
      D.src = _b;
      D.removeAttribute("data-src");
      D.classList.add("loaded");
    },
    d = document.querySelectorAll("img[data-src]");
  for (const _A of d)
    if (A) {
      _A.loading = "lazy";
      b(_A);
    } else {
      var e = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              b(_A);
              e.unobserve(_A);
            }
          }
        },
        { rootMargin: "50px" }
      );
      e.observe(_A);
    }
  var f = document.querySelectorAll("iframe[data-src]");
  for (const E of f)
    if (A) {
      E.loading = "lazy";
      c(E);
    } else {
      const aA = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              c(E);
              aA.unobserve(E);
            }
          }
        },
        { rootMargin: "200px" }
      );
      aA.observe(E);
    }
  if ("contentVisibility" in document.documentElement.style) {
    var g = document.querySelectorAll("section:not(.hero)");
    for (const aB of g) {
      aB.style.contentVisibility = "auto";
      aB.style.containIntrinsicSize = "1px 5000px";
    }
  }
}
export { a as lazyLoadMedia };
