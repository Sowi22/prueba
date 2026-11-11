if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const glow = document.querySelector('.cursor-glow');
  let ticking = false;
  let lastX = 0, lastY = 0;

  window.addEventListener('mousemove', (e) => {
    lastX = e.clientX;
    lastY = e.clientY;
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        if (glow) {
          glow.style.setProperty('--mx', lastX + 'px');
          glow.style.setProperty('--my', lastY + 'px');
        }
        ticking = false;
      });
    }
  }, { passive: true });

  document.querySelectorAll('.proc-card, .hero__form').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--sx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--sy', (e.clientY - r.top) + 'px');
    }, { passive: true });
  });
}

const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
}

function wireCarouselDots(trackId, dotsSelector) {
  const track = document.getElementById(trackId);
  const dots = document.querySelectorAll(dotsSelector);
  if (!track || !dots.length) return;
  track.addEventListener('scroll', () => {
    const cards = [...track.children];
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let min = Infinity;
    cards.forEach((card, i) => {
      const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (dist < min) { min = dist; closest = i; }
    });
    dots.forEach((dot, i) => dot.classList.toggle('is-active', i === closest));
  }, { passive: true });
}
wireCarouselDots('procTrack', '#procDots .dot');
wireCarouselDots('trustTrack', '#trustDots .dot');

/* Pequeño "vistazo" automático en el carrusel de credenciales, solo en celular,
   para que la persona entienda que se puede deslizar y hay más información */
const trustTrack = document.getElementById('trustTrack');
if (trustTrack) {
  if ('IntersectionObserver' in window) {
    const peekObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (window.matchMedia('(max-width: 640px)').matches) {
            setTimeout(() => {
              trustTrack.scrollTo({ left: 70, behavior: 'smooth' });
              setTimeout(() => {
                trustTrack.scrollTo({ left: 0, behavior: 'smooth' });
              }, 700);
            }, 500);
          }
          peekObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    peekObserver.observe(trustTrack);
  }
}
