(() => {
  const button = document.querySelector('.biography-toggle');
  const more = document.getElementById('biography-more');
  if (!button || !more) return;
  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!open));
    more.hidden = open;
    button.querySelector('span').textContent = open ? 'Ler mais' : 'Ler menos';
    button.querySelector('b').textContent = open ? '↓' : '↑';
  });
})();
