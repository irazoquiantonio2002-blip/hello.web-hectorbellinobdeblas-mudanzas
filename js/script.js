const siteHeader = document.getElementById("siteHeader");
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");
const waToggle = document.getElementById("waToggle");
const waMenu = document.getElementById("waMenu");
const toTop = document.getElementById("toTop");
const contactForm = document.getElementById("contactForm");
const loadingScreen = document.getElementById("loading-screen");

const whatsappNumber = "525517058595";

window.addEventListener("load", () => {
  setTimeout(() => {
    loadingScreen?.classList.add("is-hidden");
  }, 450);
});

const updateHeader = () => {
  const isScrolled = window.scrollY > 24;
  siteHeader?.classList.toggle("is-scrolled", isScrolled);
  toTop?.classList.toggle("is-visible", window.scrollY > 520);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();

navToggle?.addEventListener("click", () => {
  const isOpen = mobileNav?.classList.toggle("is-open");
  navToggle.classList.toggle("is-active", isOpen);
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
});

mobileNav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("is-open");
    navToggle?.classList.remove("is-active");
    document.body.classList.remove("nav-open");
    navToggle?.setAttribute("aria-label", "Abrir menú");
  });
});

waToggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  waMenu?.classList.toggle("is-open");
});

document.addEventListener("click", (event) => {
  if (!event.target.closest(".wa-float")) {
    waMenu?.classList.remove("is-open");
  }
});

toTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll("[data-reveal]").forEach((element) => {
  const delay = element.getAttribute("data-reveal-delay") || "0";
  element.style.setProperty("--delay", delay);
  revealObserver.observe(element);
});

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target;
      const target = Number(element.dataset.count || 0);
      const suffix = element.dataset.suffix || "";
      const duration = 900;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = `${Math.round(target * eased)}${suffix}`;

        if (progress < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(element);
    });
  },
  { threshold: 0.8 }
);

document.querySelectorAll("[data-count]").forEach((element) => {
  countObserver.observe(element);
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const nombre = data.get("nombre")?.toString().trim();
  const telefono = data.get("telefono")?.toString().trim();
  const area = data.get("area")?.toString().trim();
  const mensaje = data.get("mensaje")?.toString().trim();

  const text = [
    "Hola, quiero cotizar una mudanza con Héctor Bellino Mudanzas.",
    nombre ? `Nombre: ${nombre}` : "",
    telefono ? `Teléfono: ${telefono}` : "",
    area ? `Servicio: ${area}` : "",
    mensaje ? `Detalles: ${mensaje}` : ""
  ]
    .filter(Boolean)
    .join("\n");

  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank", "noopener");
});
