/* ===================================================================
   SCROLL: barra de avance, casos en horizontal, parallax del destino
   =================================================================== */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scrollBar = document.querySelector('.scroll-progress');
  const casesSection = document.getElementById('casos');
  const casesTrack = document.getElementById('casesTrack');
  const tourSection = document.getElementById('turismo-medico');
  const tourBg = document.getElementById('tourBg');
  let casesDist = 0;

  function measureCases() {
    if (!casesSection || !casesTrack) return;
    casesDist = Math.max(0, casesTrack.scrollWidth - window.innerWidth);
    const pinH = casesSection.querySelector('.cases__pin').offsetHeight;
    casesSection.style.setProperty('--cases-h', (casesDist + pinH) + 'px');
  }

  function onScroll() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    if (scrollBar) scrollBar.style.setProperty('--sp', max > 0 ? (window.scrollY / max).toFixed(4) : 0);

    if (casesSection && casesTrack) {
      const rect = casesSection.getBoundingClientRect();
      const total = casesSection.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      casesTrack.style.setProperty('--cases-x', (-p * casesDist).toFixed(1) + 'px');
      casesSection.style.setProperty('--cases-p', p.toFixed(4));
    }

    if (tourSection && tourBg && !reduceMotion) {
      const r = tourSection.getBoundingClientRect();
      const progress = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      tourBg.style.setProperty('--tour-y', ((progress - 0.5) * -90).toFixed(1) + 'px');
    }
  }

  let scrollTick = false;
  window.addEventListener('scroll', function () {
    if (!scrollTick) {
      scrollTick = true;
      requestAnimationFrame(function () { onScroll(); scrollTick = false; });
    }
  }, { passive: true });
  window.addEventListener('resize', function () { measureCases(); onScroll(); });
  window.addEventListener('load', function () { measureCases(); onScroll(); });
  measureCases();
  onScroll();

  /* Pase de abordar: se inclina y brilla donde está el mouse */
  const pass = document.getElementById('boardingPass');
  if (pass && window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
    pass.addEventListener('mousemove', function (e) {
      const r = pass.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      pass.style.setProperty('--rx', ((x - 0.5) * 10).toFixed(2) + 'deg');
      pass.style.setProperty('--ry', ((0.5 - y) * 8).toFixed(2) + 'deg');
      pass.style.setProperty('--px', (x * 100).toFixed(1) + '%');
      pass.style.setProperty('--py', (y * 100).toFixed(1) + '%');
    }, { passive: true });
    pass.addEventListener('mouseleave', function () {
      pass.style.setProperty('--rx', '0deg');
      pass.style.setProperty('--ry', '0deg');
    });
  }

  /* Los videos de los casos solo se reproducen cuando están a la vista */
  const caseVideos = document.querySelectorAll('.case-card video');
  if (caseVideos.length && 'IntersectionObserver' in window) {
    const vo = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.play().catch(function () {}); } else { en.target.pause(); } });
    }, { threshold: 0.4 });
    caseVideos.forEach(function (v) { vo.observe(v); });
  }
})();
