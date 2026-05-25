const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

window.addEventListener("load", () => {
  document.body.classList.add("is-loaded");
});

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  document.documentElement.style.setProperty("--scroll-progress", Math.min(progress, 1).toFixed(4));
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
window.addEventListener("resize", updateScrollProgress);
updateScrollProgress();

navToggle?.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks?.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

const slider = document.querySelector("[data-slider]");
const slides = [...document.querySelectorAll(".hero-slide")];
const dotsWrap = document.querySelector(".slider-dots");
let activeSlide = 0;
let slideTimer;

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
  });
  document.querySelectorAll(".slider-dots button").forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeSlide);
    dot.setAttribute("aria-selected", String(dotIndex === activeSlide));
  });
}

function restartSlider() {
  clearInterval(slideTimer);
  if (!prefersReducedMotion) {
    slideTimer = setInterval(() => showSlide(activeSlide + 1), 6000);
  }
}

if (slider && slides.length && dotsWrap) {
  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Show slide ${index + 1}`);
    dot.addEventListener("click", () => {
      showSlide(index);
      restartSlider();
    });
    dotsWrap.append(dot);
  });

  slider.querySelector("[data-prev]")?.addEventListener("click", () => {
    showSlide(activeSlide - 1);
    restartSlider();
  });

  slider.querySelector("[data-next]")?.addEventListener("click", () => {
    showSlide(activeSlide + 1);
    restartSlider();
  });

  showSlide(0);
  restartSlider();
}

const foodSlider = document.querySelector("[data-food-slider]");
const foodSlides = [...document.querySelectorAll(".food-slide")];
const foodDotsWrap = document.querySelector(".food-dots");
let activeFoodSlide = 0;
let foodSlideTimer;

function showFoodSlide(index) {
  activeFoodSlide = (index + foodSlides.length) % foodSlides.length;
  foodSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeFoodSlide);
  });
  document.querySelectorAll(".food-dots button").forEach((dot, dotIndex) => {
    dot.classList.toggle("is-active", dotIndex === activeFoodSlide);
    dot.setAttribute("aria-selected", String(dotIndex === activeFoodSlide));
  });
}

function restartFoodSlider() {
  clearInterval(foodSlideTimer);
  if (!prefersReducedMotion) {
    foodSlideTimer = setInterval(() => showFoodSlide(activeFoodSlide + 1), 4500);
  }
}

if (foodSlider && foodSlides.length && foodDotsWrap) {
  foodSlides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show cafe food ${index + 1}`);
    dot.addEventListener("click", () => {
      showFoodSlide(index);
      restartFoodSlider();
    });
    foodDotsWrap.append(dot);
  });

  foodSlider.querySelector("[data-food-prev]")?.addEventListener("click", () => {
    showFoodSlide(activeFoodSlide - 1);
    restartFoodSlider();
  });

  foodSlider.querySelector("[data-food-next]")?.addEventListener("click", () => {
    showFoodSlide(activeFoodSlide + 1);
    restartFoodSlider();
  });

  showFoodSlide(0);
  restartFoodSlider();
}

document.querySelectorAll(".gallery-tabs button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll(".gallery-tabs button").forEach((tab) => {
      tab.classList.toggle("is-active", tab === button);
    });
    document.querySelectorAll(".gallery-grid img").forEach((image) => {
      image.classList.toggle("is-hidden", filter !== "all" && image.dataset.kind !== filter);
    });
  });
});

const revealTargets = [
  ...document.querySelectorAll(".section-heading, .partner-strip, .intro-panel, .facility-card, .cafe-copy, .food-slider, .event-feature, .event-list article, .gallery-grid img, .person-card, .visitor-table-wrap, .testimonial-grid figure, .contact-card")
];

revealTargets.forEach((element, index) => {
  element.classList.add("reveal");
  element.style.setProperty("--delay", `${Math.min(index % 8, 5) * 70}ms`);

  if (element.matches(".event-feature, .contact-card, .cafe-copy")) {
    element.dataset.anim = "fade-left";
  }

  if (element.matches(".event-list article, .visitor-table-wrap, .food-slider, .partner-strip")) {
    element.dataset.anim = "fade-right";
  }

  if (element.matches(".gallery-grid img")) {
    element.dataset.anim = "zoom";
  }
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -70px 0px" }
);

if (prefersReducedMotion) {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
} else {
  revealTargets.forEach((element) => revealObserver.observe(element));
}

const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const number = entry.target;
      const finalText = number.dataset.final || number.textContent.trim();
      const match = finalText.match(/^(\d+)(.*)$/);
      if (!match || prefersReducedMotion) {
        number.textContent = finalText;
        statObserver.unobserve(number);
        return;
      }

      const end = Number(match[1]);
      const suffix = match[2];
      const started = performance.now();

      function tick(now) {
        const progress = Math.min((now - started) / 1100, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        number.textContent = `${Math.round(end * eased)}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          number.textContent = finalText;
        }
      }

      requestAnimationFrame(tick);
      statObserver.unobserve(number);
    });
  },
  { threshold: 0.7 }
);

document.querySelectorAll(".quick-details strong").forEach((number) => {
  number.dataset.final = number.textContent.trim();
  number.textContent = "0";
  statObserver.observe(number);
});

document.querySelector(".contact-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const formData = new FormData(form);
  const note = form.querySelector(".form-note");
  const whatsappNumber = "918089934343";
  const message = [
    "New SportiesPark enquiry",
    `Name: ${formData.get("name")}`,
    `Phone: ${formData.get("phone")}`,
    `Interested in: ${formData.get("interest")}`,
    `Message: ${formData.get("message") || "No message added"}`
  ].join("\n");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  if (note) {
    note.textContent = "Opening WhatsApp with your enquiry ready to send.";
  }
  window.open(whatsappUrl, "_blank", "noopener");
  form.reset();
});
