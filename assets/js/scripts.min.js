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
            document.querySelectorAll('.site-logo img').forEach(img => {
                const isFooter = img.closest('.mg-footer-widget-area');
                const base = img.src.split('#')[0];
                if (theme === 'dark' || isFooter) {
                    if (!img.src.includes('#dark')) img.src = base + '#dark';
                } else {
                    if (img.src.includes('#dark')) img.src = base;
                }
            });
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

            window.addEventListener('resize', function () {
                if (window.innerWidth > 1024 && navbar.classList.contains('is-active')) {
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

        if (!searchModal) return;

        const openSearch = function () {
            searchModal.classList.add('is-visible');
            searchModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('search-opened');
            document.documentElement.classList.add('no-scroll');
            const input = searchModal.querySelector('input[type="search"], .search__input, .search-modal__input, input[type="text"]');
            if (input) {
                setTimeout(() => input.focus(), 120);
            }
        };

        const closeSearch = function () {
            searchModal.classList.remove('is-visible');
            searchModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('search-opened');
            document.documentElement.classList.remove('no-scroll');
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

        searchModal.addEventListener('click', function (e) {
            if (e.target === searchModal) {
                closeSearch();
            }
        });

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

    // 7. Responsive Carousels & Sliders (Hero & Editor's Choice with Touch/Mouse Flick Support)
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

            const getGap = function () {
                return parseInt(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap || '0', 10) || 0;
            };

            const maxIndex = function () {
                const visibleCount = isSingle ? 1 : Math.max(1, Math.floor(slider.offsetWidth / (slideWidth || 1)));
                return Math.max(0, slides.length - visibleCount);
            };

            const updateSlider = function (withTransition = true) {
                slideWidth = slides[0].offsetWidth;
                const gap = getGap();
                if (withTransition) {
                    track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                } else {
                    track.style.transition = 'none';
                }
                track.style.transform = `translateX(-${currentIndex * (slideWidth + gap)}px)`;
            };

            const goToNext = function () {
                if (currentIndex < maxIndex()) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateSlider();
            };

            const goToPrev = function () {
                if (currentIndex > 0) {
                    currentIndex--;
                } else {
                    currentIndex = maxIndex();
                }
                updateSlider();
            };

            if (nextBtn) {
                nextBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    goToNext();
                    resetAutoplayTimer();
                });
            }

            if (prevBtn) {
                prevBtn.addEventListener('click', function (e) {
                    e.preventDefault();
                    goToPrev();
                    resetAutoplayTimer();
                });
            }

            // Keyboard navigation (ArrowLeft / ArrowRight)
            slider.setAttribute('tabindex', '0');
            slider.addEventListener('keydown', function (e) {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    goToNext();
                    resetAutoplayTimer();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    goToPrev();
                    resetAutoplayTimer();
                }
            });

            // Autoplay with pause on hover/focus and timer reset
            let autoplayInterval = null;
            let isPaused = false;

            const startAutoplay = function () {
                if (slider.dataset.autoplay !== 'true') return;
                stopAutoplay();
                autoplayInterval = setInterval(() => {
                    if (!isPaused) {
                        goToNext();
                    }
                }, 8000);
            };

            const stopAutoplay = function () {
                if (autoplayInterval) {
                    clearInterval(autoplayInterval);
                    autoplayInterval = null;
                }
            };

            const resetAutoplayTimer = function () {
                stopAutoplay();
                startAutoplay();
            };

            if (slider.dataset.autoplay === 'true') {
                startAutoplay();

                slider.addEventListener('mouseenter', () => { isPaused = true; });
                slider.addEventListener('mouseleave', () => { isPaused = false; });
                slider.addEventListener('focusin',    () => { isPaused = true; });
                slider.addEventListener('focusout',   () => { isPaused = false; });
            }

            // Only enable flick/drag gesture if more than one slide exists
            if (slides.length > 1) {
                let startX = 0;
                let startY = 0;
                let currentX = 0;
                let currentY = 0;
                let isPointerDown = false;
                let isDragging = false;
                let suppressClick = false;
                let startTime = 0;
                let lastX = 0;
                let lastTime = 0;
                let velocityX = 0;
                let pointerType = 'mouse';

                const onPointerDown = function (e) {
                    if (e.pointerType === 'mouse' && e.button !== 0) return;
                    if (e.target.closest('.slider-btn')) return;

                    pointerType = e.pointerType || 'mouse';
                    isPointerDown = true;
                    isDragging = false;
                    suppressClick = false;
                    startX = e.clientX;
                    startY = e.clientY;
                    currentX = e.clientX;
                    currentY = e.clientY;
                    lastX = e.clientX;
                    startTime = Date.now();
                    lastTime = startTime;
                    velocityX = 0;
                    isPaused = true;
                };

                const onPointerMove = function (e) {
                    if (!isPointerDown) return;

                    currentX = e.clientX;
                    currentY = e.clientY;
                    const deltaX = currentX - startX;
                    const deltaY = currentY - startY;

                    const now = Date.now();
                    const dt = now - lastTime;
                    if (dt > 10) {
                        velocityX = (currentX - lastX) / dt;
                        lastX = currentX;
                        lastTime = now;
                    }

                    if (!isDragging) {
                        // Allow vertical page scrolling on touch devices if movement is vertical
                        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
                            isPointerDown = false;
                            isPaused = false;
                            return;
                        }

                        // Robust threshold: 22px for mouse, 16px for touch so clicks never get accidentally blocked
                        const threshold = (pointerType === 'mouse') ? 22 : 16;
                        if (Math.abs(deltaX) > threshold) {
                            isDragging = true;
                            suppressClick = true;
                            slider.classList.add('is-dragging');
                            try {
                                slider.setPointerCapture(e.pointerId);
                            } catch (err) {}
                        }
                    }

                    if (isDragging) {
                        if (e.cancelable) e.preventDefault();
                        slideWidth = slides[0].offsetWidth;
                        const gap = getGap();
                        const baseOffset = -currentIndex * (slideWidth + gap);

                        // Elastic resistance when dragging beyond edge slides
                        let effectiveDeltaX = deltaX;
                        if ((currentIndex === 0 && deltaX > 0) || (currentIndex === maxIndex() && deltaX < 0)) {
                            effectiveDeltaX = deltaX * 0.35;
                        }

                        track.style.transition = 'none';
                        track.style.transform = `translateX(${baseOffset + effectiveDeltaX}px)`;
                    }
                };

                const onPointerUp = function (e) {
                    if (!isPointerDown) return;
                    isPointerDown = false;

                    if (isDragging) {
                        slider.classList.remove('is-dragging');
                        try {
                            slider.releasePointerCapture(e.pointerId);
                        } catch (err) {}

                        const deltaX = currentX - startX;
                        const duration = Date.now() - startTime;
                        slideWidth = slides[0].offsetWidth;

                        // Flick condition: either quick velocity (>0.28 px/ms) or distance > 15% of width
                        const isFlick = (Math.abs(velocityX) > 0.28 && duration < 450) || Math.abs(deltaX) > (slideWidth * 0.15);

                        if (isFlick) {
                            if (deltaX < 0 || velocityX < -0.28) {
                                goToNext();
                            } else {
                                goToPrev();
                            }
                        } else {
                            updateSlider(true);
                        }

                        resetAutoplayTimer();

                        // Suppress click immediately following drag
                        setTimeout(() => {
                            suppressClick = false;
                            isDragging = false;
                        }, 120);
                    } else {
                        // Regular tap / click without drag: allow immediate link navigation
                        suppressClick = false;
                        isDragging = false;

                        // If user clicked background of hero card (not an <a> tag directly), navigate to article
                        if (!e.target.closest('a') && !e.target.closest('button')) {
                            const activeSlide = slides[currentIndex];
                            const link = activeSlide ? activeSlide.querySelector('.hero-content h2 a, .hero-content h3 a') : null;
                            if (link && link.href) {
                                link.click();
                            }
                        }
                    }

                    isPaused = false;
                };

                const onPointerCancel = function () {
                    isPointerDown = false;
                    isDragging = false;
                    suppressClick = false;
                    slider.classList.remove('is-dragging');
                    updateSlider(true);
                    isPaused = false;
                };

                // Suppress click on card links only if user was genuinely dragging/swiping
                slider.addEventListener('click', function (e) {
                    if (suppressClick) {
                        e.preventDefault();
                        e.stopPropagation();
                    }
                }, true);

                // Prevent native image/link dragghost
                slider.addEventListener('dragstart', function (e) {
                    e.preventDefault();
                });

                // Attach pointer listeners for mobile touch & desktop mouse flick
                slider.addEventListener('pointerdown', onPointerDown, { passive: true });
                slider.addEventListener('pointermove', onPointerMove);
                slider.addEventListener('pointerup', onPointerUp);
                slider.addEventListener('pointercancel', onPointerCancel);
            }

            window.addEventListener('resize', () => updateSlider(false), { passive: true });
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

    // 12. Sticky Dock Dismissal & Footer Intersection Auto-Hide
    const initStickyAds = function () {
        const stickyAd = document.querySelector('.js-sticky-dock, .js-sticky-mobile-ad');
        if (!stickyAd) return;

        const closeBtn = stickyAd.querySelector('.js-dock-close, .js-sticky-close') || document.querySelector('.js-dock-close, .js-sticky-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                stickyAd.classList.add('is-hidden');
                document.body.classList.add('dock-dismissed');
                setTimeout(function () {
                    stickyAd.style.display = 'none';
                }, 400);
            });
        }

        // Auto-recede when approaching the footer so footer content is never obscured
        const footer = document.querySelector('footer');
        if (footer && 'IntersectionObserver' in window) {
            const footerObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        stickyAd.classList.add('is-dock-receded');
                        document.body.classList.add('dock-at-footer');
                    } else {
                        stickyAd.classList.remove('is-dock-receded');
                        document.body.classList.remove('dock-at-footer');
                    }
                });
            }, {
                root: null,
                threshold: 0.05
            });
            footerObserver.observe(footer);
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
