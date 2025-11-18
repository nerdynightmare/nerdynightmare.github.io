// Slider and modal behavior for Gothic site
document.addEventListener('DOMContentLoaded', () => {
  // initialize sliders on page: each .slideshow is independent
  document.querySelectorAll('.slideshow').forEach(initSlider);

  // modal gallery
  const modal = document.getElementById('gallery-modal');
  const modalClose = document.getElementById('modal-close');
  const modalSlider = document.getElementById('modal-slider');

  if (modal && modalClose && modalSlider) {
    document.querySelectorAll('.thumb').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.dataset.index, 10) - 1;
        openModalAt(idx);
      });
    });
    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  }

  // age gate for NSFW page
  const confirmBtn = document.getElementById('confirm-age');
  const nsfwFrame = document.getElementById('nsfw-frame');
  if (confirmBtn && nsfwFrame) {
    confirmBtn.addEventListener('click', () => {
      nsfwFrame.classList.remove('hidden');
      document.getElementById('age-gate').classList.add('hidden');
      // initialize nsfw slider
      const nsfwSlider = document.getElementById('nsfw-slider');
      if (nsfwSlider) initSlider(nsfwSlider);
    });
  }

  function initSlider(el) {
    // el may be .slideshow element or slider container
    if (el.tagName !== 'DIV') el = el;
    const slides = Array.from(el.querySelectorAll('.slide'));
    if (!slides.length) return;
    let current = 0;
    slides.forEach((s, i) => { s.dataset.index = i; s.classList.remove('active'); });
    slides[0].classList.add('active');

    // find nav buttons targeting this slider
    const parent = el.closest('.slideshow-frame') || document;
    const prev = parent.querySelector('.nav.prev[data-target]') || document.querySelector('.nav.prev[data-target="' + el.id + '"]');
    const next = parent.querySelector('.nav.next[data-target]') || document.querySelector('.nav.next[data-target="' + el.id + '"]');
    if (prev) prev.addEventListener('click', () => goTo(current - 1));
    if (next) next.addEventListener('click', () => goTo(current + 1));

    // autoplay
    let interval = setInterval(() => goTo(current + 1), 5000);
    el.addEventListener('mouseenter', () => clearInterval(interval));
    el.addEventListener('mouseleave', () => interval = setInterval(() => goTo(current + 1), 5000));

    function goTo(idx) {
      if (idx < 0) idx = slides.length - 1;
      if (idx >= slides.length) idx = 0;
      slides[current].classList.remove('active');
      slides[idx].classList.add('active');
      current = idx;
    }
  }

  // Modal control functions
  function openModalAt(index) {
    if (!modal) return;
    modal.classList.add('show');
    // set active slide in modal-slider
    const slides = Array.from(modal.querySelectorAll('.slide'));
    slides.forEach(s => s.classList.remove('active'));
    if (slides[index]) slides[index].classList.add('active');
    // wire prev/next inside modal
    modal.querySelectorAll('.nav.prev, .nav.next').forEach(btn => {
      btn.addEventListener('click', () => {
        const cur = slides.findIndex(s => s.classList.contains('active'));
        if (btn.classList.contains('prev')) {
          slides[cur].classList.remove('active');
          const nxt = cur - 1 < 0 ? slides.length - 1 : cur - 1;
          slides[nxt].classList.add('active');
        } else {
          slides[cur].classList.remove('active');
          const nxt = cur + 1 >= slides.length ? 0 : cur + 1;
          slides[nxt].classList.add('active');
        }
      });
    });
  }
  function closeModal() { if (modal) modal.classList.remove('show'); }
});
