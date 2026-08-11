(function(){
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typeof gsap === 'undefined' || reduceMotion) return;

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- hero entrance ---------- */
  var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  heroTl.from('.js-hero', {
    opacity: 0,
    y: 26,
    duration: 0.9,
    stagger: 0.16
  }, 0.15);

  heroTl.from('.js-hero-figure .frame', {
    opacity: 0,
    scale: 0.92,
    rotate: -2,
    duration: 1.1,
    ease: 'power2.out'
  }, 0.35);

  heroTl.from('.js-hero-figure .caption', {
    opacity: 0,
    y: 10,
    duration: 0.6
  }, 0.9);

  /* ---------- punch-card rows: reveal left to right, like a card feeding through a reader ---------- */
  document.querySelectorAll('.punch-row').forEach(function(row){
    gsap.set(row, { transformOrigin: 'left center' });
    gsap.from(row, {
      scaleX: 0,
      duration: 0.9,
      ease: 'steps(16)',
      scrollTrigger: {
        trigger: row,
        start: 'top 90%',
        once: true
      }
    });
  });

  /* ---------- section labels + titles: quiet fade/rise on scroll ---------- */
  document.querySelectorAll('section .section-label').forEach(function(el){
    gsap.from(el, {
      opacity: 0,
      x: -14,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  document.querySelectorAll('section .section-title').forEach(function(el){
    gsap.from(el, {
      opacity: 0,
      y: 22,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true }
    });
  });

  /* ---------- bio paragraphs: gentle sequential rise ---------- */
  gsap.from('.bio p', {
    opacity: 0,
    y: 20,
    duration: 0.7,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.bio p', start: 'top 88%', once: true }
  });

  /* ---------- note cards: staggered reveal, like notes being laid down one by one ---------- */
  gsap.from('.note-card', {
    opacity: 0,
    y: 34,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.notes-grid',
      start: 'top 82%',
      once: true
    }
  });

  /* ---------- quote plaque: engraved reveal ---------- */
  gsap.from('.quote-plaque', {
    opacity: 0,
    scale: 0.96,
    duration: 0.9,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.quote-plaque', start: 'top 85%', once: true }
  });

  gsap.from('.quote-plaque blockquote', {
    opacity: 0,
    y: 14,
    duration: 0.8,
    delay: 0.15,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.quote-plaque', start: 'top 85%', once: true }
  });

  /* ---------- legacy list: sequential line reveal ---------- */
  gsap.from('.legacy-list li', {
    opacity: 0,
    x: -12,
    duration: 0.5,
    stagger: 0.08,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.legacy-list', start: 'top 85%', once: true }
  });

  gsap.from('.legacy > div > p', {
    opacity: 0,
    y: 18,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.legacy-grid', start: 'top 85%', once: true }
  });

})();