/* Renders project gallery + filter chips on projects.html
   and featured project cards on index.html. */

(function () {
    'use strict';
    const data = window.PORTFOLIO;
    if (!data) return;
    const { CATEGORIES, PROJECTS } = data;

    function escapeHtml(str) {
        return String(str || '').replace(/[&<>"']/g, (c) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function renderBadges(stack) {
        return (stack || []).map((s) => `<span class="badge">${escapeHtml(s)}</span>`).join('');
    }

    function renderMedia(p) {
        if (p.image) {
            return `<div class="card-media"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" loading="lazy" /></div>`;
        }
        return `<div class="card-media">// preview coming soon</div>`;
    }

    function renderProjectCard(p) {
        const cat = CATEGORIES[p.category];
        const links = [];
        if (p.links?.github) links.push(`<a href="${escapeHtml(p.links.github)}" target="_blank" rel="noopener"><i class="fab fa-github"></i> Code</a>`);
        if (p.links?.demo)   links.push(`<a href="${escapeHtml(p.links.demo)}" target="_blank" rel="noopener"><i class="fa-solid fa-play"></i> Demo</a>`);
        if (p.links?.video)  links.push(`<a href="${escapeHtml(p.links.video)}" target="_blank" rel="noopener"><i class="fa-solid fa-video"></i> Video</a>`);

        return `
            <article class="card project-card reveal" data-category="${escapeHtml(p.category)}" id="${escapeHtml(p.id)}">
                ${renderMedia(p)}
                ${cat ? `<span class="category-tag">${escapeHtml(cat.label)}</span>` : ''}
                <div class="card-body">
                    ${p.program ? `<span class="card-program"><i class="fa-solid fa-award"></i> ${escapeHtml(p.program)}</span>` : ''}
                    <h3>${escapeHtml(p.title)}</h3>
                    <p>${escapeHtml(p.summary)}</p>
                    <div class="badge-row">${renderBadges(p.stack)}</div>
                    ${links.length ? `<div class="card-footer">${links.join('')}</div>` : ''}
                </div>
            </article>
        `;
    }

    function renderGallery(container) {
        const html = PROJECTS.map(renderProjectCard).join('');
        container.innerHTML = html || `<div class="empty-state">No projects yet — check back soon.</div>`;
    }

    function renderFilters(container, gallery) {
        const counts = PROJECTS.reduce((acc, p) => {
            acc[p.category] = (acc[p.category] || 0) + 1;
            return acc;
        }, {});

        const chips = [`<button class="filter-chip is-active" data-filter="all">All <span class="count">${PROJECTS.length}</span></button>`];
        Object.entries(CATEGORIES).forEach(([key, cat]) => {
            const n = counts[key] || 0;
            if (n === 0) return;
            chips.push(`<button class="filter-chip" data-filter="${key}">${escapeHtml(cat.label)} <span class="count">${n}</span></button>`);
        });
        container.innerHTML = chips.join('');

        container.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-chip');
            if (!btn) return;
            container.querySelectorAll('.filter-chip').forEach((c) => c.classList.remove('is-active'));
            btn.classList.add('is-active');
            const filter = btn.dataset.filter;
            gallery.querySelectorAll('.project-card').forEach((card) => {
                const match = filter === 'all' || card.dataset.category === filter;
                card.style.display = match ? '' : 'none';
            });
        });
    }

    function renderFeatured(container) {
        const featured = PROJECTS.filter((p) => p.featured).slice(0, 3);
        container.innerHTML = featured.map(renderProjectCard).join('')
            || `<div class="empty-state">Featured projects coming soon.</div>`;
    }

    // Mount points
    const gallery = document.getElementById('projects-gallery');
    const filters = document.getElementById('projects-filters');
    const featured = document.getElementById('featured-projects');

    if (gallery) renderGallery(gallery);
    if (filters && gallery) renderFilters(filters, gallery);
    if (featured) renderFeatured(featured);
})();
