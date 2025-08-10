// Nav
let isNavVisible = true;
const navContainer = document.getElementById('navContainer');
const navToggle = document.getElementById('navToggle');
const navItems = document.querySelectorAll('.nav-item');

navToggle.addEventListener('click', () => {
  isNavVisible = !isNavVisible;
  navContainer.classList.toggle('minimized', !isNavVisible);
  navToggle.textContent = isNavVisible ? '☰' : '×';
});

navItems.forEach((item) => {
  item.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = item.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    if (targetSection) {
      targetSection.scrollIntoView({ behavior: 'smooth' });
    }
    navItems.forEach((n) => n.classList.remove('active'));
    item.classList.add('active');
  });
});

window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('section');
  const scrollPos = window.scrollY + 100;
  sections.forEach((section) => {
    const top = section.offsetTop;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    if (scrollPos >= top && scrollPos <= bottom) {
      navItems.forEach((item) => {
        item.classList.toggle('active', item.getAttribute('href') === `#${id}`);
      });
    }
  });
});

// Gallery Slider
class GallerySlider {
  constructor() {
    this.slider = document.getElementById('gallerySlider');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.dotsContainer = document.getElementById('galleryDots');
    this.slides = document.querySelectorAll('.gallery-slide');
    this.currentSlide = 0;
    this.totalSlides = this.slides.length;
    this.init();
  }
  init() {
    this.createDots();
    this.updateSlider();
    this.setupEventListeners();
    this.setupLazyLoading();
  }
  createDots() {
    for (let i = 0; i < this.totalSlides; i += 1) {
      const dot = document.createElement('div');
      dot.classList.add('gallery-dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => this.goToSlide(i));
      this.dotsContainer.appendChild(dot);
    }
  }
  updateSlider() {
    const offset = -this.currentSlide * 100;
    this.slider.style.transform = `translateX(${offset}%)`;
    const dots = this.dotsContainer.querySelectorAll('.gallery-dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === this.currentSlide);
      dot.setAttribute('aria-selected', index === this.currentSlide ? 'true' : 'false');
    });
    this.prevBtn.disabled = this.currentSlide === 0;
    this.nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
    this.loadImagesInSlide(this.currentSlide);
  }
  goToSlide(slideIndex) { this.currentSlide = slideIndex; this.updateSlider(); }
  nextSlide() { if (this.currentSlide < this.totalSlides - 1) { this.currentSlide += 1; this.updateSlider(); } }
  prevSlide() { if (this.currentSlide > 0) { this.currentSlide -= 1; this.updateSlider(); } }
  setupEventListeners() {
    this.nextBtn.addEventListener('click', () => this.nextSlide());
    this.prevBtn.addEventListener('click', () => this.prevSlide());
    document.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') this.prevSlide(); if (e.key === 'ArrowRight') this.nextSlide(); });
    let startX = 0; let endX = 0;
    this.slider.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; });
    this.slider.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX; const diffX = startX - endX;
      if (Math.abs(diffX) > 50) { if (diffX > 0) this.nextSlide(); else this.prevSlide(); }
    });
  }
  setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const bg = img.getAttribute('data-bg');
          if (bg) {
            const loader = new Image();
            loader.onload = () => { img.style.backgroundImage = `url(${bg})`; img.classList.remove('lazy'); };
            loader.src = bg;
            obs.unobserve(img);
          }
        }
      });
    }, { rootMargin: '80px' });
    document.querySelectorAll('.gallery-item.lazy').forEach((img) => imageObserver.observe(img));
    this.loadImagesInSlide(0);
  }
  loadImagesInSlide(slideIndex) {
    const slide = this.slides[slideIndex];
    if (!slide) return;
    slide.querySelectorAll('.gallery-item.lazy').forEach((img) => {
      const bg = img.getAttribute('data-bg');
      if (bg && img.classList.contains('lazy')) {
        const loader = new Image();
        loader.onload = () => { img.style.backgroundImage = `url(${bg})`; img.classList.remove('lazy'); };
        loader.src = bg;
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => { new GallerySlider(); });

// Reveal on scroll
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.style.opacity = '1'; entry.target.style.transform = 'translateY(0)'; }
  });
}, observerOptions);
[...document.querySelectorAll('.service-card, .testimonial')].forEach((el) => {
  el.style.opacity = '0'; el.style.transform = 'translateY(24px)'; el.style.transition = 'all .6s ease'; revealObserver.observe(el);
});

// Booking Modal (only if present)
const bookingModal = document.getElementById('bookingModal');
if (bookingModal) {
  const bookingEmbed = document.getElementById('bookingEmbed');
  const bookingExternal = document.getElementById('bookingExternal');
  const openBookingButtons = [
    document.getElementById('openBooking'),
    document.getElementById('openBookingHero'),
    document.getElementById('openBookingContact')
  ].filter(Boolean);
  const closeBooking = document.getElementById('closeBooking');
  const bookingBackdrop = document.getElementById('bookingBackdrop');
  const BOOKING_URL = 'https://calendly.com/your-salon/30min';
  bookingExternal.href = BOOKING_URL;
  function loadCalendlyEmbed() {
    if (bookingEmbed.dataset.loaded === 'true') return;
    bookingEmbed.dataset.loaded = 'true';
    const widget = document.createElement('div');
    widget.className = 'calendly-inline-widget';
    widget.setAttribute('data-url', BOOKING_URL);
    widget.style.minWidth = '320px';
    widget.style.height = '100%';
    bookingEmbed.appendChild(widget);
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);
  }
  function openBooking() { bookingModal.classList.add('open'); bookingModal.setAttribute('aria-hidden', 'false'); loadCalendlyEmbed(); }
  function closeBookingModal() { bookingModal.classList.remove('open'); bookingModal.setAttribute('aria-hidden', 'true'); }
  openBookingButtons.forEach((btn) => btn.addEventListener('click', (e) => { e.preventDefault(); openBooking(); }));
  closeBooking.addEventListener('click', closeBookingModal);
  bookingBackdrop.addEventListener('click', closeBookingModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && bookingModal.classList.contains('open')) closeBookingModal(); });
}

// Booking page form handling (only if present)
const bookingForm = document.getElementById('bookingForm');
if (bookingForm) {
  const serviceSelect = document.getElementById('service');
  const techSelect = document.getElementById('tech');
  const dateInput = document.getElementById('date');
  const timeInput = document.getElementById('time');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const phoneInput = document.getElementById('phone');
  const notesInput = document.getElementById('notes');
  const summaryBox = document.getElementById('summary');
  const totalPrice = document.getElementById('totalPrice');

  function getSelectedServicePrice() {
    const option = serviceSelect.selectedOptions[0];
    return Number(option?.dataset.price || 0);
  }
  function updateSummary() {
    const serviceText = serviceSelect.selectedOptions[0]?.textContent || '';
    const techText = techSelect.value || 'Random';
    const dateText = dateInput.value || '—';
    const timeText = timeInput.value || '—';
    const price = getSelectedServicePrice();
    totalPrice.textContent = `$${price.toFixed(2)}`;
    summaryBox.innerHTML = `
      <div><strong>Service:</strong> ${serviceText}</div>
      <div><strong>Nail tech:</strong> ${techText}</div>
      <div><strong>Date:</strong> ${dateText}</div>
      <div><strong>Time:</strong> ${timeText}</div>
      <div><strong>Name:</strong> ${nameInput.value}</div>
      <div><strong>Email:</strong> ${emailInput.value}</div>
      <div><strong>Phone:</strong> ${phoneInput.value}</div>
    `;
  }
  ['change','input'].forEach((evt) => {
    [serviceSelect, techSelect, dateInput, timeInput, nameInput, emailInput, phoneInput].forEach((el) => el.addEventListener(evt, updateSummary));
  });
  updateSummary();

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!serviceSelect.value || !dateInput.value || !timeInput.value || !nameInput.value || !emailInput.value) {
      alert('Please complete required fields.');
      return;
    }
    const BOOKING_URL = 'https://calendly.com/your-salon/30min';
    const params = new URLSearchParams({
      name: nameInput.value,
      email: emailInput.value,
      a1: serviceSelect.selectedOptions[0]?.textContent || '',
      a2: techSelect.value || 'Random',
      a3: `${dateInput.value} ${timeInput.value}`,
      a4: phoneInput.value,
      a5: notesInput.value
    });
    window.open(`${BOOKING_URL}?${params.toString()}`, '_blank');
  });
}