for (const trigger of document.querySelectorAll("[data-panel]")) {
  const panel = document.getElementById(trigger.dataset.panel);
  trigger.addEventListener("click", () => panel.showModal());
}

if (window.matchMedia("(prefers-reduced-motion: no-preference)").matches) {
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("arrive");
      observer.unobserve(entry.target);
    }
  });
  for (const part of document.querySelectorAll(".hero-art, .hero-label > *, main h2, .product-grid article, .works .crop, .brand-imprint, details")) {
    observer.observe(part);
  }
}
