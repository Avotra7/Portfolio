(function () {
  "use strict";

  /* ============================================================
     1. CUSTOM CURSOR
     Only active on pointer-fine / hover-capable devices.
     Cursor dot follows mouse directly; follower lerps via RAF.
     ============================================================ */
  var cursor = document.getElementById("cursor");
  var cursorFollower = document.getElementById("cursor-follower");

  var isPointerFine =
    window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (isPointerFine && cursor && cursorFollower) {
    var mouseX = 0;
    var mouseY = 0;
    var followerX = 0;
    var followerY = 0;
    var rafId = null;

    document.addEventListener("mousemove", function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      // Move dot cursor immediately
      cursor.style.left = mouseX + "px";
      cursor.style.top = mouseY + "px";
    });

    function animateFollower() {
      // Lerp follower toward mouse
      followerX += (mouseX - followerX) * 0.1;
      followerY += (mouseY - followerY) * 0.1;
      cursorFollower.style.left = followerX + "px";
      cursorFollower.style.top = followerY + "px";
      rafId = requestAnimationFrame(animateFollower);
    }

    animateFollower();

    // Hide cursor when it leaves the window
    document.addEventListener("mouseleave", function () {
      cursor.style.opacity = "0";
      cursorFollower.style.opacity = "0";
    });

    document.addEventListener("mouseenter", function () {
      cursor.style.opacity = "1";
      cursorFollower.style.opacity = "0.7";
    });
  }

  /* ============================================================
     2. PRELOADER
     Hides on window load; removes element from DOM after fade.
     ============================================================ */
  var preloader = document.getElementById("preloader");

  if (preloader) {
    window.addEventListener("load", function () {
      preloader.classList.add("hidden");
      setTimeout(function () {
        if (preloader && preloader.parentNode) {
          preloader.parentNode.removeChild(preloader);
        }
      }, 600);
    });
  }

  /* ============================================================
     3. HEADER SCROLL STATE
     Toggles .scrolled class after 50px of scroll.
     ============================================================ */
  var header = document.getElementById("header");

  function onHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }

  window.addEventListener("scroll", onHeaderScroll, { passive: true });
  onHeaderScroll(); // Run once on init

  /* ============================================================
     4. MOBILE NAV — TOGGLE
     Clicking the hamburger button toggles .active on itself
     and .open on the nav-links list.
     ============================================================ */
  var navToggle = document.querySelector(".nav-toggle");
  var navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      var isActive = navToggle.classList.toggle("active");
      navLinks.classList.toggle("open", isActive);
      navToggle.setAttribute("aria-expanded", isActive ? "true" : "false");
      // Prevent body scroll when menu is open
      document.body.style.overflow = isActive ? "hidden" : "";
    });
  }

  /* ============================================================
     5. CLOSE MOBILE NAV ON LINK CLICK
     ============================================================ */
  if (navLinks) {
    var allNavLinks = navLinks.querySelectorAll(".nav-link");
    allNavLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        if (navToggle) {
          navToggle.classList.remove("active");
          navToggle.setAttribute("aria-expanded", "false");
        }
        navLinks.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ============================================================
     6. SCROLL TOP BUTTON
     Appears after 300px scroll; click scrolls smoothly to top.
     ============================================================ */
  var scrollTopBtn = document.getElementById("scroll-top");

  if (scrollTopBtn) {
    function onScrollTopVisibility() {
      if (window.scrollY > 300) {
        scrollTopBtn.classList.add("active");
      } else {
        scrollTopBtn.classList.remove("active");
      }
    }

    window.addEventListener("scroll", onScrollTopVisibility, { passive: true });
    onScrollTopVisibility();

    scrollTopBtn.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ============================================================
     7. AOS INIT
     Runs after window load to allow images and fonts to settle.
     ============================================================ */
  window.addEventListener("load", function () {
    if (typeof AOS !== "undefined") {
      AOS.init({
        duration: 700,
        easing: "ease-out-cubic",
        once: true,
        offset: 60,
      });
    }
  });

  /* ============================================================
     8. TYPED.JS INIT
     Animates the typed text in the hero subtitle.
     ============================================================ */
  window.addEventListener("load", function () {
    var typedEl = document.getElementById("typed");
    if (typedEl && typeof Typed !== "undefined") {
      var items = typedEl.getAttribute("data-typed-items");
      if (items) {
        new Typed("#typed", {
          strings: items.split(",").map(function (s) {
            return s.trim();
          }),
          typeSpeed: 60,
          backSpeed: 35,
          backDelay: 1800,
          startDelay: 400,
          loop: true,
          smartBackspace: true,
        });
      }
    }
  });

  /* ============================================================
     9. SCROLLSPY
     Updates .active class on nav links based on which section
     is currently in view.
     ============================================================ */
  var sections = document.querySelectorAll(
    "#hero, #about, #stack, #experience, #projects"
  );
  var navSpyLinks = document.querySelectorAll(".nav-link[href^='#']");

  function onScrollSpy() {
    var scrollPos = window.scrollY + 100;
    var currentId = "";

    sections.forEach(function (section) {
      var sectionTop = section.offsetTop;
      var sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        currentId = section.getAttribute("id");
      }
    });

    navSpyLinks.forEach(function (link) {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + currentId) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", onScrollSpy, { passive: true });
  onScrollSpy();

})();
