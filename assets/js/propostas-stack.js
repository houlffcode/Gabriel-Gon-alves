(() => {
  const cards = [...document.querySelectorAll('#propostas-detalhadas .proposal-story')];
  if (cards.length < 2) return;
  const desktop = matchMedia('(min-width: 901px)');
  let scheduled = false;
  const update = () => {
    scheduled = false;
    if (!desktop.matches) {
      cards.forEach(card => { card.style.removeProperty('transform'); card.classList.remove('stack-behind'); });
      return;
    }
    cards.forEach((card, index) => {
      const next = cards[index + 1];
      if (!next) { card.style.transform = 'scale(1)'; card.classList.remove('stack-behind'); return; }
      const stickyTop = parseFloat(getComputedStyle(card).top) || 104;
      const distance = next.getBoundingClientRect().top - stickyTop;
      const progress = Math.min(Math.max(1 - distance / 230, 0), 1);
      card.style.transform = `translateY(${(-7 * progress).toFixed(2)}px) scale(${(1 - .025 * progress).toFixed(4)})`;
      card.classList.toggle('stack-behind', progress > .08);
    });
  };
  const requestUpdate = () => { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } };
  addEventListener('scroll', requestUpdate, { passive: true });
  addEventListener('resize', requestUpdate, { passive: true });
  desktop.addEventListener?.('change', requestUpdate);
  update();
})();
