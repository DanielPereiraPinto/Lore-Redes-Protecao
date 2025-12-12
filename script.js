// script.js
// Módulo de carrossel em Vanilla JS (responsivo, setas, transições).
// Mobile-first: por padrão exibe 1 slide, ajusta para 2/3 conforme breakpoints.

class Carousel {
  constructor(rootSelector, options = {}) {
    this.root = document.querySelector(rootSelector);
    if (!this.root) throw new Error("Carousel root not found");
    this.track = this.root.querySelector(".carousel__track");
    this.slides = Array.from(this.track.children);
    this.prevBtn = this.root.querySelector(".carousel__nav--prev");
    this.nextBtn = this.root.querySelector(".carousel__nav--next");

    // options
    this.gap = options.gap || 0.7; // rem-ish, CSS handles actual gap
    this.index = 0;
    // responsive breakpoints
    this.breakpoints = options.breakpoints || [
      { width: 0, slidesToShow: 1 },
      { width: 600, slidesToShow: 2 },
      { width: 900, slidesToShow: 3 },
    ];

    this.slidesToShow = 1;
    this.resizeObserver = null;

    this.bindHandlers();
    this.setup();
    this.addEventListeners();
  }

  bindHandlers() {
    this.onPrev = this.onPrev.bind(this);
    this.onNext = this.onNext.bind(this);
    this.onResize = this.onResize.bind(this);
  }

  setup() {
    // initial responsive calculation
    this.updateSlidesToShow();
    // set widths for slides
    this.updateLayout();
    // handle window resize
    window.addEventListener("resize", this.onResize);
    // keyboard support
    this.root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") this.onPrev();
      if (e.key === "ArrowRight") this.onNext();
    });
  }

  addEventListeners() {
    if (this.prevBtn) this.prevBtn.addEventListener("click", this.onPrev);
    if (this.nextBtn) this.nextBtn.addEventListener("click", this.onNext);

    // Make carousel track accessible focusable
    this.root.setAttribute("tabindex", "0");
  }

  updateSlidesToShow() {
    const w = window.innerWidth;
    // get the largest breakpoint <= width
    let show = 1;
    for (const bp of this.breakpoints) {
      if (w >= bp.width) show = bp.slidesToShow;
    }
    this.slidesToShow = show;
  }

  updateLayout() {
    // compute slide width as percentage
    const trackWidth =
      this.track.clientWidth ||
      this.root.querySelector(".carousel__viewport").clientWidth;
    const slidesToShow = this.slidesToShow || 1;
    const slideWidthPct = 100 / slidesToShow;

    // apply inline style to slides so they can shrink/grow responsively
    this.slides.forEach((slide) => {
      slide.style.flex = `0 0 ${slideWidthPct}%`;
      slide.style.maxWidth = `${slideWidthPct}%`;
    });

    // reposition to current index (make sure index is valid)
    this.clampIndex();
    this.updateTrackPosition();
  }

  clampIndex() {
    const maxIndex = Math.max(0, this.slides.length - this.slidesToShow);
    if (this.index > maxIndex) this.index = maxIndex;
    if (this.index < 0) this.index = 0;
  }

  updateTrackPosition() {
    // Move track using transform
    const slideWidthPct = 100 / this.slidesToShow;
    const offsetPct = -(this.index * slideWidthPct);
    this.track.style.transform = `translateX(${offsetPct}%)`;
  }

  onPrev() {
    this.index = Math.max(0, this.index - 1);
    this.updateTrackPosition();
  }

  onNext() {
    const maxIndex = Math.max(0, this.slides.length - this.slidesToShow);
    this.index = Math.min(maxIndex, this.index + 1);
    this.updateTrackPosition();
  }

  onResize() {
    // recalc slidesToShow and layout
    const prev = this.slidesToShow;
    this.updateSlidesToShow();
    if (prev !== this.slidesToShow) {
      this.updateLayout();
    } else {
      // still update sizes to account viewport adjustments
      this.updateLayout();
    }
  }
}

/* Inicialização quando DOM estiver pronto */
document.addEventListener("DOMContentLoaded", function () {
  // inicializa ano no rodapé
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // inicializa carrossel
  try {
    const carousel = new Carousel(".carousel", {
      breakpoints: [
        { width: 0, slidesToShow: 1 },
        { width: 600, slidesToShow: 2 },
        { width: 900, slidesToShow: 3 },
      ],
    });
  } catch (err) {
    // fail silently, mas log para debug
    console.error("Erro ao inicializar carrossel:", err);
  }
});
