(() => {
  const link = document.querySelector('[data-whatsapp-group]');
  if (!link) return;
  fetch('assets/data/social-links.json?ts=' + Date.now())
    .then(response => response.json())
    .then(data => {
      const url = String(data.whatsappGroupUrl || '').trim();
      if (/^https:\/\/(chat\.)?whatsapp\.com\//i.test(url)) {
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.classList.remove('channel-unavailable');
        link.removeAttribute('aria-disabled');
        const small = link.querySelector('small');
        if (small) small.textContent = 'Entrar no grupo oficial';
      }
    })
    .catch(() => {});
})();
