(function () {
  var cfg = window.ISAM_CONFIG || {};
  var today = new Date();
  var now = today.getFullYear();
  var years = cfg.foundedYear ? now - cfg.foundedYear : null;
  // Desde septiembre se muestran las inscripciones del ciclo lectivo siguiente
  var admissionsYear = today.getMonth() >= 8 ? now + 1 : now;
  var hasWhatsApp = !!cfg.whatsapp;
  var telHref = cfg.phoneTel ? "tel:" + cfg.phoneTel : null;

  function waLink(message) {
    return "https://wa.me/" + cfg.whatsapp + "?text=" + encodeURIComponent(message || cfg.whatsappMessage || "");
  }

  function mailLink(message) {
    return "mailto:" + cfg.email + "?subject=" + encodeURIComponent("Consulta desde el sitio web") +
      "&body=" + encodeURIComponent(message || "");
  }

  function setAll(selector, fn) {
    document.querySelectorAll(selector).forEach(fn);
  }

  // Botones de contacto: WhatsApp si está configurado; si no, llamada a Secretaría
  setAll("[data-contact]", function (el) {
    if (hasWhatsApp) {
      el.href = waLink();
      el.target = "_blank";
      el.rel = "noopener";
      if (el.dataset.labelWa) el.textContent = el.dataset.labelWa;
    } else {
      if (telHref) el.href = telHref;
      el.removeAttribute("target");
      if (el.dataset.labelPhone) el.textContent = el.dataset.labelPhone;
    }
  });
  setAll("[data-wa-float]", function (el) {
    if (!hasWhatsApp) return;
    el.href = waLink();
    el.target = "_blank";
    el.rel = "noopener";
    el.hidden = false;
  });

  // Datos de la Institución
  if (cfg.phoneDisplay) {
    setAll("[data-phone]", function (el) {
      el.textContent = cfg.phoneDisplay;
      if (telHref) el.href = telHref;
    });
  }
  if (cfg.foundedYear) setAll("[data-founded]", function (el) { el.textContent = cfg.foundedYear; });
  if (years) {
    setAll("[data-years]", function (el) { el.textContent = "+" + years; });
    setAll("[data-years-plain]", function (el) { el.textContent = years; });
  }
  setAll("[data-admissions-year]", function (el) { el.textContent = admissionsYear; });
  if (cfg.address) {
    setAll("[data-address]", function (el) { el.textContent = cfg.address; });
    setAll("[data-map]", function (el) {
      el.src = "https://www.google.com/maps?q=" + encodeURIComponent((cfg.mapQuery || cfg.address) + ", Argentina") + "&output=embed";
    });
  }
  if (cfg.hours) setAll("[data-hours]", function (el) { el.textContent = cfg.hours; });
  if (cfg.instagram) setAll("[data-instagram]", function (el) { el.href = cfg.instagram; });
  if (cfg.googleRating) {
    setAll("[data-rating]", function (el) { el.textContent = cfg.googleRating.toFixed(1).replace(".", ","); });
    setAll("[data-stars]", function (el) { el.style.width = (cfg.googleRating / 5 * 100) + "%"; });
  }
  if (cfg.googleMapsUrl) setAll("[data-rating-link]", function (el) { el.href = cfg.googleMapsUrl; });
  setAll("[data-current-year]", function (el) { el.textContent = now; });

  // Contador de alumnos: arranca en 0 y sube hasta el número final
  if (cfg.students) setAll("[data-count]", function (el) { el.setAttribute("data-count", cfg.students); });
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduceMotion) { el.textContent = target + suffix; return; }
    // Tramo 1: sube parejo y medio rápido hasta ~83% del número.
    // Tramo 2: frena de a poco hasta llegar, sin saltos de velocidad entre tramos.
    var cruise = target * 0.83;
    var cruiseTime = 1300;
    var power = 5;
    var slowTime = power * (target - cruise) / (cruise / cruiseTime);
    var start = null;
    function frame(t) {
      if (start === null) start = t;
      var elapsed = t - start;
      var value, done = false;
      if (elapsed < cruiseTime) {
        value = cruise * elapsed / cruiseTime;
      } else {
        var p = Math.min((elapsed - cruiseTime) / slowTime, 1);
        value = cruise + (target - cruise) * (1 - Math.pow(1 - p, power));
        done = p === 1;
      }
      el.textContent = Math.floor(value) + (done ? suffix : "");
      if (!done) requestAnimationFrame(frame);
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

  // Sombra del encabezado al desplazarse
  var header = document.querySelector(".site-header");
  window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.scrollY > 40);
  }, { passive: true });

  // Formulario de consulta: solo se muestra si hay WhatsApp o correo para enviarlo.
  // Sin ninguno de los dos queda la tarjeta de atención telefónica.
  var form = document.getElementById("contact-form");
  var phoneCard = document.getElementById("phone-card");
  var error = document.getElementById("form-error");
  var canSend = hasWhatsApp || !!cfg.email;
  form.hidden = !canSend;
  phoneCard.hidden = canSend;
  if (canSend) {
    form.querySelector("[data-submit-label]").textContent = hasWhatsApp ? "Enviar consulta por WhatsApp" : "Enviar consulta por correo";
  }

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
      "Buenos días. Mi nombre es " + name + " (" + form.type.value + ").\n" +
      (form.year.value !== "No aplica" ? "Nivel de interés: " + form.year.value + "\n" : "") +
      "\n" + message;
    if (hasWhatsApp) window.open(waLink(text), "_blank", "noopener");
    else window.location.href = mailLink(text);
  });
})();
