function initSlider() {
  const e = document.querySelectorAll(".slide"),
    t = document.querySelectorAll(".dot");
  let n,
    r = 0;
  if (e.length <= 1) return;
  function c(n) {
    requestAnimationFrame(() => {
      e[r].classList.remove("active"),
        t[r]?.classList.remove("active"),
        e[n].classList.add("active"),
        t[n]?.classList.add("active"),
        (r = n);
      const c = (n + 1) % e.length,
        s = e[c].querySelector("img");
      s && "eager" !== s.loading && (s.loading = "eager");
    });
  }
  function s() {
    c((r + 1) % e.length);
  }
  function a() {
    n = setInterval(s, 5e3);
  }
  e[0].classList.add("active"), t[0]?.classList.add("active"), a();
  const l = document.querySelector(".hero-slider");
  if (l) {
    l.addEventListener("mouseenter", () => {
      clearInterval(n);
    }),
      l.addEventListener("mouseleave", a);
    let t = 0,
      i = 0;
    l.addEventListener(
      "touchstart",
      (e) => {
        t = e.changedTouches[0].screenX;
      },
      { passive: !0 }
    ),
      l.addEventListener(
        "touchend",
        (l) => {
          (i = l.changedTouches[0].screenX),
            (function () {
              const l = 50;
              i < t - l
                ? (clearInterval(n), s(), a())
                : i > t + l &&
                  (clearInterval(n), c((r - 1 + e.length) % e.length), a());
            })();
        },
        { passive: !0 }
      );
  }
  const i = document.querySelector(".slide-dots");
  i &&
    (i.addEventListener("click", (e) => {
      const t = e.target.closest(".dot");
      if (t) {
        const e = Number(t.dataset.slide);
        isNaN(e) || (clearInterval(n), c(e), a());
      }
    }),
    i.addEventListener("keydown", (e) => {
      if ("Enter" === e.key || " " === e.key) {
        const t = e.target.closest(".dot");
        if (t) {
          const r = Number(t.dataset.slide);
          isNaN(r) || (clearInterval(n), c(r), a(), e.preventDefault());
        }
      }
    }));
  const o = document.querySelector(".arrow.prev"),
    d = document.querySelector(".arrow.next");
  o &&
    o.addEventListener("click", () => {
      clearInterval(n), c((r - 1 + e.length) % e.length), a();
    }),
    d &&
      d.addEventListener("click", () => {
        clearInterval(n), s(), a();
      });
}
function a() {
  const t = document.querySelectorAll(".nav-links a"),
    e = document.querySelectorAll("section[id]");
  t.forEach((t) =>
    t.addEventListener("click", (e) => {
      e.preventDefault();
      const s = document.getElementById(t.getAttribute("href").substring(1));
      s?.scrollIntoView({ behavior: "smooth", block: "start" });
    })
  ),
    window.addEventListener(
      "scroll",
      () => {
        var o = window.pageYOffset + 100;
        e.forEach((e) => {
          const s = e.offsetTop,
            i = e.offsetHeight,
            c = e.getAttribute("id");
          o >= s &&
            o < s + i &&
            t.forEach(
              (t) => (
                t.classList.remove("active"),
                t.getAttribute("href") === `#${c}` && t.classList.add("active")
              )
            );
        });
      },
      { passive: !0 }
    );
}
export { a as setupNavigation };
document.addEventListener("DOMContentLoaded", () => {
  initSlider();
  a();
  Promise.all([
    import("./lazyload.js").then((A) => A.lazyLoadMedia()),
    import("./animations.js").then((_) => _.animateOnScroll()),
  ]).catch((B) => console.error("Error loading modules:", B));
});
