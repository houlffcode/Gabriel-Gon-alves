
const header=document.querySelector('.header');const progress=document.querySelector('.progress');const menuButton=document.querySelector('.menu-button');const mobileNav=document.querySelector('.mobile-nav');
function onScroll(){if(header)header.classList.toggle('scrolled',scrollY>16);if(progress){const h=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${h>0?scrollY/h:0})`}}addEventListener('scroll',onScroll,{passive:true});onScroll();
if(menuButton){menuButton.addEventListener('click',()=>{const open=mobileNav.classList.toggle('open');document.body.classList.toggle('menu-open',open);menuButton.setAttribute('aria-expanded',String(open));menuButton.classList.toggle('is-open',open);menuButton.setAttribute('aria-label',open?'Fechar menu':'Abrir menu')})}
document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click',()=>{mobileNav.classList.remove('open');document.body.classList.remove('menu-open')}));
const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
document.querySelectorAll('[data-modal]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.modal;document.getElementById(id)?.classList.add('open');document.body.classList.add('menu-open')}));
document.querySelectorAll('.modal-backdrop').forEach(bg=>{bg.addEventListener('click',e=>{if(e.target===bg||e.target.closest('.modal-close')){bg.classList.remove('open');document.body.classList.remove('menu-open')}})});addEventListener('keydown',e=>{if(e.key==='Escape'){document.querySelectorAll('.modal-backdrop.open').forEach(x=>x.classList.remove('open'));document.body.classList.remove('menu-open')}});


document.querySelectorAll('[data-carousel-next]').forEach(button=>button.addEventListener('click',()=>{const el=document.getElementById(button.dataset.carouselNext);if(el)el.scrollBy({left:el.clientWidth*.82,behavior:'smooth'})}));
document.querySelectorAll('[data-carousel-prev]').forEach(button=>button.addEventListener('click',()=>{const el=document.getElementById(button.dataset.carouselPrev);if(el)el.scrollBy({left:-el.clientWidth*.82,behavior:'smooth'})}));
const lightbox=document.getElementById('lightbox');if(lightbox){const image=lightbox.querySelector('img');document.querySelectorAll('[data-lightbox]').forEach(button=>button.addEventListener('click',()=>{image.src=button.dataset.lightbox;lightbox.classList.add('open');lightbox.setAttribute('aria-hidden','false');document.body.classList.add('menu-open')}));const closeLightbox=()=>{lightbox.classList.remove('open');lightbox.setAttribute('aria-hidden','true');document.body.classList.remove('menu-open')};lightbox.addEventListener('click',e=>{if(e.target===lightbox||e.target.closest('.lightbox-close'))closeLightbox()});addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()})}


document.querySelectorAll('[data-gallery-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-gallery-filter]').forEach(x=>x.classList.remove('active'));button.classList.add('active');const filter=button.dataset.galleryFilter;document.querySelectorAll('[data-gallery-category]').forEach(item=>item.classList.toggle('hidden',filter!=='all'&&item.dataset.galleryCategory!==filter))}));
const galleryLightbox=document.getElementById('lightbox');if(galleryLightbox){let currentGalleryIndex=0;const galleryItems=[...document.querySelectorAll('[data-lightbox]')];const galleryImage=galleryLightbox.querySelector('img');const showGalleryImage=index=>{const visible=galleryItems.filter(item=>!item.classList.contains('hidden'));if(!visible.length)return;currentGalleryIndex=(index+visible.length)%visible.length;galleryImage.src=visible[currentGalleryIndex].dataset.lightbox};galleryItems.forEach(item=>item.addEventListener('click',()=>{const visible=galleryItems.filter(x=>!x.classList.contains('hidden'));showGalleryImage(visible.indexOf(item))}));galleryLightbox.querySelector('.lightbox-prev')?.addEventListener('click',e=>{e.stopPropagation();showGalleryImage(currentGalleryIndex-1)});galleryLightbox.querySelector('.lightbox-next')?.addEventListener('click',e=>{e.stopPropagation();showGalleryImage(currentGalleryIndex+1)})}


document.querySelectorAll('[data-agenda-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-agenda-filter]').forEach(x=>x.classList.remove('active'));button.classList.add('active');const filter=button.dataset.agendaFilter;document.querySelectorAll('[data-agenda-category]').forEach(item=>item.classList.toggle('hidden',filter!=='all'&&item.dataset.agendaCategory!==filter))}));
document.querySelectorAll('[data-copy-event]').forEach(button=>button.addEventListener('click',async()=>{const original=button.textContent;try{await navigator.clipboard.writeText(button.dataset.copyEvent);button.textContent='Informações copiadas';setTimeout(()=>button.textContent=original,1800)}catch{button.textContent='Copie manualmente';setTimeout(()=>button.textContent=original,1800)}}));

/* Atualizacao incremental: a camada escura da capa aparece durante o scroll. */
(() => {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const runtimeStyle = document.createElement('style');
    runtimeStyle.dataset.feature = 'hero-overlay-on-scroll';
    runtimeStyle.textContent = `
        .hero::after {
            opacity: var(--hero-overlay-opacity, 0) !important;
            transition: opacity 80ms linear;
            pointer-events: none;
        }

        @media (prefers-reduced-motion: reduce) {
            .hero::after {
                transition: none;
            }
        }
    `;
    document.head.appendChild(runtimeStyle);

    let frameRequested = false;

    const updateHeroOverlay = () => {
        const heroHeight = Math.max(hero.offsetHeight, 1);
        const fadeDistance = Math.min(Math.max(heroHeight * 0.48, 280), 520);
        const progress = Math.min(Math.max(window.scrollY / fadeDistance, 0), 1);
        const easedProgress = progress * progress * (3 - 2 * progress);

        hero.style.setProperty('--hero-overlay-opacity', easedProgress.toFixed(3));
        frameRequested = false;
    };

    const requestOverlayUpdate = () => {
        if (frameRequested) return;
        frameRequested = true;
        window.requestAnimationFrame(updateHeroOverlay);
    };

    window.addEventListener('scroll', requestOverlayUpdate, { passive: true });
    window.addEventListener('resize', requestOverlayUpdate, { passive: true });
    updateHeroOverlay();
})();
