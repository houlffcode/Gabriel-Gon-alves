(() => {
  const trigger = document.querySelector('[data-home-video-open]');
  const modal = document.getElementById('home-video-modal');
  const frameHost = modal?.querySelector('[data-home-video-frame]');
  if (!trigger || !modal || !frameHost) return;

  let config = null;
  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('video-modal-open');
    frameHost.innerHTML = '';
    trigger.focus({ preventScroll: true });
  };

  const open = async () => {
    try {
      if (!config) {
        const response = await fetch('assets/data/home-video.json?ts=' + Date.now());
        config = await response.json();
      }
      const id = String(config.videoId || '').trim();
      if (!/^[A-Za-z0-9_-]{6,}$/.test(id)) return;
      frameHost.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&playsinline=1&rel=0" title="Vídeo da campanha" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('video-modal-open');
      modal.querySelector('.home-video-modal-close')?.focus({ preventScroll: true });
    } catch (_) {}
  };

  trigger.addEventListener('click', open);
  modal.querySelector('.home-video-modal-close')?.addEventListener('click', close);
  modal.addEventListener('click', event => { if (event.target === modal) close(); });
  addEventListener('keydown', event => { if (event.key === 'Escape' && modal.classList.contains('open')) close(); });
})();
