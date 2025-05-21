// PWA functionality for Epic Media - Optimized for performance
;(() => {
  // Cache DOM elements
  const installPrompt = document.getElementById("installPrompt")
  const installButton = document.getElementById("installButton")
  const offlineNotification = document.getElementById("offlineNotification")

  // Variables to store the install prompt event
  let deferredPrompt

  // Check if the app is already installed
  if (window.matchMedia("(display-mode: standalone)").matches && installPrompt) {
    installPrompt.style.display = "none"
  }

  // Listen for the beforeinstallprompt event
  window.addEventListener("beforeinstallprompt", (e) => {
    // Prevent the default browser install prompt
    e.preventDefault()

    // Store the event for later use
    deferredPrompt = e

    // Show the install prompt
    if (installPrompt) {
      requestAnimationFrame(() => {
        installPrompt.style.display = "flex"
      })
    }
  })

  // Add click event to the install button
  if (installButton) {
    installButton.addEventListener(
      "click",
      async () => {
        if (!deferredPrompt) return

        // Show the browser install prompt
        deferredPrompt.prompt()

        // Wait for the user's choice
        const { outcome } = await deferredPrompt.userChoice

        // Clear the deferred prompt variable
        deferredPrompt = null

        // Hide the install prompt
        requestAnimationFrame(() => {
          installPrompt.style.display = "none"
        })
      },
      { passive: true },
    )
  }

  // Listen for app installed event
  window.addEventListener("appinstalled", () => {
    // Hide the install prompt
    if (installPrompt) {
      requestAnimationFrame(() => {
        installPrompt.style.display = "none"
      })
    }

    // After app is installed, preload all slider images for better offline experience
    requestIdleCallback(() => {
      const slides = document.querySelectorAll(".slide")
      slides.forEach((slide) => {
        const img = slide.querySelector("img")
        const source = slide.querySelector("source")

        if (img && img.dataset.src && !img.src) {
          img.src = img.dataset.src
        }

        if (source && source.dataset.src && !source.srcset) {
          source.srcset = source.dataset.src
        }
      })
    })
  })

  // Online/offline status handling - use throttling to avoid excessive updates
  let isShowingOfflineNotification = false

  window.addEventListener("online", () => {
    if (offlineNotification) {
      requestAnimationFrame(() => {
        offlineNotification.style.display = "none"
      })
      isShowingOfflineNotification = false
    }

    // Sync any pending data when network is available and idle
    requestIdleCallback(() => {
      if ("serviceWorker" in navigator && "SyncManager" in window) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.sync.register("contact-form-sync")
        })
      }
    })
  })

  window.addEventListener("offline", () => {
    if (offlineNotification && !isShowingOfflineNotification) {
      requestAnimationFrame(() => {
        offlineNotification.style.display = "block"
      })
      isShowingOfflineNotification = true

      // Auto-hide after 5 seconds
      setTimeout(() => {
        if (offlineNotification) {
          requestAnimationFrame(() => {
            offlineNotification.style.display = "none"
          })
          isShowingOfflineNotification = false
        }
      }, 5000)
    }
  })

  // Check initial online status
  if (!navigator.onLine && offlineNotification) {
    requestAnimationFrame(() => {
      offlineNotification.style.display = "block"
    })
    isShowingOfflineNotification = true
  }

  // Handle contact form submission with offline support
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault()

      // Get form data
      const formData = new FormData(contactForm)
      const formValues = Object.fromEntries(formData.entries())

      // Add timestamp
      formValues.timestamp = new Date().toISOString()

      try {
        if (navigator.onLine) {
          // Online - send directly
          const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formValues),
          })

          if (response.ok) {
            alert("Mesajul a fost trimis cu succes! Vă vom contacta în curând.")
            contactForm.reset()
          } else {
            throw new Error("Failed to submit form")
          }
        } else {
          // Offline - store in IndexedDB for later sync
          await storeFormData(formValues)
          alert("Sunteți offline. Mesajul dvs. va fi trimis automat când reveniți online.")
          contactForm.reset()

          // Request background sync if available
          if ("serviceWorker" in navigator && "SyncManager" in window) {
            const registration = await navigator.serviceWorker.ready
            await registration.sync.register("contact-form-sync")
          }
        }
      } catch (error) {
        console.error("Error submitting form:", error)
        alert("A apărut o eroare. Vă rugăm să încercați din nou mai târziu.")
      }
    })
  }

  // Store form data in IndexedDB for offline use - optimized
  async function storeFormData(formData) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open("epicMediaDB", 1)

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        if (!db.objectStoreNames.contains("offlineForms")) {
          db.createObjectStore("offlineForms", { keyPath: "id", autoIncrement: true })
        }
      }

      request.onsuccess = (event) => {
        const db = event.target.result
        const transaction = db.transaction(["offlineForms"], "readwrite")
        const store = transaction.objectStore("offlineForms")

        const addRequest = store.add(formData)

        addRequest.onsuccess = () => resolve()
        addRequest.onerror = () => reject(addRequest.error)
      }

      request.onerror = () => reject(request.error)
    })
  }

  // Request notification permission - defer to user interaction
  if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
    // Use a single event listener with once option
    document.addEventListener(
      "click",
      function requestNotificationPermission() {
        Notification.requestPermission()
        // Remove the event listener after the first click
        document.removeEventListener("click", requestNotificationPermission)
      },
      { once: true, passive: true },
    )
  }

  // Page visibility API to optimize performance
  document.addEventListener(
    "visibilitychange",
    () => {
      // Get slider object from global scope if available
      const sliderObj = window.slider

      if (document.visibilityState === "hidden") {
        // Pause slider when app is in background
        if (sliderObj && typeof sliderObj.pauseAutoSlide === "function") {
          sliderObj.pauseAutoSlide()
        }

        // Pause other non-essential operations
        document.body.classList.add("page-hidden")
      } else {
        // Resume slider when app is visible again
        if (sliderObj && typeof sliderObj.startAutoSlide === "function") {
          sliderObj.startAutoSlide()
        }

        // Resume operations
        document.body.classList.remove("page-hidden")
      }
    },
    { passive: true },
  )

  // Defer non-critical operations to requestIdleCallback
  if ("requestIdleCallback" in window) {
    requestIdleCallback(
      () => {
        // Add iOS install tip if needed
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
        const isInStandaloneMode =
          window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone

        if (isIOS && !isInStandaloneMode && localStorage.getItem("iosInstallTipClosed") !== "true") {
          // Create iOS install tip with minimal DOM operations
          const iosInstallTip = document.createElement("div")
          iosInstallTip.className = "ios-install-tip"
          iosInstallTip.innerHTML = `
          <div class="tip-content">
            <p>Instalați această aplicație pe dispozitivul dvs. iOS: apăsați <strong>Partajare</strong> și apoi <strong>Adăugați la ecranul principal</strong>.</p>
            <button class="close-tip">Închide</button>
          </div>
        `

          // Add styles for the iOS tip
          const style = document.createElement("style")
          style.textContent = `
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

          // Add close button functionality
          iosInstallTip.querySelector(".close-tip").addEventListener(
            "click",
            () => {
              iosInstallTip.style.display = "none"
              // Store in localStorage to avoid showing again in this session
              localStorage.setItem("iosInstallTipClosed", "true")
            },
            { passive: true },
          )
        }
      },
      { timeout: 2000 },
    )
  }
})()
