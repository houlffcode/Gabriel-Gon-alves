(() => {
  const faq = document.querySelector('.faq');
  if (!faq) return;
  const items = [...faq.querySelectorAll('details')];

  items.forEach(item => {
    const summary = item.querySelector('summary');
    const contentNodes = [...item.children].filter(child => child !== summary);
    if (!summary || !contentNodes.length) return;

    if (!item.querySelector(':scope > .faq-answer')) {
      const answer = document.createElement('div');
      answer.className = 'faq-answer';
      const inner = document.createElement('div');
      inner.className = 'faq-answer-inner';
      contentNodes.forEach(node => inner.appendChild(node));
      answer.appendChild(inner);
      item.appendChild(answer);
    }

    summary.setAttribute('aria-expanded', String(item.open));
    item.addEventListener('toggle', () => {
      summary.setAttribute('aria-expanded', String(item.open));
      if (!item.open) return;
      items.forEach(other => {
        if (other !== item && other.open) other.open = false;
      });
    });
  });
})();
