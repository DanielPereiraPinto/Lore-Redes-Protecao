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
    this.gap = options.gap || 0.8; // rem-ish, CSS handles actual gap
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
    this.currentOffset = 0;
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
    const viewport = this.root.querySelector(".carousel__viewport");

    this.viewportWidth = viewport.clientWidth;
    this.slideWidth = this.viewportWidth / this.slidesToShow;

    this.slides.forEach((slide) => {
      slide.style.flex = `0 0 ${this.slideWidth}px`;
      slide.style.maxWidth = `${this.slideWidth}px`;
    });

    // cálculo correto do limite
    const totalSlides = this.slides.length;
    const totalTrackWidth = totalSlides * this.slideWidth;

    this.maxOffset = Math.max(0, totalTrackWidth - this.viewportWidth);

    if (this.currentOffset > this.maxOffset) {
      this.currentOffset = this.maxOffset;
    }

    this.updateTrackPosition();
  }

  clampIndex() {
    const viewport = this.root.querySelector(".carousel__viewport");
    const slideWidth = viewport.clientWidth / this.slidesToShow;
    const maxOffset = this.track.scrollWidth - viewport.clientWidth;

    const currentOffset = this.index * slideWidth;

    if (currentOffset > maxOffset) {
      this.index = Math.floor(maxOffset / slideWidth);
    }

    if (this.index < 0) this.index = 0;
  }

  updateTrackPosition() {
    this.track.style.transform = `translateX(-${this.currentOffset}px)`;
  }

  onPrev() {
    this.currentOffset -= this.slideWidth;

    if (this.currentOffset < 0) {
      this.currentOffset = 0;
    }

    this.updateTrackPosition();
  }

  onNext() {
    this.currentOffset += this.slideWidth;

    if (this.currentOffset > this.maxOffset) {
      this.currentOffset = this.maxOffset;
    }

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
