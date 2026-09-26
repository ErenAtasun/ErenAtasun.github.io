/* Renders the project gallery (search, filters, sort) on projects.html,
   featured cards on index.html, and the project detail modal + image lightbox. */

(function () {
    'use strict';
    const data = window.PORTFOLIO;
    if (!data) return;
    const { CATEGORIES, PROJECTS } = data;
    const byId = new Map(PROJECTS.map((p) => [p.id, p]));
    const MAX_CARD_BADGES = 4;

    function escapeHtml(str) {
        return String(str ?? '').replace(/[&<>"']/g, (c) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function renderBadges(stack, limit) {
        const list = stack || [];
        const shown = limit ? list.slice(0, limit) : list;
        const extra = list.length - shown.length;
        return shown.map((s) => `<span class="badge">${escapeHtml(s)}</span>`).join('')
            + (extra > 0 ? `<span class="badge badge--neutral">+${extra}</span>` : '');
    }

    // All images for a project: cover first, then gallery, without duplicates.
    function projectImages(p) {
        return [...new Set([p.image, ...(p.gallery || [])].filter(Boolean))];
    }

    function categoryHue(p) {
        const cat = CATEGORIES[p.category];
        return cat && typeof cat.hue === 'number' ? cat.hue : 265;
    }

    // Generated cover used when a project has no screenshot (or the image fails to load).
    function generatedCover(p) {
        const cat = CATEGORIES[p.category];
        const icon = cat ? cat.icon : 'fa-cube';
        return `
            <div class="cover-gen" style="--h:${categoryHue(p)}" aria-hidden="true">
                <i class="fa-solid ${escapeHtml(icon)}"></i>
                <span class="cover-gen__title">${escapeHtml(p.title)}</span>
            </div>`;
    }

    function coverImage(src, p, extraClass) {
        const fit = p.imageFit === 'contain' ? ' is-contain' : '';
        const backdrop = fit ? `<img class="cover-backdrop" src="${escapeHtml(src)}" alt="" aria-hidden="true" />` : '';
        return `
            <div class="cover${fit} ${extraClass || ''}" style="--h:${categoryHue(p)}">
                ${backdrop}
                <img class="cover-img" src="${escapeHtml(src)}" alt="${escapeHtml(p.title)} screenshot" loading="lazy" data-cover-fallback="${escapeHtml(p.id)}" />
            </div>`;
    }

    function renderMedia(p) {
        return p.image ? coverImage(p.image, p) : generatedCover(p);
    }

    // Replace broken cover images with the generated cover (event delegated, no inline handlers).
    document.addEventListener('error', (e) => {
        const img = e.target;
        if (!(img instanceof HTMLImageElement)) return;
        const id = img.dataset.coverFallback;
        if (id) {
            const cover = img.closest('.cover');
            const p = byId.get(id);
            if (cover && p) cover.outerHTML = generatedCover(p);
            return;
        }
        if (img.dataset.hideOnError !== undefined) {
            const wrap = img.closest('[data-hide-wrap]') || img;
            wrap.remove();
        }
    }, true);

    function renderProjectCard(p) {
        const cat = CATEGORIES[p.category];
        const imgCount = projectImages(p).length;
        const meta = [p.date, p.team].filter(Boolean).map(escapeHtml).join(' · ');

        return `
            <article class="card project-card" data-category="${escapeHtml(p.category)}" data-project-id="${escapeHtml(p.id)}">
                <div class="card-media">
                    ${renderMedia(p)}
                    ${cat ? `<span class="category-tag"><i class="fa-solid ${escapeHtml(cat.icon)}"></i> ${escapeHtml(cat.label)}</span>` : ''}
                    ${imgCount > 1 ? `<span class="media-count" title="${imgCount} screenshots"><i class="fa-regular fa-images"></i> ${imgCount}</span>` : ''}
                </div>
                <div class="card-body">
                    ${p.program ? `<span class="card-program"><i class="fa-solid fa-award"></i> ${escapeHtml(p.program)}</span>` : ''}
                    <h3>${escapeHtml(p.title)}</h3>
                    ${meta ? `<div class="card-meta">${meta}</div>` : ''}
                    <p>${escapeHtml(p.summary)}</p>
                    <div class="badge-row">${renderBadges(p.stack, MAX_CARD_BADGES)}</div>
                    <div class="card-footer">
                        <button type="button" class="card-details" data-open-project="${escapeHtml(p.id)}">
                            View details <i class="fa-solid fa-arrow-right"></i>
                        </button>
                        ${p.links?.github ? `<a class="card-code" href="${escapeHtml(p.links.github)}" target="_blank" rel="noopener" aria-label="${escapeHtml(p.title)} source code on GitHub"><i class="fab fa-github"></i> Code</a>` : ''}
                    </div>
                </div>
            </article>
        `;
    }

    /* ============================================
       Projects page: stats, search, filters, sort
       ============================================ */

    function renderStats(container) {
        const withProgram = PROJECTS.filter((p) => p.program).length;
        const games = PROJECTS.filter((p) => p.category === 'games').length;
        const withVisuals = PROJECTS.filter((p) => projectImages(p).length).length;
        const stats = [
            [PROJECTS.length, 'Projects'],
            [games, 'Games'],
            [withProgram, 'Funded / competition / thesis'],
            [withVisuals, 'With screenshots'],
        ];
        container.innerHTML = stats.map(([n, label]) =>
            `<div class="stat"><span class="stat__value">${n}</span><span class="stat__label">${escapeHtml(label)}</span></div>`).join('');
    }

    function initGallery(gallery) {
        gallery.innerHTML = PROJECTS.map(renderProjectCard).join('');

        const filters = document.getElementById('projects-filters');
        const search = document.getElementById('project-search');
        const sort = document.getElementById('project-sort');
        const countEl = document.getElementById('projects-count');
        const emptyEl = document.getElementById('projects-empty');
        const state = { filter: 'all', query: '', sort: 'featured' };

        const cards = Array.from(gallery.querySelectorAll('.project-card'));
        const searchIndex = new Map(PROJECTS.map((p) => [p.id, [
            p.title, p.summary, p.description, p.program, p.date, p.role, p.team,
            (CATEGORIES[p.category] || {}).label, ...(p.stack || []), ...(p.highlights || []),
        ].filter(Boolean).join(' ').toLocaleLowerCase('tr')]));
        const order = new Map(PROJECTS.map((p, i) => [p.id, i]));

        if (filters) {
            const counts = PROJECTS.reduce((acc, p) => {
                acc[p.category] = (acc[p.category] || 0) + 1;
                return acc;
            }, {});
            const chips = [`<button type="button" class="filter-chip is-active" data-filter="all" aria-pressed="true">All <span class="count">${PROJECTS.length}</span></button>`];
            Object.entries(CATEGORIES).forEach(([key, cat]) => {
                const n = counts[key] || 0;
                if (!n) return;
                chips.push(`<button type="button" class="filter-chip" data-filter="${key}" aria-pressed="false"><i class="fa-solid ${escapeHtml(cat.icon)}"></i> ${escapeHtml(cat.label)} <span class="count">${n}</span></button>`);
            });
            filters.innerHTML = chips.join('');
            filters.addEventListener('click', (e) => {
                const btn = e.target.closest('.filter-chip');
                if (!btn) return;
                state.filter = btn.dataset.filter;
                filters.querySelectorAll('.filter-chip').forEach((c) => {
                    const on = c === btn;
                    c.classList.toggle('is-active', on);
                    c.setAttribute('aria-pressed', String(on));
                });
                apply();
            });
        }

        if (search) {
            search.addEventListener('input', () => {
                state.query = search.value.trim().toLocaleLowerCase('tr');
                apply();
            });
        }
        if (sort) {
            sort.addEventListener('change', () => {
                state.sort = sort.value;
                apply();
            });
        }
        if (emptyEl) {
            emptyEl.addEventListener('click', (e) => {
                if (!e.target.closest('[data-reset-filters]')) return;
                if (search) search.value = '';
                state.query = '';
                const all = filters && filters.querySelector('[data-filter="all"]');
                if (all) all.click(); else apply();
            });
        }

        function compare(a, b) {
            const pa = byId.get(a.dataset.projectId);
            const pb = byId.get(b.dataset.projectId);
            if (state.sort === 'newest') {
                return (pb.year || 0) - (pa.year || 0) || order.get(pa.id) - order.get(pb.id);
            }
            if (state.sort === 'az') return pa.title.localeCompare(pb.title, 'en');
            // "featured": featured first, then projects with screenshots, then data order
            const score = (p) => (p.featured ? 2 : 0) + (projectImages(p).length ? 1 : 0);
            return score(pb) - score(pa) || order.get(pa.id) - order.get(pb.id);
        }

        function apply() {
            const terms = state.query.split(/\s+/).filter(Boolean);
            let visible = 0;
            cards.sort(compare).forEach((card) => {
                const id = card.dataset.projectId;
                const catOk = state.filter === 'all' || card.dataset.category === state.filter;
                const text = searchIndex.get(id);
                const queryOk = terms.every((t) => text.includes(t));
                const show = catOk && queryOk;
                card.hidden = !show;
                if (show) visible++;
                gallery.appendChild(card);
            });
            if (countEl) {
                countEl.textContent = visible === PROJECTS.length
                    ? `Showing all ${visible} projects`
                    : `Showing ${visible} of ${PROJECTS.length} projects`;
            }
            if (emptyEl) emptyEl.hidden = visible !== 0;
        }

        apply();
    }

    function renderFeatured(container) {
        const featured = PROJECTS.filter((p) => p.featured).slice(0, 6);
        container.innerHTML = featured.map(renderProjectCard).join('')
            || `<div class="empty-state">Featured projects coming soon.</div>`;
    }

    /* ============================================
       Project detail modal
       ============================================ */

    // Convert a YouTube / Vimeo / Google Drive URL into an embed URL. Returns null for unknown providers.
    function toEmbedUrl(url) {
        if (!url) return null;
        try {
            const u = new URL(url);
            const host = u.hostname.replace(/^www\./, '');
            if (host === 'youtu.be') {
                const id = u.pathname.slice(1).split('/')[0];
                if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
            }
            if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
                if (u.pathname.startsWith('/embed/')) return url;
                const id = u.searchParams.get('v') || u.pathname.split('/').filter(Boolean)[1];
                if (id) return `https://www.youtube-nocookie.com/embed/${id}`;
            }
            if (host.endsWith('vimeo.com')) {
                const id = u.pathname.split('/').filter(Boolean)[0];
                if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
            }
            if (host === 'drive.google.com') {
                const m = u.pathname.match(/\/file\/d\/([^/]+)/);
                if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
            }
        } catch (_) { /* fall through */ }
        return null;
    }

    function renderVideo(src) {
        const embed = toEmbedUrl(src);
        if (embed) {
            return `
                <div class="modal-video">
                    <iframe src="${escapeHtml(embed)}" title="Project video" loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen></iframe>
                </div>`;
        }
        if (/\.(mp4|webm|ogg)(\?|$)/i.test(src)) {
            return `<div class="modal-video"><video controls preload="metadata" src="${escapeHtml(src)}"></video></div>`;
        }
        return `<a class="btn btn-secondary" href="${escapeHtml(src)}" target="_blank" rel="noopener"><i class="fa-solid fa-video"></i> Watch video</a>`;
    }

    function renderViewer(p, images) {
        if (!images.length) {
            return `<div class="viewer viewer--empty">${generatedCover(p)}</div>`;
        }
        const fit = p.imageFit === 'contain' ? ' is-contain' : '';
        const thumbs = images.length > 1 ? `
            <div class="viewer-thumbs" role="tablist" aria-label="Screenshots">
                ${images.map((src, i) => `
                    <button type="button" class="viewer-thumb${i === 0 ? ' is-active' : ''}" data-viewer-index="${i}"
                            role="tab" aria-selected="${i === 0}" aria-label="Screenshot ${i + 1}" data-hide-wrap>
                        <img src="${escapeHtml(src)}" alt="" loading="lazy" data-hide-on-error />
                    </button>`).join('')}
            </div>` : '';
        return `
            <div class="viewer" data-images='${escapeHtml(JSON.stringify(images))}'>
                <button type="button" class="viewer-stage${fit}" data-open-lightbox aria-label="Open screenshot full screen">
                    <img class="viewer-stage__backdrop" src="${escapeHtml(images[0])}" alt="" aria-hidden="true" />
                    <img class="viewer-stage__img" src="${escapeHtml(images[0])}" alt="${escapeHtml(p.title)} screenshot 1" />
                    <span class="viewer-zoom"><i class="fa-solid fa-expand"></i></span>
                    ${images.length > 1 ? `<span class="viewer-counter"><span data-viewer-current>1</span> / ${images.length}</span>` : ''}
                </button>
                ${thumbs}
            </div>`;
    }

    function linkButtons(p) {
        const l = p.links || {};
        const out = [];
        if (l.github) out.push(`<a class="btn btn-primary btn-block" href="${escapeHtml(l.github)}" target="_blank" rel="noopener"><i class="fab fa-github"></i> View source</a>`);
        if (l.demo)   out.push(`<a class="btn btn-secondary btn-block" href="${escapeHtml(l.demo)}" target="_blank" rel="noopener"><i class="fa-solid fa-play"></i> Play demo</a>`);
        if (l.video)  out.push(`<a class="btn btn-secondary btn-block" href="${escapeHtml(l.video)}" target="_blank" rel="noopener"><i class="fa-solid fa-video"></i> Gameplay video</a>`);
        if (l.doc)    out.push(`<a class="btn btn-secondary btn-block" href="${escapeHtml(l.doc)}" target="_blank" rel="noopener"><i class="fa-solid fa-file-lines"></i> Design document</a>`);
        return out;
    }

    function renderModalContent(p, nav) {
        const cat = CATEGORIES[p.category];
        const images = projectImages(p);
        const videos = [...new Set([...(p.videos || []), p.links?.video].filter(Boolean))]
            .filter((v) => toEmbedUrl(v) || /\.(mp4|webm|ogg)(\?|$)/i.test(v));

        let detailsBody = '';
        if (p.detailsHtml) {
            detailsBody = p.detailsHtml;
        } else {
            const text = p.details || p.description || p.summary || '';
            detailsBody = text.split(/\n{2,}/).map((para) => `<p>${escapeHtml(para).replace(/\n/g, '<br/>')}</p>`).join('');
        }

        const info = [
            ['fa-user-gear', 'Role', p.role],
            ['fa-people-group', 'Team', p.team],
            ['fa-regular fa-calendar', 'Timeline', p.date],
            [cat ? cat.icon : 'fa-folder', 'Category', cat && cat.label],
        ].filter(([, , v]) => v).map(([icon, label, v]) => `
            <div class="info-row">
                <dt><i class="${icon.startsWith('fa-regular') ? icon : 'fa-solid ' + icon}"></i> ${label}</dt>
                <dd>${escapeHtml(v)}</dd>
            </div>`).join('');

        const links = linkButtons(p);
        const prev = nav.prev ? byId.get(nav.prev) : null;
        const next = nav.next ? byId.get(nav.next) : null;

        return `
            <button class="modal-close" type="button" aria-label="Close project details">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <header class="modal-header" style="--h:${categoryHue(p)}">
                <div class="modal-kicker">
                    ${cat ? `<span class="modal-cat"><i class="fa-solid ${escapeHtml(cat.icon)}"></i> ${escapeHtml(cat.label)}</span>` : ''}
                    ${p.program ? `<span class="card-program"><i class="fa-solid fa-award"></i> ${escapeHtml(p.program)}</span>` : ''}
                </div>
                <h2 id="project-modal-title">${escapeHtml(p.title)}</h2>
                <p class="modal-summary">${escapeHtml(p.summary || '')}</p>
            </header>

            <div class="modal-body">
                <div class="modal-main">
                    ${renderViewer(p, images)}

                    <section class="modal-section">
                        <h4>Overview</h4>
                        <div class="modal-prose">${detailsBody}</div>
                    </section>

                    ${(p.highlights && p.highlights.length) ? `
                        <section class="modal-section">
                            <h4>Key highlights</h4>
                            <ul class="highlights">
                                ${p.highlights.map((h) => `<li><i class="fa-solid fa-check"></i><span>${escapeHtml(h)}</span></li>`).join('')}
                            </ul>
                        </section>` : ''}

                    ${videos.length ? `
                        <section class="modal-section">
                            <h4>Video</h4>
                            <div class="modal-videos">${videos.map(renderVideo).join('')}</div>
                        </section>` : ''}
                </div>

                <aside class="modal-aside">
                    ${info ? `
                        <section class="aside-card">
                            <h4>Project info</h4>
                            <dl class="info-list">${info}</dl>
                        </section>` : ''}
                    ${(p.stack && p.stack.length) ? `
                        <section class="aside-card">
                            <h4>Tech &amp; tools</h4>
                            <div class="badge-row">${renderBadges(p.stack)}</div>
                        </section>` : ''}
                    ${links.length ? `<section class="aside-links">${links.join('')}</section>`
                        : `<p class="aside-note"><i class="fa-solid fa-lock"></i> Source is private or not published.</p>`}
                </aside>
            </div>

            ${(prev || next) ? `
                <footer class="modal-nav">
                    ${prev ? `<button type="button" class="modal-nav__btn" data-nav="${escapeHtml(prev.id)}">
                        <i class="fa-solid fa-arrow-left"></i>
                        <span><small>Previous</small>${escapeHtml(prev.title)}</span>
                    </button>` : '<span></span>'}
                    ${next ? `<button type="button" class="modal-nav__btn modal-nav__btn--next" data-nav="${escapeHtml(next.id)}">
                        <span><small>Next</small>${escapeHtml(next.title)}</span>
                        <i class="fa-solid fa-arrow-right"></i>
                    </button>` : ''}
                </footer>` : ''}
        `;
    }

    let modalEl = null;
    let modalCardEl = null;
    let lastFocused = null;
    let navList = [];
    let currentId = null;
    let closeTimer = null;

    function focusables(root) {
        return Array.from(root.querySelectorAll('a[href], button:not([disabled]), iframe, video[controls], input, select, textarea, [tabindex]:not([tabindex="-1"])'))
            .filter((el) => el.offsetParent !== null || el === document.activeElement);
    }

    function trapTab(e, root) {
        if (e.key !== 'Tab') return;
        const els = focusables(root);
        if (!els.length) return;
        const first = els[0];
        const last = els[els.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }

    function ensureModal() {
        if (modalEl) return;
        modalEl = document.createElement('div');
        modalEl.className = 'project-modal';
        modalEl.setAttribute('role', 'dialog');
        modalEl.setAttribute('aria-modal', 'true');
        modalEl.setAttribute('aria-labelledby', 'project-modal-title');
        modalEl.hidden = true;
        modalEl.innerHTML = `
            <div class="project-modal__backdrop" data-modal-close></div>
            <div class="project-modal__card"></div>
        `;
        document.body.appendChild(modalEl);
        modalCardEl = modalEl.querySelector('.project-modal__card');

        modalEl.addEventListener('click', (e) => {
            if (e.target.closest('[data-modal-close]') || e.target.closest('.modal-close')) {
                closeModal();
                return;
            }
            const navBtn = e.target.closest('[data-nav]');
            if (navBtn) { openModal(navBtn.dataset.nav, { keepNav: true, focus: 'nav' }); return; }

            const thumb = e.target.closest('[data-viewer-index]');
            if (thumb) { showViewerImage(Number(thumb.dataset.viewerIndex)); return; }

            if (e.target.closest('[data-open-lightbox]')) {
                const viewer = modalCardEl.querySelector('.viewer');
                openLightbox(JSON.parse(viewer.dataset.images), Number(viewer.dataset.current || 0));
            }
        });

        modalEl.addEventListener('keydown', (e) => trapTab(e, modalCardEl));
    }

    function showViewerImage(index) {
        const viewer = modalCardEl.querySelector('.viewer');
        if (!viewer) return;
        const images = JSON.parse(viewer.dataset.images);
        const i = (index + images.length) % images.length;
        viewer.dataset.current = String(i);
        viewer.querySelector('.viewer-stage__img').src = images[i];
        viewer.querySelector('.viewer-stage__img').alt = `Screenshot ${i + 1}`;
        viewer.querySelector('.viewer-stage__backdrop').src = images[i];
        const counter = viewer.querySelector('[data-viewer-current]');
        if (counter) counter.textContent = String(i + 1);
        viewer.querySelectorAll('.viewer-thumb').forEach((t) => {
            const on = Number(t.dataset.viewerIndex) === i;
            t.classList.toggle('is-active', on);
            t.setAttribute('aria-selected', String(on));
            if (on) t.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        });
    }

    function openModal(projectId, opts = {}) {
        const project = byId.get(projectId);
        if (!project) return;
        ensureModal();
        clearTimeout(closeTimer);

        if (!opts.keepNav) navList = opts.list || [projectId];
        const idx = navList.indexOf(projectId);
        const nav = {
            prev: idx > 0 ? navList[idx - 1] : null,
            next: idx >= 0 && idx < navList.length - 1 ? navList[idx + 1] : null,
        };

        const wasOpen = !modalEl.hidden;
        if (!wasOpen) lastFocused = document.activeElement;
        currentId = projectId;
        modalCardEl.innerHTML = renderModalContent(project, nav);
        modalEl.hidden = false;
        modalCardEl.scrollTop = 0; // new project starts at the top, not where the previous one was scrolled
        // Force reflow so the opening transition runs
        void modalEl.offsetWidth;
        modalEl.classList.add('is-open');
        document.body.classList.add('modal-open');

        if (document.getElementById('projects-gallery')) {
            history.replaceState(null, '', `#${projectId}`);
        }
        document.title = `${project.title} — Eren Atasun`;

        const target = opts.focus === 'nav'
            ? (modalCardEl.querySelector(`[data-nav]`) || modalCardEl.querySelector('.modal-close'))
            : modalCardEl.querySelector('.modal-close');
        if (target) target.focus({ preventScroll: true });
    }

    const baseTitle = document.title;

    function closeModal() {
        if (!modalEl || modalEl.hidden) return;
        modalEl.classList.remove('is-open');
        document.body.classList.remove('modal-open');
        document.title = baseTitle;
        if (location.hash && byId.has(location.hash.slice(1))) {
            history.replaceState(null, '', location.pathname + location.search);
        }
        closeTimer = setTimeout(() => {
            modalEl.hidden = true;
            modalCardEl.innerHTML = ''; // stops playing iframes/videos
        }, 200);
        currentId = null;
        if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus({ preventScroll: true });
    }

    /* ============================================
       Lightbox (full-screen screenshots)
       ============================================ */
    let lbEl = null;
    let lbImages = [];
    let lbIndex = 0;
    let lbReturnFocus = null;

    function ensureLightbox() {
        if (lbEl) return;
        lbEl = document.createElement('div');
        lbEl.className = 'lightbox';
        lbEl.setAttribute('role', 'dialog');
        lbEl.setAttribute('aria-modal', 'true');
        lbEl.setAttribute('aria-label', 'Screenshot viewer');
        lbEl.hidden = true;
        lbEl.innerHTML = `
            <button type="button" class="lightbox__close" data-lb="close" aria-label="Close viewer"><i class="fa-solid fa-xmark"></i></button>
            <button type="button" class="lightbox__arrow lightbox__arrow--prev" data-lb="prev" aria-label="Previous screenshot"><i class="fa-solid fa-chevron-left"></i></button>
            <figure class="lightbox__figure" data-lb="close">
                <img class="lightbox__img" alt="" />
                <figcaption class="lightbox__counter"></figcaption>
            </figure>
            <button type="button" class="lightbox__arrow lightbox__arrow--next" data-lb="next" aria-label="Next screenshot"><i class="fa-solid fa-chevron-right"></i></button>
        `;
        document.body.appendChild(lbEl);
        lbEl.addEventListener('click', (e) => {
            if (e.target.classList.contains('lightbox__img')) return;
            const action = e.target.closest('[data-lb]');
            if (!action) return;
            const a = action.dataset.lb;
            if (a === 'close') closeLightbox();
            else lbShow(lbIndex + (a === 'next' ? 1 : -1));
        });
        lbEl.addEventListener('keydown', (e) => trapTab(e, lbEl));
    }

    function lbShow(i) {
        lbIndex = (i + lbImages.length) % lbImages.length;
        lbEl.querySelector('.lightbox__img').src = lbImages[lbIndex];
        lbEl.querySelector('.lightbox__img').alt = `Screenshot ${lbIndex + 1} of ${lbImages.length}`;
        lbEl.querySelector('.lightbox__counter').textContent = `${lbIndex + 1} / ${lbImages.length}`;
        lbEl.classList.toggle('is-single', lbImages.length < 2);
        if (modalCardEl && modalCardEl.querySelector('.viewer')) showViewerImage(lbIndex);
    }

    function openLightbox(images, index) {
        if (!images || !images.length) return;
        ensureLightbox();
        lbImages = images;
        lbReturnFocus = document.activeElement;
        lbEl.hidden = false;
        lbShow(index || 0);
        lbEl.querySelector('.lightbox__close').focus();
    }

    function closeLightbox() {
        if (!lbEl || lbEl.hidden) return;
        lbEl.hidden = true;
        if (lbReturnFocus) lbReturnFocus.focus({ preventScroll: true });
    }

    /* ============================================
       Keyboard + wiring
       ============================================ */
    document.addEventListener('keydown', (e) => {
        const tag = (e.target.tagName || '').toLowerCase();
        const typing = tag === 'input' || tag === 'textarea' || tag === 'select';
        if (lbEl && !lbEl.hidden) {
            if (e.key === 'Escape') { e.preventDefault(); closeLightbox(); }
            else if (e.key === 'ArrowRight') lbShow(lbIndex + 1);
            else if (e.key === 'ArrowLeft') lbShow(lbIndex - 1);
            return;
        }
        if (!modalEl || modalEl.hidden || typing) return;
        if (e.key === 'Escape') { e.preventDefault(); closeModal(); }
        else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
            const btn = modalCardEl.querySelector(e.key === 'ArrowRight' ? '.modal-nav__btn--next' : '.modal-nav__btn:not(.modal-nav__btn--next)');
            if (btn) openModal(btn.dataset.nav, { keepNav: true, focus: 'nav' });
        }
    });

    function visibleIds(container) {
        return Array.from(container.querySelectorAll('.project-card:not([hidden])')).map((c) => c.dataset.projectId);
    }

    function wireCardOpens(container) {
        if (!container) return;
        container.addEventListener('click', (e) => {
            if (e.target.closest('a')) return; // Code link etc. keep their own behaviour
            const card = e.target.closest('.project-card');
            if (!card) return;
            // Let people select text on the card without opening the modal
            if (String(window.getSelection && window.getSelection()).length) return;
            openModal(card.dataset.projectId, { list: visibleIds(container) });
        });
    }

    // Mount points
    const galleryEl = document.getElementById('projects-gallery');
    const featuredEl = document.getElementById('featured-projects');
    const statsEl = document.getElementById('projects-stats');

    if (statsEl) renderStats(statsEl);
    if (galleryEl) initGallery(galleryEl);
    if (featuredEl) renderFeatured(featuredEl);
    document.querySelectorAll('[data-project-count]').forEach((el) => { el.textContent = PROJECTS.length; });

    wireCardOpens(galleryEl);
    wireCardOpens(featuredEl);

    // Deep link: projects.html#<project-id> opens that project
    function openFromHash() {
        if (!galleryEl) return;
        const id = decodeURIComponent(location.hash.slice(1));
        if (byId.has(id) && currentId !== id) openModal(id, { list: visibleIds(galleryEl) });
    }
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
})();
