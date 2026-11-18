/* ==========================================================================
   Meridian Eye Institute & Cataract Surgery Center — Core Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initThemeAndRtl();
  initStickyHeader();
  initMobileNav();
  initAppointmentModal();
  initTabs();
  initTestimonialSlider();
  initDoctorFilter();
  initBlogInteractions();
  initAccordions();
  initContactForm();
  initNewsletterForm();
  initQuickTriage();
  initMetricCounters();
  initScrollReveal();
});

/* Scroll-Reveal Micro-Animations */
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;
  const targets = document.querySelectorAll(
    '.bento-tile, .bento-featured, .doctor-card, .blog-card, .contact-hub-card, .prep-guide-card, .habit-row-card, .academic-tile, .dept-flagship-card, .dept-sub-card, .stepper-node, .pillar-col, .numbered-card, .mosaic-card, .governance-step-card, .timetable-card, .specialty-dock__item, .second-opinion-portal, .iol-card, .laser-card, .retina-tile, .glaucoma-stage-card, .exam-protocol-card, .purpose-card, .infra-spec-card, .touchpoint-card, .prep-check-card, .perspective-card'
  );
  targets.forEach((el, idx) => {
    el.classList.add('reveal-item');
    el.style.transitionDelay = `${(idx % 4) * 65}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  targets.forEach(el => observer.observe(el));
}

/* 0. Theme & RTL Direction Toggle */
function initThemeAndRtl() {
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('meridian_theme') || 'light';
  const savedDir = localStorage.getItem('meridian_dir') || 'ltr';

  html.setAttribute('data-theme', savedTheme);
  html.setAttribute('dir', savedDir);

  const rtlButtons = document.querySelectorAll('[data-rtl-toggle]');
  const themeButtons = document.querySelectorAll('[data-theme-toggle]');

  const updateRtlLabels = (dir) => {
    rtlButtons.forEach(btn => {
      const label = btn.querySelector('.rtl-label');
      if (label) label.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      btn.setAttribute('aria-pressed', String(dir === 'rtl'));
    });
  };

  updateRtlLabels(savedDir);

  rtlButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextDir = html.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
      html.setAttribute('dir', nextDir);
      localStorage.setItem('meridian_dir', nextDir);
      updateRtlLabels(nextDir);
    });
  });

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const nextTheme = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', nextTheme);
      localStorage.setItem('meridian_theme', nextTheme);
      btn.setAttribute('aria-pressed', String(nextTheme === 'dark'));
    });
  });
}

/* 1. Sticky Header Scroll Shadow */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* 2. Mobile Navigation Drawer */
function initMobileNav() {
  const toggle = document.getElementById('mobileToggle');
  const drawer = document.getElementById('mobileDrawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    const isOpen = drawer.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* 3. Global Appointment Booking Modal */
function initAppointmentModal() {
  const modal = document.getElementById('appointmentModal');
  if (!modal) return;

  const openers = document.querySelectorAll('[data-open-appointment]');
  const closers = modal.querySelectorAll('[data-close-modal]');
  const form = document.getElementById('modalAppointmentForm');
  const serviceSelect = document.getElementById('modalService');
  const doctorSelect = document.getElementById('modalDoctor');
  const feedback = document.getElementById('modalFormFeedback');

  const openModal = (serviceVal = '', doctorVal = '') => {
    if (serviceSelect && serviceVal) serviceSelect.value = serviceVal;
    if (doctorSelect && doctorVal) doctorSelect.value = doctorVal;
    if (feedback) feedback.classList.remove('is-visible');
    if (form) form.style.display = 'block';
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  };

  openers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const service = btn.getAttribute('data-service') || '';
      const doctor = btn.getAttribute('data-doctor') || '';
      openModal(service, doctor);
    });
  });

  closers.forEach(btn => btn.addEventListener('click', closeModal));
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(form)) {
        const name = form.querySelector('#modalName')?.value.trim() || 'Patient';
        const date = form.querySelector('#modalDate')?.value || 'your requested date';
        if (feedback) {
          feedback.innerHTML = `<strong>Appointment Request Received</strong><br>Thank you, ${escapeHtml(name)}. Our Surgical &amp; OPD Coordinator will confirm your consultation for <strong>${escapeHtml(date)}</strong> within 2 business hours.`;
          feedback.classList.add('is-visible');
        }
        form.reset();
      }
    });
  }
}

/* 4. Reusable Tab Switcher */
function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(container => {
    const buttons = container.querySelectorAll('[data-tab-target]');
    const panels = container.querySelectorAll('[data-tab-panel]');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-tab-target');
        buttons.forEach(b => b.classList.remove('is-active'));
        panels.forEach(p => p.classList.remove('is-active'));
        btn.classList.add('is-active');
        const activePanel = container.querySelector(`[data-tab-panel="${target}"]`);
        if (activePanel) activePanel.classList.add('is-active');
      });
    });
  });
}

/* 5. Testimonial Slider (Home 1) */
function initTestimonialSlider() {
  const slider = document.getElementById('testimonialSlider');
  if (!slider) return;
  const cards = slider.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');
  const indicator = document.getElementById('testimonialIndicator');
  if (!cards.length) return;

  let current = 0;
  const render = () => {
    cards.forEach((card, idx) => {
      card.style.display = idx === current ? 'block' : 'none';
    });
    if (indicator) {
      indicator.textContent = `${current + 1} / ${cards.length}`;
    }
  };

  prevBtn?.addEventListener('click', () => {
    current = (current - 1 + cards.length) % cards.length;
    render();
  });

  nextBtn?.addEventListener('click', () => {
    current = (current + 1) % cards.length;
    render();
  });

  render();
}

/* 6. Doctor Department Filter (Doctors Page) */
function initDoctorFilter() {
  const filterWrap = document.getElementById('doctorFilters');
  const grid = document.getElementById('doctorsGrid');
  if (!filterWrap || !grid) return;

  const buttons = filterWrap.querySelectorAll('[data-filter]');
  const cards = grid.querySelectorAll('[data-dept]');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const dept = btn.getAttribute('data-filter');
      buttons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      cards.forEach(card => {
        const cardDept = card.getAttribute('data-dept');
        card.style.display = (dept === 'all' || cardDept === dept) ? 'flex' : 'none';
      });
    });
  });
}

/* 7. Blog Category Filter & Article Reader Modal */
function initBlogInteractions() {
  const filterWrap = document.getElementById('blogFilters');
  const grid = document.getElementById('blogGrid');

  if (filterWrap && grid) {
    const buttons = filterWrap.querySelectorAll('[data-filter]');
    const cards = grid.querySelectorAll('[data-category]');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-filter');
        buttons.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        cards.forEach(card => {
          card.style.display = (cat === 'all' || card.getAttribute('data-category') === cat) ? 'flex' : 'none';
        });
      });
    });
  }

  const articleModal = document.getElementById('articleModal');
  if (!articleModal) return;

  const titleEl = document.getElementById('articleModalTitle');
  const metaEl = document.getElementById('articleModalMeta');
  const bodyEl = document.getElementById('articleModalBody');

  document.querySelectorAll('[data-open-article]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-open-article');
      const source = document.getElementById(`article-content-${id}`);
      if (!source) return;
      titleEl.textContent = source.getAttribute('data-title') || '';
      metaEl.textContent = source.getAttribute('data-meta') || '';
      bodyEl.innerHTML = source.innerHTML;
      articleModal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  articleModal.querySelectorAll('[data-close-article]').forEach(btn => {
    btn.addEventListener('click', () => {
      articleModal.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  articleModal.addEventListener('click', (e) => {
    if (e.target === articleModal) {
      articleModal.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  });
}

/* 8. FAQ Accordion */
function initAccordions() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const parent = item.closest('.accordion');
      const wasOpen = item.classList.contains('is-open');

      if (parent) {
        parent.querySelectorAll('.accordion-item').forEach(i => i.classList.remove('is-open'));
      }
      if (!wasOpen) {
        item.classList.add('is-open');
      }
    });
  });
}

/* 9. Contact Page Appointment Enquiry Form */
function initContactForm() {
  const form = document.getElementById('contactAppointmentForm');
  const feedback = document.getElementById('contactFormFeedback');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(form)) {
      const name = form.querySelector('#contactName')?.value.trim() || 'Patient';
      const service = form.querySelector('#contactService')?.value || 'Ophthalmology Consultation';
      if (feedback) {
        feedback.innerHTML = `<strong>Enquiry Confirmed</strong><br>Thank you, ${escapeHtml(name)}. Your request for <strong>${escapeHtml(service)}</strong> has been logged. Our patient desk will call you shortly.`;
        feedback.classList.add('is-visible');
      }
      form.reset();
    }
  });
}

/* 10. Newsletter Form */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  const feedback = document.getElementById('newsletterFeedback');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm(form)) {
      if (feedback) {
        feedback.textContent = 'Thank you for subscribing to the Meridian Eye Health Journal.';
        feedback.classList.add('is-visible');
      }
      form.reset();
    }
  });
}

/* 11. Home 1 Quick Triage Bar */
function initQuickTriage() {
  const form = document.getElementById('quickTriageForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const service = document.getElementById('triageService')?.value || '';
    const doctor = document.getElementById('triageDoctor')?.value || '';
    const date = document.getElementById('triageDate')?.value || '';
    const modal = document.getElementById('appointmentModal');
    if (modal) {
      const modalService = document.getElementById('modalService');
      const modalDoctor = document.getElementById('modalDoctor');
      const modalDate = document.getElementById('modalDate');
      if (modalService && service) modalService.value = service;
      if (modalDoctor && doctor) modalDoctor.value = doctor;
      if (modalDate && date) modalDate.value = date;
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  });
}

/* 12. Animated Metric Counters (Home 2) */
function initMetricCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length || !('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const isDecimal = String(target).includes('.');
      const duration = 1200;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const val = target * eased;
        el.textContent = (isDecimal ? val.toFixed(1) : Math.floor(val).toLocaleString()) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
}

/* Shared Form Validation Helper */
function validateForm(form) {
  let valid = true;
  const fields = form.querySelectorAll('[required]');

  fields.forEach(field => {
    const errorEl = field.closest('.form-group')?.querySelector('.form-error');
    let fieldValid = true;

    if (field.type === 'checkbox') {
      fieldValid = field.checked;
    } else if (!field.value.trim()) {
      fieldValid = false;
    } else if (field.type === 'email') {
      fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
    } else if (field.type === 'tel') {
      fieldValid = field.value.replace(/\D/g, '').length >= 7;
    }

    field.classList.toggle('is-invalid', !fieldValid);
    if (errorEl) errorEl.classList.toggle('is-visible', !fieldValid);
    if (!fieldValid) valid = false;
  });

  return valid;
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

