/* Site-wide interactions: nav toggle, active link + scrollspy, header state, scroll reveal */

(function () {
    'use strict';

    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav-toggle');
    const links = document.querySelector('.nav-links');

    // Mobile nav toggle
    function setMenu(open) {
        if (!toggle || !links) return;
        links.classList.toggle('is-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        const icon = toggle.querySelector('i');
        if (icon) icon.className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
    }
    if (toggle && links) {
        toggle.addEventListener('click', () => setMenu(!links.classList.contains('is-open')));
        links.addEventListener('click', (e) => {
            if (e.target.closest('a')) setMenu(false);
        });
        document.addEventListener('click', (e) => {
            if (links.classList.contains('is-open') && !e.target.closest('.site-header')) setMenu(false);
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && links.classList.contains('is-open')) {
                setMenu(false);
                toggle.focus();
            }
        });
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) setMenu(false);
        });
    }

    // Active nav link. GitHub Pages also serves clean URLs (/projects), so normalise the page name.
    const page = (window.location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
    const navAnchors = Array.from(document.querySelectorAll('.nav-links a'));
    function setActive(match) {
        navAnchors.forEach((a) => {
            const on = match(a.getAttribute('href') || '');
            a.classList.toggle('active', on);
            if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
        });
    }

    if (page === 'index') {
        // Scrollspy: highlight the nav item for the section in view.
        // Sections without their own nav item map to the closest one.
        const sectionToHref = {
            about: 'index.html#about', education: 'index.html#about',
            skills: 'index.html#skills', featured: 'projects.html',
            experience: 'index.html#experience', community: 'index.html#experience',
            contact: 'index.html#contact',
        };
        const sections = Object.keys(sectionToHref)
            .map((id) => document.getElementById(id))
            .filter(Boolean);

        const updateSpy = () => {
            const line = window.scrollY + window.innerHeight * 0.35;
            let current = null;
            sections.forEach((s) => { if (s.offsetTop <= line) current = s.id; });
            // At the very bottom, the last section wins even if it is short
            if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
                current = sections.length ? sections[sections.length - 1].id : current;
            }
            const href = current ? sectionToHref[current] : 'index.html';
            setActive((h) => h === href);
        };
        updateSpy();
        window.addEventListener('scroll', updateSpy, { passive: true });
    } else {
        setActive((h) => !h.includes('#') && h.replace(/\.html$/, '') === page);
    }

    // Header shadow once the page is scrolled
    if (header) {
        const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
    }

    // Lightweight scroll reveal — adds .is-visible to .reveal elements
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach((el) => io.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    }

    // Footer year
    const yearEl = document.getElementById('footer-year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
