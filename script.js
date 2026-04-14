function toggleMenu(){
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open");
}

// ── Private repo modal ──────────────────────────────────────────
function openPrivateModal() {
    document.getElementById('privateModal').classList.add('active');
}
function closePrivateModal(event) {
    if (!event || event.target === document.getElementById('privateModal')) {
        document.getElementById('privateModal').classList.remove('active');
    }
}

// ── Lightbox ────────────────────────────────────────────────────
let _lbImages = [];
let _lbIndex  = 0;

function openLightbox(title, wrapperEl) {
    _lbImages = wrapperEl.dataset.gallery.split(',').map(s => s.trim());
    _lbIndex  = 0;
    document.getElementById('lightboxTitle').textContent = title;
    _lbRender();
    document.getElementById('lightbox').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
}

function lightboxOverlayClick(event) {
    if (event.target === document.getElementById('lightbox')) closeLightbox();
}

function lightboxStep(dir) {
    const next = _lbIndex + dir;
    if (next < 0 || next >= _lbImages.length) return;
    const img = document.getElementById('lightboxImg');
    img.classList.add('switching');
    setTimeout(() => {
        _lbIndex = next;
        _lbRender();
        img.classList.remove('switching');
    }, 200);
}

function _lbRender() {
    const img     = document.getElementById('lightboxImg');
    const counter = document.getElementById('lightboxCounter');
    const thumbs  = document.getElementById('lightboxThumbs');
    const prev    = document.getElementById('lightboxPrev');
    const next    = document.getElementById('lightboxNext');

    img.src = _lbImages[_lbIndex];
    img.alt = document.getElementById('lightboxTitle').textContent + ' screenshot ' + (_lbIndex + 1);
    counter.textContent = (_lbIndex + 1) + ' / ' + _lbImages.length;
    prev.disabled = _lbIndex === 0;
    next.disabled = _lbIndex === _lbImages.length - 1;

    // Rebuild thumbnails
    thumbs.innerHTML = '';
    _lbImages.forEach((src, i) => {
        const t = document.createElement('img');
        t.className = 'lightbox-thumb' + (i === _lbIndex ? ' active' : '');
        t.src = src;
        t.alt = 'thumb ' + (i + 1);
        t.onclick = () => {
            if (i === _lbIndex) return;
            document.getElementById('lightboxImg').classList.add('switching');
            setTimeout(() => {
                _lbIndex = i;
                _lbRender();
                document.getElementById('lightboxImg').classList.remove('switching');
            }, 200);
        };
        thumbs.appendChild(t);
    });

    // Scroll active thumbnail into view
    setTimeout(() => {
        const active = thumbs.querySelector('.lightbox-thumb.active');
        if (active) active.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
    }, 50);
}

// ── Keyboard navigation ─────────────────────────────────────────
document.addEventListener('keydown', (e) => {
    const lb = document.getElementById('lightbox');
    if (lb.classList.contains('active')) {
        if (e.key === 'ArrowRight') lightboxStep(1);
        if (e.key === 'ArrowLeft')  lightboxStep(-1);
        if (e.key === 'Escape')     closeLightbox();
        return;
    }
    if (e.key === 'Escape') {
        document.getElementById('privateModal').classList.remove('active');
    }
});

// ── Scroll reveal ───────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const siblings = Array.from(entry.target.parentElement.children);
            const idx = siblings.indexOf(entry.target);
            entry.target.style.transitionDelay = `${idx * 80}ms`;
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

