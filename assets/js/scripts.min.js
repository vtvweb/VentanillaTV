/**
 * Newsup Pro Magazine Theme JavaScript
 */
(function () {
    'use strict';

    // 1. Dark / Light Mode Toggle Logic
    const initThemeToggle = function () {
        const toggleButtons = document.querySelectorAll('.js-theme-toggle');
        if (!toggleButtons.length) return;

        const savedTheme = localStorage.getItem('newsup_theme');
        const docTheme = document.documentElement.getAttribute('data-theme');
        let currentTheme = savedTheme || docTheme || 'light';
        if (currentTheme === 'auto') {
            currentTheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
        }

        const applyTheme = function (theme) {
            document.documentElement.setAttribute('data-theme', theme);
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                if (document.body) document.body.classList.add('dark');
                toggleButtons.forEach(btn => btn.classList.add('is-dark'));
            } else {
                document.documentElement.classList.remove('dark');
                if (document.body) document.body.classList.remove('dark');
                toggleButtons.forEach(btn => btn.classList.remove('is-dark'));
            }
            localStorage.setItem('newsup_theme', theme);
        };

        // Sync initial state
        applyTheme(currentTheme);

        // Enable smooth transitions only after initial paint
        requestAnimationFrame(() => {
            if (document.body) document.body.classList.add('theme-ready');
        });

        toggleButtons.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const active = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                applyTheme(active);
            });
        });
    };

    // 2. Mobile Navigation Drawer & Dropdowns
    const initMobileMenu = function () {
        const toggler = document.querySelector('.js-navbar-toggle');
        const navbar = document.querySelector('.js-navbar-menu');
        const overlay = document.querySelector('.js-menu-overlay');

        const closeBtn = document.querySelector('.js-navbar-close');

        if (toggler && navbar) {
            toggler.addEventListener('click', function () {
                const expanded = toggler.getAttribute('aria-expanded') === 'true';
                toggler.setAttribute('aria-expanded', !expanded);
                navbar.classList.toggle('is-active');
                if (overlay) overlay.classList.toggle('is-active');
                document.body.classList.toggle('menu-opened');
            });

            if (closeBtn) {
                closeBtn.addEventListener('click', function () {
                    toggler.setAttribute('aria-expanded', 'false');
                    navbar.classList.remove('is-active');
                    if (overlay) overlay.classList.remove('is-active');
                    document.body.classList.remove('menu-opened');
                });
            }

            if (overlay) {
                overlay.addEventListener('click', function () {
                    toggler.setAttribute('aria-expanded', 'false');
                    navbar.classList.remove('is-active');
                    if (overlay) overlay.classList.remove('is-active');
                    document.body.classList.remove('menu-opened');
                });
            }

            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && navbar.classList.contains('is-active')) {
                    toggler.setAttribute('aria-expanded', 'false');
                    navbar.classList.remove('is-active');
                    if (overlay) overlay.classList.remove('is-active');
                    document.body.classList.remove('menu-opened');
                }
            });
        }

        // Submenu dropdown toggles on mobile
        const parentItems = document.querySelectorAll('.navbar__menu .has-submenu');
        parentItems.forEach(item => {
            const link = item.querySelector('a');
            if (link && !item.querySelector('.navbar__arrow-btn')) {
                const arrow = document.createElement('button');
                arrow.className = 'navbar__arrow-btn';
                arrow.setAttribute('aria-label', 'Toggle submenu');
                arrow.innerHTML = '<svg width="12" height="12"><use xlink:href="' + (window.publiiAssetsUrl || '') + '/svg/svg-map.svg#chevron-down"></use></svg>';
                link.after(arrow);
                arrow.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    item.classList.toggle('is-open');
                });
            }
        });
    };

    // 3. Search Modal Popup
    const initSearchModal = function () {
        const searchOpeners = document.querySelectorAll('.js-search-toggle');
        const searchModal = document.querySelector('.js-search-modal');
        const searchCloser = document.querySelector('.js-search-close');
        const searchInput = document.querySelector('.js-search-input');

        if (!searchModal) return;

        const openSearch = function () {
            searchModal.classList.add('is-visible');
            document.body.classList.add('search-opened');
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 150);
            }
        };

        const closeSearch = function () {
            searchModal.classList.remove('is-visible');
            document.body.classList.remove('search-opened');
        };

        searchOpeners.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                openSearch();
            });
        });

        if (searchCloser) {
            searchCloser.addEventListener('click', function (e) {
                e.preventDefault();
                closeSearch();
            });
        }

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && searchModal.classList.contains('is-visible')) {
                closeSearch();
            }
        });
    };

    // 4. Sticky Navigation Bar
    const initStickyNav = function () {
        const nav = document.querySelector('.js-sticky-nav');
        if (!nav) return;

        window.addEventListener('scroll', function () {
            const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
            if (currentScroll > 200) {
                nav.classList.add('is-sticky');
            } else {
                nav.classList.remove('is-sticky');
            }
        }, { passive: true });
    };

    // 5. Back to Top Button
    const initBackToTop = function () {
        const bttBtn = document.querySelector('.js-back-to-top');
        if (!bttBtn) return;

        window.addEventListener('scroll', function () {
            if ((window.pageYOffset || document.documentElement.scrollTop) > 350) {
                bttBtn.classList.add('is-visible');
            } else {
                bttBtn.classList.remove('is-visible');
            }
        }, { passive: true });

        bttBtn.addEventListener('click', function (e) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    };

    // 6. Interactive Tab Switching (Sidebar & Widgets)
    const initTabs = function () {
        const tabContainers = document.querySelectorAll('.js-tabs-container');
        tabContainers.forEach(container => {
            const tabButtons = container.querySelectorAll('.js-tab-btn');
            const tabPanes = container.querySelectorAll('.js-tab-pane');

            tabButtons.forEach((btn, index) => {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    tabButtons.forEach(b => b.classList.remove('is-active'));
                    tabPanes.forEach(p => p.classList.remove('is-active'));

                    btn.classList.add('is-active');
                    if (tabPanes[index]) {
                        tabPanes[index].classList.add('is-active');
                    }
                });
            });
        });
    };

    // 7. Responsive Carousels & Sliders (Hero & Editor's Choice)
    const initSliders = function () {
        const sliders = document.querySelectorAll('.js-slider');
        sliders.forEach(slider => {
            const track = slider.querySelector('.js-slider-track');
            const slides = slider.querySelectorAll('.js-slider-slide');
            const prevBtn = slider.querySelector('.js-slider-prev');
            const nextBtn = slider.querySelector('.js-slider-next');

            if (!track || !slides.length) return;

            let currentIndex = 0;
            let slideWidth = slides[0].offsetWidth;
            const isSingle = slider.dataset.perView === '1';

            const updateSlider = function () {
                slideWidth = slides[0].offsetWidth;
                const gap = parseInt(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap || '0', 10) || 0;
                track.style.transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;
            };

            const maxIndex = function () {
                const visibleCount = isSingle ? 1 : Math.max(1, Math.floor(slider.offsetWidth / (slideWidth || 1)));
                return Math.max(0, slides.length - visibleCount);
            };

            if (nextBtn) {
                nextBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (currentIndex < maxIndex()) {
                        currentIndex++;
                    } else {
                        currentIndex = 0;
                    }
                    updateSlider();
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    if (currentIndex > 0) {
                        currentIndex--;
                    } else {
                        currentIndex = maxIndex();
                    }
                    updateSlider();
                });
            }

            if (slider.dataset.autoplay === 'true') {
                setInterval(() => {
                    if (currentIndex < maxIndex()) {
                        currentIndex++;
                    } else {
                        currentIndex = 0;
                    }
                    updateSlider();
                }, 5000);
            }

            window.addEventListener('resize', updateSlider, { passive: true });
        });
    };

    // 8. Copy Link to Clipboard
    const initCopyLink = function () {
        const copyBtns = document.querySelectorAll('.js-copy-link');
        copyBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                const url = window.location.href;
                navigator.clipboard.writeText(url).then(() => {
                    btn.classList.add('is-copied');
                    setTimeout(() => {
                        btn.classList.remove('is-copied');
                    }, 2000);
                });
            });
        });
    };

    // 9. Live Clock / Date in Top Bar
    const initLiveDate = function () {
        const dateEl = document.querySelector('.js-live-date');
        if (!dateEl) return;
        const now = new Date();
        const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        dateEl.textContent = now.toLocaleDateString(undefined, options);
    };

    // 10. Smooth Article / Content Transitions (Zero Layout Shift or Jitter)
    const initPageTransitions = function () {
        const transitionType = document.documentElement.getAttribute('data-page-transition');
        if (!transitionType || transitionType === 'none') return;

        const mainContent = document.querySelectorAll('.post-main-box, .feed-stream, .search-page-content');
        if (!mainContent.length) return;

        // Apply smooth entrance opacity animation
        mainContent.forEach(el => el.classList.add('is-entering'));
        setTimeout(() => {
            mainContent.forEach(el => el.classList.remove('is-entering'));
        }, 250);

        // Reset state on browser back/forward cache restore
        window.addEventListener('pageshow', function () {
            document.body.classList.remove('is-page-exiting');
            mainContent.forEach(el => {
                el.classList.remove('is-exiting');
                el.classList.add('is-entering');
            });
            setTimeout(() => {
                mainContent.forEach(el => el.classList.remove('is-entering'));
            }, 250);
        });

        // Intercept internal navigation clicks
        document.addEventListener('click', function (e) {
            const link = e.target.closest('a');
            if (!link) return;

            // Don't intercept modified clicks (Ctrl, Shift, Cmd, Alt) or non-left clicks
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
                return;
            }

            // Don't intercept target="_blank"
            if (link.getAttribute('target') === '_blank') return;

            // Don't intercept download links
            if (link.hasAttribute('download')) return;

            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                return;
            }

            try {
                const targetUrl = new URL(link.href, window.location.href);
                const currentUrl = new URL(window.location.href);

                // Same page hash anchor
                if (targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search && targetUrl.hash) {
                    return;
                }

                // Check same origin or local preview file://
                const isSameOrigin = (targetUrl.origin === currentUrl.origin) || (currentUrl.origin === 'null' && targetUrl.protocol === 'file:');
                if (!isSameOrigin) return;

                // Trigger exit transition strictly on article content
                e.preventDefault();
                document.body.classList.add('is-page-exiting');
                mainContent.forEach(el => el.classList.add('is-exiting'));

                const styleVal = getComputedStyle(document.documentElement).getPropertyValue('--page-trans-duration');
                const duration = parseInt(styleVal, 10) || 180;

                setTimeout(() => {
                    window.location.href = link.href;
                }, duration);
            } catch (err) {
                // Allow browser default navigation if parsing fails
            }
        });
    };

    // 11. Breaking News Ticker Synchronization & Fallback Hydration
    const initTickerSync = function () {
        const track = document.querySelector('.js-ticker-track');
        if (!track) return;

        const items = track.querySelectorAll('.ticker-item:not([aria-hidden="true"])');
        const STORAGE_KEY = 'vtv_trending_ticker_data';

        if (items.length >= 2) {
            try {
                const data = Array.from(items).map(item => {
                    const a = item.querySelector('a');
                    return {
                        url: a ? a.getAttribute('href') : '#',
                        title: a ? a.textContent.trim() : ''
                    };
                }).filter(item => item.title);
                if (data.length > 0) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                }
            } catch (e) {}
        } else {
            try {
                const saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    const data = JSON.parse(saved);
                    if (Array.isArray(data) && data.length > 0) {
                        const originalHtml = data.map(item => `<div class="ticker-item"><a href="${item.url}">${item.title}</a></div>`).join('');
                        const clonedHtml = data.map(item => `<div class="ticker-item" aria-hidden="true"><a href="${item.url}" tabindex="-1">${item.title}</a></div>`).join('');
                        track.innerHTML = originalHtml + clonedHtml;
                    }
                }
            } catch (e) {}
        }
    };

    // 12. Sticky Mobile Dock Dismissal
    const initStickyAds = function () {
        const stickyAd = document.querySelector('.js-sticky-dock, .js-sticky-mobile-ad');
        const closeBtn = document.querySelector('.js-dock-close, .js-sticky-close');
        if (stickyAd && closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                stickyAd.classList.add('is-hidden');
                setTimeout(function () {
                    stickyAd.style.display = 'none';
                }, 400);
            });
        }
    };

    // Run on DOM ready
    document.addEventListener('DOMContentLoaded', function () {
        initThemeToggle();
        initMobileMenu();
        initSearchModal();
        initStickyNav();
        initBackToTop();
        initTabs();
        initSliders();
        initCopyLink();
        initLiveDate();
        initPageTransitions();
        initTickerSync();
        initStickyAds();
    });
})();
