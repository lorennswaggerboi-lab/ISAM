(function () {
  var cfg = window.ISAM_CONFIG || {};
  var now = new Date().getFullYear();
  var years = cfg.foundedYear ? now - cfg.foundedYear : null;

  function waLink(message) {
    return "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(message || cfg.whatsappMessage || "");
  }

  function setAll(selector, fn) {
    document.querySelectorAll(selector).forEach(fn);
  }

  // Datos de la escuela
  setAll("[data-wa]", function (el) {
    el.href = waLink();
    el.target = "_blank";
    el.rel = "noopener";
  });
  if (cfg.phoneDisplay) {
    setAll("[data-phone]", function (el) {
      el.textContent = cfg.phoneDisplay;
      if (cfg.phoneTel) el.href = "tel:" + cfg.phoneTel;
    });
  }
  if (cfg.foundedYear) setAll("[data-founded]", function (el) { el.textContent = cfg.foundedYear; });
  if (years) {
    setAll("[data-years]", function (el) { el.textContent = "+" + years; });
    setAll("[data-years-plain]", function (el) { el.textContent = years; });
  }
  if (cfg.address) {
    setAll("[data-address]", function (el) { el.textContent = cfg.address; });
    setAll("[data-map]", function (el) {
      el.src = "https://www.google.com/maps?q=" + encodeURIComponent(cfg.address + ", Argentina") + "&output=embed";
    });
  }
  if (cfg.hours) setAll("[data-hours]", function (el) { el.textContent = cfg.hours; });
  if (cfg.instagram) setAll("[data-instagram]", function (el) { el.href = cfg.instagram; });
  setAll("[data-current-year]", function (el) { el.textContent = now; });

  // Contador de estudiantes: arranca en 0 y sube hasta el número final
  if (cfg.students) setAll("[data-count]", function (el) { el.setAttribute("data-count", cfg.students); });
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    var duration = 2000;
    var start = null;
    function frame(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + (p === 1 ? suffix : "");
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var counters = document.querySelectorAll("[data-count]");
  if (!reduceMotion) counters.forEach(function (el) { el.textContent = "0"; });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          countUp(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { io.observe(el); });
  } else {
    counters.forEach(countUp);
  }

  // Menú móvil
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav");
  toggle.addEventListener("click", function () {
    var open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  // Sombra del header al hacer scroll
  var header = document.querySelector(".site-header");
  window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.scrollY > 8);
  }, { passive: true });

  // Formulario: arma el mensaje y abre WhatsApp
  var form = document.getElementById("contact-form");
  var error = document.getElementById("form-error");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var message = form.message.value.trim();
    if (!name || !message) {
      error.hidden = false;
      return;
    }
    error.hidden = true;
    var text =
      "Hola, soy " + name + " (" + form.type.value + ").\n" +
      (form.year.value !== "No aplica" ? "Año de interés: " + form.year.value + "\n" : "") +
      "\n" + message;
    window.open(waLink(text), "_blank", "noopener");
  });
})();
