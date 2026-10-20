/* Renders the project gallery (search, filters, sort) on projects.html,
   featured cards on index.html, and the project detail modal + image lightbox.
   All text goes through I18N (js/i18n.js); a language switch re-renders in place. */

(function () {
    'use strict';
    const data = window.PORTFOLIO;
    if (!data) return;
    const { CATEGORIES, PROJECTS } = data;
    const byId = new Map(PROJECTS.map((p) => [p.id, p]));
    const MAX_CARD_BADGES = 4;

    // i18n helpers — work even if i18n.js failed to load
    const I18N = window.I18N || { lang: 'en', t: (k) => k, pick: (o, f) => o && o[f], onChange() {} };
    const t = (key, vars) => I18N.t(key, vars);
    const pick = (p, field) => I18N.pick(p, field);
    const catLabel = (cat) => (cat ? (I18N.lang === 'tr' && cat.tr) || cat.label : '');

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

    function badgesFor(p) {
        const out = [];
        if (p.studio) out.push(`<span class="card-studio"><i class="fa-solid fa-circle-half-stroke"></i> ${escapeHtml(p.studio)}</span>`);
        if (p.program) out.push(`<span class="card-program"><i class="fa-solid fa-award"></i> ${escapeHtml(p.program)}</span>`);
        return out.length ? `<div class="card-badges">${out.join('')}</div>` : '';
    }

    // Generated cover used when a project has no screenshot (or the image fails to load).
    function generatedCover(p) {
        const cat = CATEGORIES[p.category];
        const icon = cat ? cat.icon : 'fa-cube';
        return `
            <div class="cover-gen" style="--h:${categoryHue(p)}" aria-hidden="true">
                <i class="fa-solid ${escapeHtml(icon)}"></i>
                <span class="cover-gen__title">${escapeHtml(pick(p, 'title'))}</span>
            </div>`;
    }

    function coverImage(src, p) {
        const fit = p.imageFit === 'contain' ? ' is-contain' : '';
        const backdrop = fit ? `<img class="cover-backdrop" src="${escapeHtml(src)}" alt="" aria-hidden="true" />` : '';
        return `
            <div class="cover${fit}" style="--h:${categoryHue(p)}">
                ${backdrop}
                <img class="cover-img" src="${escapeHtml(src)}" alt="${escapeHtml(pick(p, 'title'))}" loading="lazy" data-cover-fallback="${escapeHtml(p.id)}" />
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
        const meta = [pick(p, 'date'), pick(p, 'team')].filter(Boolean).map(escapeHtml).join(' · ');
        const status = pick(p, 'status');
        const title = pick(p, 'title');

        return `
            <article class="card project-card" data-category="${escapeHtml(p.category)}" data-project-id="${escapeHtml(p.id)}">
                <div class="card-media">
                    ${renderMedia(p)}
                    ${cat ? `<span class="category-tag"><i class="fa-solid ${escapeHtml(cat.icon)}"></i> ${escapeHtml(catLabel(cat))}</span>` : ''}
                    ${imgCount > 1 ? `<span class="media-count" title="${escapeHtml(t('card.shots', { n: imgCount }))}"><i class="fa-regular fa-images"></i> ${imgCount}</span>` : ''}
                    ${status ? `<span class="status-tag"><span class="status-dot"></span>${escapeHtml(status)}</span>` : ''}
                </div>
                <div class="card-body">
                    ${badgesFor(p)}
                    <h3>${escapeHtml(title)}</h3>
                    ${meta ? `<div class="card-meta">${meta}</div>` : ''}
                    <p>${escapeHtml(pick(p, 'summary'))}</p>
                    <div class="badge-row">${renderBadges(p.stack, MAX_CARD_BADGES)}</div>
                    <div class="card-footer">
                        <button type="button" class="card-details" data-open-project="${escapeHtml(p.id)}">
                            ${escapeHtml(t('card.details'))} <i class="fa-solid fa-arrow-right"></i>
                        </button>
                        ${p.links?.github ? `<a class="card-code" href="${escapeHtml(p.links.github)}" target="_blank" rel="noopener" aria-label="${escapeHtml(t('card.codeLabel', { title }))}"><i class="fab fa-github"></i> ${escapeHtml(t('card.code'))}</a>` : ''}
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
            [PROJECTS.length, t('stats.projects')],
            [games, t('stats.games')],
            [withProgram, t('stats.programs')],
            [withVisuals, t('stats.visuals')],
        ];
        container.innerHTML = stats.map(([n, label]) =>
            `<div class="stat"><span class="stat__value">${n}</span><span class="stat__label">${escapeHtml(label)}</span></div>`).join('');
    }

    // Gallery state survives language switches
    const state = { filter: 'all', query: '', sort: 'featured' };
    let galleryApply = null;

    function initGallery(gallery) {
        const filters = document.getElementById('projects-filters');
        const search = document.getElementById('project-search');
        const sort = document.getElementById('project-sort');
        const countEl = document.getElementById('projects-count');
        const emptyEl = document.getElementById('projects-empty');
        const order = new Map(PROJECTS.map((p, i) => [p.id, i]));
        let cards = [];
        let searchIndex = new Map();

        // Search matches both languages, so "oyun" and "game" both work
        function buildSearchIndex() {
            searchIndex = new Map(PROJECTS.map((p) => {
                const tr = p.tr || {};
                const cat = CATEGORIES[p.category] || {};
                return [p.id, [
                    p.title, p.summary, p.description, p.program, p.studio, p.date, p.role, p.team, p.status,
                    tr.title, tr.summary, tr.description, tr.role, tr.team, tr.date, tr.status,
                    cat.label, cat.tr, ...(p.stack || []), ...(p.highlights || []), ...(tr.highlights || []),
                ].filter(Boolean).join(' ').toLocaleLowerCase('tr')];
            }));
        }

        function renderCards() {
            gallery.innerHTML = PROJECTS.map(renderProjectCard).join('');
            cards = Array.from(gallery.querySelectorAll('.project-card'));
        }

        function renderFilters() {
            if (!filters) return;
            const counts = PROJECTS.reduce((acc, p) => {
                acc[p.category] = (acc[p.category] || 0) + 1;
                return acc;
            }, {});
            const chip = (key, label, n, icon) => {
                const on = state.filter === key;
                return `<button type="button" class="filter-chip${on ? ' is-active' : ''}" data-filter="${key}" aria-pressed="${on}">${icon ? `<i class="fa-solid ${escapeHtml(icon)}"></i> ` : ''}${escapeHtml(label)} <span class="count">${n}</span></button>`;
            };
            const chips = [chip('all', t('projects.all'), PROJECTS.length)];
            Object.entries(CATEGORIES).forEach(([key, cat]) => {
                if (counts[key]) chips.push(chip(key, catLabel(cat), counts[key], cat.icon));
            });
            filters.innerHTML = chips.join('');
        }

        if (filters) {
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
                state.filter = 'all';
                renderFilters();
                apply();
            });
        }

        function compare(a, b) {
            const pa = byId.get(a.dataset.projectId);
            const pb = byId.get(b.dataset.projectId);
            if (state.sort === 'newest') {
                return (pb.year || 0) - (pa.year || 0) || order.get(pa.id) - order.get(pb.id);
            }
            if (state.sort === 'az') {
                return pick(pa, 'title').localeCompare(pick(pb, 'title'), I18N.lang);
            }
            // "featured": home-page order first, then projects with screenshots, then data order
            const rank = (p) => (p.featured ? 100 - p.featured : 0) + (projectImages(p).length ? 1 : 0);
            return rank(pb) - rank(pa) || order.get(pa.id) - order.get(pb.id);
        }

        function apply() {
            const terms = state.query.split(/\s+/).filter(Boolean);
            let visible = 0;
            cards.sort(compare).forEach((card) => {
                const id = card.dataset.projectId;
                const catOk = state.filter === 'all' || card.dataset.category === state.filter;
                const text = searchIndex.get(id);
                const show = catOk && terms.every((term) => text.includes(term));
                card.hidden = !show;
                if (show) visible++;
                gallery.appendChild(card);
            });
            if (countEl) {
                countEl.textContent = visible === PROJECTS.length
                    ? t('projects.countAll', { n: visible })
                    : t('projects.countSome', { n: visible, total: PROJECTS.length });
            }
            if (emptyEl) emptyEl.hidden = visible !== 0;
        }

        galleryApply = () => { renderCards(); renderFilters(); apply(); };
        buildSearchIndex();
        galleryApply();
    }

    function featuredProjects() {
        return PROJECTS.filter((p) => p.featured).sort((a, b) => a.featured - b.featured).slice(0, 6);
    }

    function renderFeatured(container) {
        container.innerHTML = featuredProjects().map(renderProjectCard).join('')
            || `<div class="empty-state">${escapeHtml(t('card.featuredSoon'))}</div>`;
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
                    <iframe src="${escapeHtml(embed)}" title="${escapeHtml(t('modal.videoTitle'))}" loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen></iframe>
                </div>`;
        }
        if (/\.(mp4|webm|ogg)(\?|$)/i.test(src)) {
            return `<div class="modal-video"><video controls preload="metadata" src="${escapeHtml(src)}"></video></div>`;
        }
        return `<a class="btn btn-secondary" href="${escapeHtml(src)}" target="_blank" rel="noopener"><i class="fa-solid fa-video"></i> ${escapeHtml(t('modal.watch'))}</a>`;
    }

    function renderViewer(p, images) {
        if (!images.length) {
            return `<div class="viewer viewer--empty">${generatedCover(p)}</div>`;
        }
        const fit = p.imageFit === 'contain' ? ' is-contain' : '';
        const title = pick(p, 'title');
        const thumbs = images.length > 1 ? `
            <div class="viewer-thumbs" role="tablist" aria-label="${escapeHtml(t('modal.screenshots'))}">
                ${images.map((src, i) => `
                    <button type="button" class="viewer-thumb${i === 0 ? ' is-active' : ''}" data-viewer-index="${i}"
                            role="tab" aria-selected="${i === 0}" aria-label="${escapeHtml(t('modal.screenshot', { n: i + 1 }))}" data-hide-wrap>
                        <img src="${escapeHtml(src)}" alt="" loading="lazy" data-hide-on-error />
                    </button>`).join('')}
            </div>` : '';
        return `
            <div class="viewer" data-images='${escapeHtml(JSON.stringify(images))}'>
                <button type="button" class="viewer-stage${fit}" data-open-lightbox aria-label="${escapeHtml(t('modal.openFull'))}">
                    <img class="viewer-stage__backdrop" src="${escapeHtml(images[0])}" alt="" aria-hidden="true" />
                    <img class="viewer-stage__img" src="${escapeHtml(images[0])}" alt="${escapeHtml(title)} — ${escapeHtml(t('modal.screenshot', { n: 1 }))}" />
                    <span class="viewer-zoom"><i class="fa-solid fa-expand"></i></span>
                    ${images.length > 1 ? `<span class="viewer-counter"><span data-viewer-current>1</span> / ${images.length}</span>` : ''}
                </button>
                ${thumbs}
            </div>`;
    }

    function linkButtons(p) {
        const l = p.links || {};
        const out = [];
        const btn = (href, icon, key, primary) =>
            `<a class="btn ${primary ? 'btn-primary' : 'btn-secondary'} btn-block" href="${escapeHtml(href)}" target="_blank" rel="noopener"><i class="${icon}"></i> ${escapeHtml(t(key))}</a>`;
        let primaryUsed = false;
        const next = () => { const was = primaryUsed; primaryUsed = true; return !was; };
        if (l.page)   out.push(btn(l.page, 'fa-solid fa-circle-half-stroke', 'modal.page', next()));
        if (l.demo)   out.push(btn(l.demo, p.category === 'web' ? 'fa-solid fa-arrow-up-right-from-square' : 'fa-solid fa-play', p.category === 'web' ? 'modal.site' : 'modal.demo', next()));
        if (l.github) out.push(btn(l.github, 'fab fa-github', 'modal.source', next()));
        if (l.video)  out.push(btn(l.video, 'fa-solid fa-video', 'modal.videoLink', next()));
        if (l.doc)    out.push(btn(l.doc, 'fa-solid fa-file-lines', 'modal.doc', next()));
        return out;
    }

    function renderModalContent(p, nav) {
        const cat = CATEGORIES[p.category];
        const images = projectImages(p);
        const videos = [...new Set([...(p.videos || []), p.links?.video].filter(Boolean))]
            .filter((v) => toEmbedUrl(v) || /\.(mp4|webm|ogg)(\?|$)/i.test(v));

        const text = pick(p, 'details') || pick(p, 'description') || pick(p, 'summary') || '';
        const detailsBody = text.split(/\n{2,}/).map((para) => `<p>${escapeHtml(para).replace(/\n/g, '<br/>')}</p>`).join('');
        const highlights = pick(p, 'highlights') || [];
        const status = pick(p, 'status');

        const info = [
            ['fa-solid fa-user-gear', 'modal.role', pick(p, 'role')],
            ['fa-solid fa-people-group', 'modal.team', pick(p, 'team')],
            ['fa-regular fa-calendar', 'modal.timeline', pick(p, 'date')],
            ['fa-solid fa-signal', 'modal.status', status],
            [`fa-solid ${cat ? cat.icon : 'fa-folder'}`, 'modal.category', catLabel(cat)],
        ].filter(([, , v]) => v).map(([icon, key, v]) => `
            <div class="info-row">
                <dt><i class="${icon}"></i> ${escapeHtml(t(key))}</dt>
                <dd>${escapeHtml(v)}</dd>
            </div>`).join('');

        const links = linkButtons(p);
        const prev = nav.prev ? byId.get(nav.prev) : null;
        const next = nav.next ? byId.get(nav.next) : null;

        return `
            <button class="modal-close" type="button" aria-label="${escapeHtml(t('modal.close'))}">
                <i class="fa-solid fa-xmark"></i>
            </button>

            <header class="modal-header" style="--h:${categoryHue(p)}">
                <div class="modal-kicker">
                    ${cat ? `<span class="modal-cat"><i class="fa-solid ${escapeHtml(cat.icon)}"></i> ${escapeHtml(catLabel(cat))}</span>` : ''}
                    ${p.studio ? `<span class="card-studio"><i class="fa-solid fa-circle-half-stroke"></i> ${escapeHtml(p.studio)}</span>` : ''}
                    ${p.program ? `<span class="card-program"><i class="fa-solid fa-award"></i> ${escapeHtml(p.program)}</span>` : ''}
                    ${status ? `<span class="status-tag status-tag--inline"><span class="status-dot"></span>${escapeHtml(status)}</span>` : ''}
                </div>
                <h2 id="project-modal-title">${escapeHtml(pick(p, 'title'))}</h2>
                <p class="modal-summary">${escapeHtml(pick(p, 'summary') || '')}</p>
            </header>

            <div class="modal-body">
                <div class="modal-main">
                    ${renderViewer(p, images)}

                    <section class="modal-section">
                        <h4>${t('modal.overview')}</h4>
                        <div class="modal-prose">${detailsBody}</div>
                    </section>

                    ${highlights.length ? `
                        <section class="modal-section">
                            <h4>${t('modal.highlights')}</h4>
                            <ul class="highlights">
                                ${highlights.map((h) => `<li><i class="fa-solid fa-check"></i><span>${escapeHtml(h)}</span></li>`).join('')}
                            </ul>
                        </section>` : ''}

                    ${videos.length ? `
                        <section class="modal-section">
                            <h4>${t('modal.video')}</h4>
                            <div class="modal-videos">${videos.map(renderVideo).join('')}</div>
                        </section>` : ''}
                </div>

                <aside class="modal-aside">
                    ${info ? `
                        <section class="aside-card">
                            <h4>${t('modal.info')}</h4>
                            <dl class="info-list">${info}</dl>
                        </section>` : ''}
                    ${(p.stack && p.stack.length) ? `
                        <section class="aside-card">
                            <h4>${t('modal.tech')}</h4>
                            <div class="badge-row">${renderBadges(p.stack)}</div>
                        </section>` : ''}
                    ${links.length ? `<section class="aside-links">${links.join('')}</section>`
                        : `<p class="aside-note"><i class="fa-solid fa-lock"></i> ${escapeHtml(t('modal.private'))}</p>`}
                </aside>
            </div>

            ${(prev || next) ? `
                <footer class="modal-nav">
                    ${prev ? `<button type="button" class="modal-nav__btn" data-nav="${escapeHtml(prev.id)}">
                        <i class="fa-solid fa-arrow-left"></i>
                        <span><small>${escapeHtml(t('modal.prev'))}</small>${escapeHtml(pick(prev, 'title'))}</span>
                    </button>` : '<span></span>'}
                    ${next ? `<button type="button" class="modal-nav__btn modal-nav__btn--next" data-nav="${escapeHtml(next.id)}">
                        <span><small>${escapeHtml(t('modal.next'))}</small>${escapeHtml(pick(next, 'title'))}</span>
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
        if (!viewer || !viewer.dataset.images) return;
        const images = JSON.parse(viewer.dataset.images);
        const i = (index + images.length) % images.length;
        viewer.dataset.current = String(i);
        const stageImg = viewer.querySelector('.viewer-stage__img');
        stageImg.src = images[i];
        stageImg.alt = t('modal.screenshot', { n: i + 1 });
        viewer.querySelector('.viewer-stage__backdrop').src = images[i];
        const counter = viewer.querySelector('[data-viewer-current]');
        if (counter) counter.textContent = String(i + 1);
        viewer.querySelectorAll('.viewer-thumb').forEach((thumb) => {
            const on = Number(thumb.dataset.viewerIndex) === i;
            thumb.classList.toggle('is-active', on);
            thumb.setAttribute('aria-selected', String(on));
            if (on) thumb.scrollIntoView({ block: 'nearest', inline: 'nearest' });
        });
    }

    function pageTitle() {
        const page = document.body.dataset.page;
        return page ? t(`meta.${page}.title`) : document.title;
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
        const keepScroll = opts.keepScroll ? modalCardEl.scrollTop : 0;
        modalCardEl.innerHTML = renderModalContent(project, nav);
        modalEl.hidden = false;
        modalCardEl.scrollTop = keepScroll; // a new project starts at the top
        void modalEl.offsetWidth; // reflow so the opening transition runs
        modalEl.classList.add('is-open');
        document.body.classList.add('modal-open');

        if (document.getElementById('projects-gallery')) {
            history.replaceState(null, '', `${location.pathname}${location.search}#${projectId}`);
        }
        document.title = `${pick(project, 'title')} — Eren Atasun`;

        if (opts.focus === false) return;
        const target = opts.focus === 'nav'
            ? (modalCardEl.querySelector('[data-nav]') || modalCardEl.querySelector('.modal-close'))
            : modalCardEl.querySelector('.modal-close');
        if (target) target.focus({ preventScroll: true });
    }

    function closeModal() {
        if (!modalEl || modalEl.hidden) return;
        modalEl.classList.remove('is-open');
        document.body.classList.remove('modal-open');
        document.title = pageTitle();
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

    function lightboxMarkup() {
        return `
            <button type="button" class="lightbox__close" data-lb="close" aria-label="${escapeHtml(t('lb.close'))}"><i class="fa-solid fa-xmark"></i></button>
            <button type="button" class="lightbox__arrow lightbox__arrow--prev" data-lb="prev" aria-label="${escapeHtml(t('lb.prev'))}"><i class="fa-solid fa-chevron-left"></i></button>
            <figure class="lightbox__figure" data-lb="close">
                <img class="lightbox__img" alt="" />
                <figcaption class="lightbox__counter"></figcaption>
            </figure>
            <button type="button" class="lightbox__arrow lightbox__arrow--next" data-lb="next" aria-label="${escapeHtml(t('lb.next'))}"><i class="fa-solid fa-chevron-right"></i></button>
        `;
    }

    function ensureLightbox() {
        if (lbEl) return;
        lbEl = document.createElement('div');
        lbEl.className = 'lightbox';
        lbEl.setAttribute('role', 'dialog');
        lbEl.setAttribute('aria-modal', 'true');
        lbEl.hidden = true;
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
        const img = lbEl.querySelector('.lightbox__img');
        img.src = lbImages[lbIndex];
        img.alt = t('lb.alt', { n: lbIndex + 1, total: lbImages.length });
        lbEl.querySelector('.lightbox__counter').textContent = `${lbIndex + 1} / ${lbImages.length}`;
        lbEl.classList.toggle('is-single', lbImages.length < 2);
        if (modalCardEl && modalCardEl.querySelector('.viewer')) showViewerImage(lbIndex);
    }

    function openLightbox(images, index) {
        if (!images || !images.length) return;
        ensureLightbox();
        lbEl.innerHTML = lightboxMarkup(); // rebuilt each time so labels follow the language
        lbEl.setAttribute('aria-label', t('lb.label'));
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

    function renderCounts() {
        document.querySelectorAll('[data-project-count]').forEach((el) => { el.textContent = PROJECTS.length; });
        document.querySelectorAll('[data-i18n-count]').forEach((el) => {
            el.textContent = t(el.dataset.i18nCount, { n: PROJECTS.length });
        });
    }

    function renderAll() {
        if (statsEl) renderStats(statsEl);
        if (featuredEl) renderFeatured(featuredEl);
        renderCounts();
    }

    renderAll();
    if (galleryEl) initGallery(galleryEl);
    wireCardOpens(galleryEl);
    wireCardOpens(featuredEl);

    // Language switch: re-render everything in place, keep filters and the open project
    I18N.onChange(() => {
        renderAll();
        if (galleryApply) galleryApply();
        if (currentId && modalEl && !modalEl.hidden) {
            openModal(currentId, { keepNav: true, keepScroll: true, focus: false });
        } else {
            document.title = pageTitle();
        }
    });

    // Deep link: projects.html#<project-id> opens that project
    function openFromHash() {
        if (!galleryEl) return;
        const id = decodeURIComponent(location.hash.slice(1));
        if (byId.has(id) && currentId !== id) openModal(id, { list: visibleIds(galleryEl) });
    }
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
})();
