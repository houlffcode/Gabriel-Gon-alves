(() => {
  const ytEmbed = (id, autoplay = false) => `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?playsinline=1&rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`;
  const valid = id => /^[A-Za-z0-9_-]{6,}$/.test(String(id || ''));
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  const mountHome = () => {
    const root = document.getElementById('home-campaign-video');
    if (!root) return;
    fetch('assets/data/home-video.json?ts=' + Date.now()).then(r => r.json()).then(v => {
      if (!valid(v.videoId)) throw new Error('ID inválido');
      root.innerHTML = `<div class="campaign-video-shell"><div class="campaign-player-wrap"><iframe class="shorts-iframe" src="${ytEmbed(v.videoId)}" title="${esc(v.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div><div class="campaign-video-copy"><span class="eyebrow">${esc(v.eyebrow)}</span><h2>${esc(v.title)}</h2><p class="lead">${esc(v.description)}</p><a class="text-link" href="${esc(v.youtubeUrl)}" target="_blank" rel="noopener noreferrer">Abrir no YouTube</a></div></div>`;
    }).catch(() => {
      root.innerHTML = '<div class="container"><p class="lead">Não foi possível carregar o vídeo agora. Recarregue a página ou abra o conteúdo no YouTube.</p></div>';
    });
  };

  const mountProposals = () => {
    const track = document.getElementById('proposal-video-track');
    if (!track) return;
    fetch('assets/data/propostas-videos.json?ts=' + Date.now()).then(r => r.json()).then(data => {
      track.innerHTML = (data.videos || []).filter(v => valid(v.videoId)).map(v => `<article class="proposal-video-card"><div class="proposal-video-media proposal-video-player"><iframe class="shorts-iframe" src="${ytEmbed(v.videoId)}" title="${esc(v.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><b>${esc(v.platform || 'YouTube Shorts')}</b></div><div class="proposal-video-copy"><span class="eyebrow light">${esc(v.category)}</span><h3>${esc(v.title)}</h3><p>${esc(v.description)}</p><a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">Abrir no YouTube</a></div></article>`).join('');
      if (!track.innerHTML) track.innerHTML = '<p class="proposal-video-loading">Nenhum vídeo configurado.</p>';
    }).catch(() => track.innerHTML = '<p class="proposal-video-loading">Não foi possível carregar os vídeos.</p>');
  };

  mountHome();
  mountProposals();
})();
