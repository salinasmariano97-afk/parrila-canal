/* =================================================================
   Parrilla del Canal — script.js
   Mejoras: rAF en parallax, defensivo ante elementos faltantes,
   respeta prefers-reduced-motion.
   ================================================================= */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ===== NAV SCROLL ===== */
const nav = document.querySelector('.nav');
if (nav) {
  const handleScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* ===== HAMBURGER MENU ===== */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ===== PARALLAX HERO con requestAnimationFrame =====
   Mejora vs. versión anterior: no causa jank en mobile.
   Se desactiva si el usuario prefiere reducir movimiento. */
const heroBg = document.querySelector('.hero-bg');
if (heroBg && !prefersReducedMotion) {
  let ticking = false;
  let lastScroll = 0;

  const updateParallax = () => {
    if (lastScroll < window.innerHeight) {
      heroBg.style.transform = `translateY(${lastScroll * 0.3}px)`;
    }
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    lastScroll = window.scrollY;
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

/* ===== INTERSECTION OBSERVER — FADE UP ===== */
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  const observer = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
} else {
  // Fallback: mostrar todo de una sin animación
  document.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));
}

/* ===== WHATSAPP LINK BUILDER =====
   Punto único de configuración. Cuando vendas a un cliente real,
   cambiá WA_NUMBER y WA_MSG y listo. */
const WA_NUMBER = '2901548298';
const WA_MSG = encodeURIComponent(
  'Hola! Quisiera reservar una mesa en Parrilla del Canal. ' +
  'Somos [cantidad] personas, para el día [fecha] a las [hora]. Gracias!'
);
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

document.querySelectorAll('[data-wa]').forEach(el => {
  el.href = WA_URL;
  el.target = '_blank';
  el.rel = 'noopener noreferrer';
});

/* ===== AÑO FOOTER ===== */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();
