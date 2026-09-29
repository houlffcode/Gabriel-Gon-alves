(() => {
  const root = document.getElementById('home-campaign-video');
  if (!root) return;
  const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  fetch('assets/data/home-video.json?ts='+Date.now()).then(r=>r.json()).then(v=>{
    const id=String(v.videoId||'').trim();
    if(!/^[A-Za-z0-9_-]{6,}$/.test(id)) return;
    root.innerHTML=`<div class="campaign-video-shell reveal"><button class="campaign-video-poster" type="button" aria-label="Reproduzir ${esc(v.title)}" data-video-id="${esc(id)}"><img src="https://i.ytimg.com/vi/${esc(id)}/hqdefault.jpg" alt="Capa do vídeo ${esc(v.title)}" loading="lazy"><span class="campaign-play">▶</span><span class="campaign-short-label">YouTube Shorts</span></button><div class="campaign-video-copy"><span class="eyebrow">${esc(v.eyebrow)}</span><h2>${esc(v.title)}</h2><p class="lead">${esc(v.description)}</p><a class="text-link" href="${esc(v.youtubeUrl)}" target="_blank" rel="noopener noreferrer">Abrir no YouTube</a></div></div>`;
    const button=root.querySelector('[data-video-id]');
    button.addEventListener('click',()=>{
      const iframe=document.createElement('iframe');
      iframe.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0`;
      iframe.title=v.title||'Vídeo da campanha';
      iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen=true;
      iframe.loading='lazy';
      iframe.className='campaign-video-iframe';
      button.replaceWith(iframe);
    });
  }).catch(()=>{});
})();
