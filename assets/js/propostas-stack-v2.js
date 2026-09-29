(() => {
  const section = document.querySelector('#propostas-detalhadas');
  const cards = [...document.querySelectorAll('#propostas-detalhadas .proposal-story')];
  if (!section || cards.length < 2) return;

  const desktop = window.matchMedia('(min-width: 901px)');
  let raf = 0;

  const update = () => {
    raf = 0;
    if (!desktop.matches) {
      cards.forEach(card => {
        card.style.removeProperty('transform');
        card.classList.remove('stack-covered');
      });
      return;
    }

    cards.forEach((card, index) => {
      const next = cards[index + 1];
      if (!next) {
        card.style.transform = 'translateY(0) scale(1)';
        card.classList.remove('stack-covered');
        return;
      }

      const top = parseFloat(getComputedStyle(card).top) || 94;
      const nextTop = next.getBoundingClientRect().top;
      const progress = Math.min(Math.max((top + 230 - nextTop) / 230, 0), 1);
      const scale = 1 - progress * 0.026;
      const lift = -progress * 8;

      card.style.transform = `translateY(${lift.toFixed(2)}px) scale(${scale.toFixed(4)})`;
      card.classList.toggle('stack-covered', progress > 0.04);
    });
  };

  const schedule = () => {
    if (raf) return;
    raf = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  desktop.addEventListener?.('change', schedule);
  document.fonts?.ready?.then(schedule);
  schedule();
})();
