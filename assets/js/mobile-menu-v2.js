(() => {
  const button = document.querySelector('.menu-button');
  const nav = document.querySelector('.mobile-nav');
  if (!button || !nav) return;

  const close = () => {
    if (!nav.classList.contains('open')) return;
    nav.classList.add('is-closing');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
    button.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Abrir menu');
    setTimeout(() => nav.classList.remove('is-closing'), 320);
  };

  let startX = 0;
  let startY = 0;
  let moved = false;

  document.addEventListener('touchstart', event => {
    const touch = event.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    moved = false;
  }, { passive: true });

  document.addEventListener('touchmove', event => {
    const touch = event.touches[0];
    if (Math.abs(touch.clientX - startX) > 18 || Math.abs(touch.clientY - startY) > 18) moved = true;
    if (moved) close();
  }, { passive: true });

  let previousScroll = window.scrollY;
  window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY - previousScroll) > 8) close();
    previousScroll = window.scrollY;
  }, { passive: true });

  document.addEventListener('pointerdown', event => {
    if (nav.classList.contains('open') && !nav.contains(event.target) && !button.contains(event.target)) close();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) close();
  }, { passive: true });
})();
