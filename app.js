function setupFormSync() {
  const e = document.getElementById("contactForm");
  e &&
    e.addEventListener("submit", async (t) => {
      t.preventDefault();
      const r = new FormData(e),
        o = Object.fromEntries(r.entries());
      o.timestamp = new Date().toISOString();
      try {
        if (navigator.onLine) {
          if (
            !(
              await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(o),
              })
            ).ok
          )
            throw new Error("Failed to send");
          alert("Mesaj trimis cu succes!"), e.reset();
        } else if (
          (await storeFormData(o),
          alert("Sunteți offline. Mesajul va fi trimis automat."),
          e.reset(),
          "serviceWorker" in navigator && "SyncManager" in window)
        ) {
          const e = await navigator.serviceWorker.ready;
          await e.sync.register("contact-form-sync");
        }
      } catch (e) {
        console.error("Eroare la trimitere:", e),
          alert("A apărut o eroare. Încercați mai târziu.");
      }
    });
}
function setupInstallPrompt() {
  const e = document.getElementById("installPrompt"),
    t = document.getElementById("installButton");
  let n = null;
  window.matchMedia("(display-mode: standalone)").matches &&
    e &&
    (e.style.display = "none"),
    window.addEventListener("beforeinstallprompt", (t) => {
      t.preventDefault(), (n = t), e && (e.style.display = "flex");
    }),
    t &&
      t.addEventListener("click", async () => {
        if (!n) return;
        n.prompt();
        const { outcome: t } = await n.userChoice;
        (n = null), (e.style.display = "none");
      }),
    window.addEventListener("appinstalled", () => {
      e && (e.style.display = "none");
    });
}
function setupOfflineHandler() {
  const e = document.getElementById("offlineNotification");
  let n = !1;
  function i() {
    e &&
      !n &&
      ((e.style.display = "block"),
      (n = !0),
      setTimeout(() => {
        (e.style.display = "none"), (n = !1);
      }, 5e3));
  }
  window.addEventListener("offline", i),
    window.addEventListener("online", () => {
      e && ((e.style.display = "none"), (n = !1)),
        "serviceWorker" in navigator &&
          "SyncManager" in window &&
          navigator.serviceWorker.ready.then((e) => {
            e.sync.register("contact-form-sync");
          });
    }),
    navigator.onLine || i();
}
function setupNotificationPermission() {
  "Notification" in window &&
    "granted" !== Notification.permission &&
    "denied" !== Notification.permission &&
    document.addEventListener(
      "click",
      function i() {
        Notification.requestPermission(),
          document.removeEventListener("click", i);
      },
      { once: !0, passive: !0 }
    );
}
function setupVisibilityHandler() {
  document.addEventListener(
    "visibilitychange",
    () => {
      const e = window.slider;
      "hidden" === document.visibilityState
        ? (e && "function" == typeof e.pauseAutoSlide && e.pauseAutoSlide(),
          document.body.classList.add("page-hidden"))
        : (e && "function" == typeof e.startAutoSlide && e.startAutoSlide(),
          document.body.classList.remove("page-hidden"));
    },
    { passive: !0 }
  );
}
function showIosInstallTip() {
  "requestIdleCallback" in window &&
    requestIdleCallback(
      () => {
        const n =
            /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream,
          t =
            window.matchMedia("(display-mode: standalone)").matches ||
            window.navigator.standalone;
        if (n && !t && "true" !== localStorage.getItem("iosInstallTipClosed")) {
          const n = document.createElement("div");
          (n.className = "ios-install-tip"),
            (n.innerHTML =
              '\n        <div class="tip-content">\n          <p>Instalați aplicația pe dispozitivul dvs. iOS: apăsați <strong>Partajare</strong> și apoi <strong>Adăugați la ecranul principal</strong>.</p>\n          <button class="close-tip">Închide</button>\n        </div>\n      ');
          const t = document.createElement("style");
          (t.textContent =
            "\n        .ios-install-tip {\n          position: fixed;\n          bottom: 0;\n          left: 0;\n          right: 0;\n          background-color: rgba(0, 0, 0, 0.8);\n          color: white;\n          padding: 15px;\n          text-align: center;\n          z-index: 9999;\n        }\n        .tip-content {\n          max-width: 600px;\n          margin: 0 auto;\n          position: relative;\n        }\n        .close-tip {\n          background-color: white;\n          color: black;\n          border: none;\n          padding: 5px 10px;\n          border-radius: 3px;\n          margin-left: 10px;\n          cursor: pointer;\n        }\n      "),
            document.head.appendChild(t),
            document.body.appendChild(n),
            n.querySelector(".close-tip").addEventListener(
              "click",
              () => {
                (n.style.display = "none"),
                  localStorage.setItem("iosInstallTipClosed", "true");
              },
              { passive: !0 }
            );
        }
      },
      { timeout: 2e3 }
    );
}

function storeFormData(e) {
  return new Promise((t, r) => {
    const o = indexedDB.open("epicMediaDB", 1);
    (o.onupgradeneeded = (e) => {
      const t = e.target.result;
      t.objectStoreNames.contains("offlineForms") ||
        t.createObjectStore("offlineForms", {
          keyPath: "id",
          autoIncrement: !0,
        });
    }),
      (o.onsuccess = (o) => {
        const n = o.target.result
          .transaction("offlineForms", "readwrite")
          .objectStore("offlineForms");
        (n.add(e).onsuccess = () => t()), (n.add(e).onerror = () => r());
      }),
      (o.onerror = () => r());
  });
}

function g() {
  try {
    setupInstallPrompt();
  } catch (A) {
    console.error("Error setting up install prompt:", A);
  }
  try {
    setupOfflineHandler();
  } catch (_) {
    console.error("Error setting up offline handler:", _);
  }
  try {
    setupFormSync();
  } catch (B) {
    console.error("Error setting up form sync:", B);
  }
  try {
    setupNotificationPermission();
  } catch (C) {
    console.error("Error setting up notification permission:", C);
  }
  try {
    setupVisibilityHandler();
  } catch (_a) {
    console.error("Error setting up visibility handler:", _a);
  }
  try {
    showIosInstallTip();
  } catch (D) {
    console.error("Error showing iOS install tip:", D);
  }
}
document.readyState === "loading"
  ? document.addEventListener("DOMContentLoaded", g)
  : g();
