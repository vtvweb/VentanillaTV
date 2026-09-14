/**
 * Newsup Pro Magazine Theme JavaScript - 2016 Legacy Compatible Edition
 * Compatible with Firefox 44+, Chrome 45+, Android 5.0+ WebView, Safari 9+
 */
(function () {
    'use strict';

    // --- 2016-Era DOM & JavaScript Polyfills ---
    if (typeof window !== 'undefined') {
        // 1. NodeList & HTMLCollection .forEach (fixes TypeError: toggleButtons.forEach is not a function)
        var _NodeList = (typeof window !== 'undefined' && window.NodeList) || (typeof NodeList !== 'undefined' ? NodeList : null);
        if (_NodeList && _NodeList.prototype && !_NodeList.prototype.forEach) {
            _NodeList.prototype.forEach = Array.prototype.forEach;
        }
        var _HTMLCollection = (typeof window !== 'undefined' && window.HTMLCollection) || (typeof HTMLCollection !== 'undefined' ? HTMLCollection : null);
        if (_HTMLCollection && _HTMLCollection.prototype && !_HTMLCollection.prototype.forEach) {
            _HTMLCollection.prototype.forEach = Array.prototype.forEach;
        }

        // 2. Element.prototype.matches & Element.prototype.closest
        if (window.Element && !Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.msMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function (s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s);
                    var i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {}
                    return i > -1;
                };
        }
        if (window.Element && !Element.prototype.closest) {
            Element.prototype.closest = function (s) {
                var el = this;
                do {
                    if (el.matches && el.matches(s)) return el;
                    el = el.parentElement || el.parentNode;
                } while (el !== null && el.nodeType === 1);
                return null;
            };
        }

        // 3. Element.prototype.after fallback
        if (window.Element && !Element.prototype.after) {
            Element.prototype.after = function () {
                var parent = this.parentNode;
                if (!parent) return;
                for (var i = 0; i < arguments.length; i++) {
                    var node = arguments[i];
                    if (typeof node === 'string') {
                        node = document.createTextNode(node);
                    }
                    parent.insertBefore(node, this.nextSibling);
                }
            };
        }
    }

    // Helper: Convert array-like to Array safely without Array.from
    var toArray = function (list) {
        if (!list) return [];
        return Array.prototype.slice.call(list);
    };

    // 1. Dark / Light Mode Toggle Logic
    var initThemeToggle = function () {
        var toggleButtons = document.querySelectorAll('.js-theme-toggle');
        if (!toggleButtons.length) return;

        var savedTheme = localStorage.getItem('newsup_theme');
        var docTheme = document.documentElement.getAttribute('data-theme');
        var currentTheme = savedTheme || docTheme || 'light';
        if (currentTheme === 'auto') {
            currentTheme = (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
        }

        var applyTheme = function (theme) {
            document.documentElement.setAttribute('data-theme', theme);
            if (theme === 'dark') {
                document.documentElement.classList.add('dark');
                if (document.body) document.body.classList.add('dark');
                toggleButtons.forEach(function (btn) {
                    btn.classList.add('is-dark');
                });
            } else {
                document.documentElement.classList.remove('dark');
                if (document.body) document.body.classList.remove('dark');
                toggleButtons.forEach(function (btn) {
                    btn.classList.remove('is-dark');
                });
            }

            try {
                localStorage.setItem('newsup_theme', theme);
            } catch (e) {}
        };

        // Sync initial state
        applyTheme(currentTheme);

        // Enable smooth transitions only after initial paint
        var raf = window.requestAnimationFrame || function (cb) { setTimeout(cb, 16); };
        raf(function () {
            if (document.body) document.body.classList.add('theme-ready');
        });

        toggleButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var active = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
                applyTheme(active);
            });
        });
    };

    // 2. Mobile Navigation Drawer & Dropdowns
    var initMobileMenu = function () {
        var toggler = document.querySelector('.js-navbar-toggle');
        var navbar = document.querySelector('.js-navbar-menu');
        var overlay = document.querySelector('.js-menu-overlay');
        var closeBtn = document.querySelector('.js-navbar-close');

        if (toggler && navbar) {
            toggler.addEventListener('click', function () {
                var expanded = toggler.getAttribute('aria-expanded') === 'true';
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
                var key = e.key || e.keyCode;
                if ((key === 'Escape' || key === 27) && navbar.classList.contains('is-active')) {
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
        var parentItems = document.querySelectorAll('.navbar__menu .has-submenu');
        parentItems.forEach(function (item) {
            var link = item.querySelector('a');
            if (link && !item.querySelector('.navbar__arrow-btn')) {
                var arrow = document.createElement('button');
                arrow.className = 'navbar__arrow-btn';
                arrow.setAttribute('aria-label', 'Toggle submenu');
                arrow.innerHTML = '<svg width="12" height="12"><use xlink:href="' + (window.publiiAssetsUrl || '') + '/svg/svg-map.svg#chevron-down"></use></svg>';
                
                // Safe DOM insertion fallback for older browsers without Element.prototype.after
                if (link.parentNode) {
                    link.parentNode.insertBefore(arrow, link.nextSibling);
                } else if (link.after) {
                    link.after(arrow);
                }

                arrow.addEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    item.classList.toggle('is-open');
                });
            }
        });
    };

    // 3. Search Modal Popup
    var initSearchModal = function () {
        var searchOpeners = document.querySelectorAll('.js-search-toggle');
        var searchModal = document.querySelector('.js-search-modal');
        var searchCloser = document.querySelector('.js-search-close');

        if (!searchModal) return;

        var openSearch = function () {
            searchModal.classList.add('is-visible');
            searchModal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('search-opened');
            document.documentElement.classList.add('no-scroll');
            var input = searchModal.querySelector('input[type="search"], .search__input, .search-modal__input, input[type="text"]');
            if (input) {
                setTimeout(function () { input.focus(); }, 120);
            }
        };

        var closeSearch = function () {
            searchModal.classList.remove('is-visible');
            searchModal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('search-opened');
            document.documentElement.classList.remove('no-scroll');
        };

        searchOpeners.forEach(function (btn) {
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
            var key = e.key || e.keyCode;
            if ((key === 'Escape' || key === 27) && searchModal.classList.contains('is-visible')) {
                closeSearch();
            }
        });
    };

    // 4. Sticky Navigation Bar
    var initStickyNav = function () {
        var nav = document.querySelector('.js-sticky-nav');
        if (!nav) return;

        window.addEventListener('scroll', function () {
            var currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
            if (currentScroll > 200) {
                nav.classList.add('is-sticky');
            } else {
                nav.classList.remove('is-sticky');
            }
        });
    };

    // 5. Back to Top Button
    var initBackToTop = function () {
        var bttBtn = document.querySelector('.js-back-to-top');
        if (!bttBtn) return;

        window.addEventListener('scroll', function () {
            var currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
            if (currentScroll > 350) {
                bttBtn.classList.add('is-visible');
            } else {
                bttBtn.classList.remove('is-visible');
            }
        });

        bttBtn.addEventListener('click', function (e) {
            e.preventDefault();
            try {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (err) {
                window.scrollTo(0, 0);
            }
        });
    };

    // 6. Interactive Tab Switching (Sidebar & Widgets)
    var initTabs = function () {
        var tabContainers = document.querySelectorAll('.js-tabs-container');
        tabContainers.forEach(function (container) {
            var tabButtons = container.querySelectorAll('.js-tab-btn');
            var tabPanes = container.querySelectorAll('.js-tab-pane');

            tabButtons.forEach(function (btn, index) {
                btn.addEventListener('click', function (e) {
                    e.preventDefault();
                    tabButtons.forEach(function (b) { b.classList.remove('is-active'); });
                    tabPanes.forEach(function (p) { p.classList.remove('is-active'); });

                    btn.classList.add('is-active');
                    if (tabPanes[index]) {
                        tabPanes[index].classList.add('is-active');
                    }
                });
            });
        });
    };

    // 7. Responsive Carousels & Sliders (Hero & Editor's Choice with Touch/Mouse Flick Support)
    var initSliders = function () {
        var sliders = document.querySelectorAll('.js-slider');
        sliders.forEach(function (slider) {
            var track = slider.querySelector('.js-slider-track');
            var slides = slider.querySelectorAll('.js-slider-slide');
            var prevBtn = slider.querySelector('.js-slider-prev');
            var nextBtn = slider.querySelector('.js-slider-next');

            if (!track || !slides.length) return;

            var currentIndex = 0;
            var slideWidth = slides[0].offsetWidth;
            var isSingle = slider.getAttribute('data-per-view') === '1';

            var getGap = function () {
                var computed = window.getComputedStyle ? window.getComputedStyle(track) : track.currentStyle;
                if (!computed) return 0;
                var gapVal = computed.columnGap || computed.gap || '0';
                return parseInt(gapVal, 10) || 0;
            };

            var maxIndex = function () {
                var visibleCount = isSingle ? 1 : Math.max(1, Math.floor(slider.offsetWidth / (slideWidth || 1)));
                return Math.max(0, slides.length - visibleCount);
            };

            var updateSlider = function (withTransition) {
                if (withTransition === undefined) withTransition = true;
                slideWidth = slides[0].offsetWidth;
                var gap = getGap();
                if (withTransition) {
                    track.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                } else {
                    track.style.transition = 'none';
                }
                var offset = -(currentIndex * (slideWidth + gap));
                track.style.transform = 'translateX(' + offset + 'px)';
                track.style.webkitTransform = 'translateX(' + offset + 'px)';
            };

            var goToNext = function () {
                if (currentIndex < maxIndex()) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateSlider();
            };

            var goToPrev = function () {
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
                var key = e.key || e.keyCode;
                if (key === 'ArrowRight' || key === 39) {
                    e.preventDefault();
                    goToNext();
                    resetAutoplayTimer();
                } else if (key === 'ArrowLeft' || key === 37) {
                    e.preventDefault();
                    goToPrev();
                    resetAutoplayTimer();
                }
            });

            // Autoplay with pause on hover/focus and timer reset
            var autoplayInterval = null;
            var isPaused = false;

            var startAutoplay = function () {
                if (slider.getAttribute('data-autoplay') !== 'true') return;
                stopAutoplay();
                autoplayInterval = setInterval(function () {
                    if (!isPaused) {
                        goToNext();
                    }
                }, 8000);
            };

            var stopAutoplay = function () {
                if (autoplayInterval) {
                    clearInterval(autoplayInterval);
                    autoplayInterval = null;
                }
            };

            var resetAutoplayTimer = function () {
                stopAutoplay();
                startAutoplay();
            };

            if (slider.getAttribute('data-autoplay') === 'true') {
                startAutoplay();

                slider.addEventListener('mouseenter', function () { isPaused = true; });
                slider.addEventListener('mouseleave', function () { isPaused = false; });
                slider.addEventListener('focusin',    function () { isPaused = true; });
                slider.addEventListener('focusout',   function () { isPaused = false; });
            }

            // Drag / Flick gesture with Touch and Pointer compatibility
            if (slides.length > 1) {
                var startX = 0;
                var startY = 0;
                var currentX = 0;
                var currentY = 0;
                var isPointerDown = false;
                var isDragging = false;
                var suppressClick = false;
                var startTime = 0;
                var lastX = 0;
                var lastTime = 0;
                var velocityX = 0;
                var pointerType = 'mouse';

                var onPointerDown = function (e) {
                    if (e.pointerType === 'mouse' && e.button !== 0) return;
                    if (e.target && e.target.closest && e.target.closest('.slider-btn')) return;

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

                var onPointerMove = function (e) {
                    if (!isPointerDown) return;

                    currentX = e.clientX;
                    currentY = e.clientY;
                    var deltaX = currentX - startX;
                    var deltaY = currentY - startY;

                    var now = Date.now();
                    var dt = now - lastTime;
                    if (dt > 10) {
                        velocityX = (currentX - lastX) / dt;
                        lastX = currentX;
                        lastTime = now;
                    }

                    if (!isDragging) {
                        // Allow vertical page scrolling on touch devices if movement is predominantly vertical
                        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
                            isPointerDown = false;
                            isPaused = false;
                            return;
                        }

                        // Robust threshold: 22px for mouse, 16px for touch
                        var threshold = (pointerType === 'mouse') ? 22 : 16;
                        if (Math.abs(deltaX) > threshold) {
                            isDragging = true;
                            suppressClick = true;
                            slider.classList.add('is-dragging');
                            if (slider.setPointerCapture && e.pointerId) {
                                try {
                                    slider.setPointerCapture(e.pointerId);
                                } catch (err) {}
                            }
                        }
                    }

                    if (isDragging) {
                        if (e.cancelable && e.preventDefault) e.preventDefault();
                        slideWidth = slides[0].offsetWidth;
                        var gap = getGap();
                        var baseOffset = -currentIndex * (slideWidth + gap);

                        // Elastic resistance when dragging beyond edge slides
                        var effectiveDeltaX = deltaX;
                        if ((currentIndex === 0 && deltaX > 0) || (currentIndex === maxIndex() && deltaX < 0)) {
                            effectiveDeltaX = deltaX * 0.35;
                        }

                        track.style.transition = 'none';
                        var newPos = baseOffset + effectiveDeltaX;
                        track.style.transform = 'translateX(' + newPos + 'px)';
                        track.style.webkitTransform = 'translateX(' + newPos + 'px)';
                    }
                };

                var onPointerUp = function (e) {
                    if (!isPointerDown) return;
                    isPointerDown = false;

                    if (isDragging) {
                        slider.classList.remove('is-dragging');
                        if (slider.releasePointerCapture && e && e.pointerId) {
                            try {
                                slider.releasePointerCapture(e.pointerId);
                            } catch (err) {}
                        }

                        var deltaX = currentX - startX;
                        var duration = Date.now() - startTime;
                        slideWidth = slides[0].offsetWidth;

                        // Flick condition: either quick velocity (>0.28 px/ms) or distance > 15% of width
                        var isFlick = (Math.abs(velocityX) > 0.28 && duration < 450) || Math.abs(deltaX) > (slideWidth * 0.15);

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
                        setTimeout(function () {
                            suppressClick = false;
                            isDragging = false;
                        }, 120);
                    } else {
                        // Regular tap / click without drag: allow immediate link navigation
                        suppressClick = false;
                        isDragging = false;

                        // If user clicked background of hero card (not an <a> tag directly), navigate to article
                        if (e && e.target && e.target.closest) {
                            if (!e.target.closest('a') && !e.target.closest('button')) {
                                var activeSlide = slides[currentIndex];
                                var link = activeSlide ? activeSlide.querySelector('.hero-content h2 a, .hero-content h3 a') : null;
                                if (link && link.href) {
                                    link.click();
                                }
                            }
                        }
                    }

                    isPaused = false;
                };

                var onPointerCancel = function () {
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

                // Prevent native image/link drag ghosting
                slider.addEventListener('dragstart', function (e) {
                    e.preventDefault();
                });

                // Attach Pointer Events if supported; otherwise Touch + Mouse fallbacks (Chrome < 55, Firefox < 59, Android 5/6)
                if (window.PointerEvent) {
                    slider.addEventListener('pointerdown', onPointerDown);
                    slider.addEventListener('pointermove', onPointerMove);
                    slider.addEventListener('pointerup', onPointerUp);
                    slider.addEventListener('pointercancel', onPointerCancel);
                } else {
                    // Fallback 1: Mouse events
                    slider.addEventListener('mousedown', function (e) {
                        onPointerDown({
                            pointerType: 'mouse',
                            button: e.button,
                            target: e.target,
                            clientX: e.clientX,
                            clientY: e.clientY,
                            pointerId: 1
                        });
                    });
                    window.addEventListener('mousemove', function (e) {
                        if (isPointerDown) {
                            onPointerMove({
                                clientX: e.clientX,
                                clientY: e.clientY,
                                cancelable: e.cancelable,
                                preventDefault: function () { e.preventDefault(); }
                            });
                        }
                    });
                    window.addEventListener('mouseup', function (e) {
                        if (isPointerDown) {
                            onPointerUp({
                                target: e.target,
                                pointerId: 1
                            });
                        }
                    });

                    // Fallback 2: Touch events for 2016 mobile/tablet browsers
                    slider.addEventListener('touchstart', function (e) {
                        if (e.touches && e.touches.length === 1) {
                            var t = e.touches[0];
                            onPointerDown({
                                pointerType: 'touch',
                                button: 0,
                                target: t.target,
                                clientX: t.clientX,
                                clientY: t.clientY,
                                pointerId: 1
                            });
                        }
                    });
                    slider.addEventListener('touchmove', function (e) {
                        if (e.touches && e.touches.length === 1) {
                            var t = e.touches[0];
                            onPointerMove({
                                clientX: t.clientX,
                                clientY: t.clientY,
                                cancelable: e.cancelable,
                                preventDefault: function () { e.preventDefault(); }
                            });
                        }
                    });
                    slider.addEventListener('touchend', function (e) {
                        var t = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0] : {};
                        onPointerUp({
                            target: t.target || e.target,
                            pointerId: 1
                        });
                    });
                    slider.addEventListener('touchcancel', onPointerCancel);
                }
            }

            window.addEventListener('resize', function () {
                updateSlider(false);
            });
        });
    };

    // 8. Copy Link to Clipboard (with legacy document.execCommand fallback)
    var initCopyLink = function () {
        var copyBtns = document.querySelectorAll('.js-copy-link');
        var fallbackCopy = function (text, cb) {
            var textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.top = '0';
            textArea.style.left = '-9999px';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                var successful = document.execCommand('copy');
                if (successful && cb) cb();
            } catch (err) {}
            document.body.removeChild(textArea);
        };

        copyBtns.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                var url = window.location.href;
                var onSuccess = function () {
                    btn.classList.add('is-copied');
                    setTimeout(function () {
                        btn.classList.remove('is-copied');
                    }, 2000);
                };

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url).then(onSuccess, function () {
                        fallbackCopy(url, onSuccess);
                    });
                } else {
                    fallbackCopy(url, onSuccess);
                }
            });
        });
    };

    // 9. Live Clock / Date in Top Bar
    var initLiveDate = function () {
        var dateEl = document.querySelector('.js-live-date');
        if (!dateEl) return;
        var now = new Date();
        var options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
        try {
            dateEl.textContent = now.toLocaleDateString(undefined, options);
        } catch (e) {
            dateEl.textContent = now.toDateString();
        }
    };

    // 9b. Dynamic Live Badge Widget (Cloudflare Worker polling)
    var initLiveBadgeWidget = function () {
        var badgeEl = document.querySelector('.js-live-badge');
        if (!badgeEl || !badgeEl.classList.contains('is-dynamic')) return;

        var workerUrl = badgeEl.getAttribute('data-worker-url');
        if (!workerUrl) return;

        var intervalSec = parseInt(badgeEl.getAttribute('data-interval'), 10) || 30;
        var intervalMs = Math.max(10, intervalSec) * 1000;
        var offlineBehavior = badgeEl.getAttribute('data-offline-behavior') || 'hide';
        var activeText = badgeEl.getAttribute('data-active-text') || 'En vivo';
        var offlineText = badgeEl.getAttribute('data-offline-text') || 'Señal Digital';
        var textEl = badgeEl.querySelector('.live-text');

        var checkLive = function () {
            try {
                fetch(workerUrl, { cache: 'no-cache' })
                    .then(function (res) {
                        if (!res.ok) throw new Error('Worker response error');
                        return res.json();
                    })
                    .then(function (data) {
                        badgeEl.classList.remove('is-hidden-initial');

                        if (data && data.live && data.videoId) {
                            badgeEl.classList.add('is-live');
                            badgeEl.classList.remove('is-offline', 'is-hidden');
                            if (textEl) textEl.textContent = activeText;
                        } else {
                            badgeEl.classList.remove('is-live');
                            if (offlineBehavior === 'hide') {
                                badgeEl.classList.add('is-hidden');
                            } else if (offlineBehavior === 'show_offline') {
                                badgeEl.classList.remove('is-hidden');
                                badgeEl.classList.add('is-offline');
                                if (textEl) textEl.textContent = offlineText;
                            } else {
                                badgeEl.classList.remove('is-hidden', 'is-offline');
                                if (textEl) textEl.textContent = activeText;
                            }
                        }
                    })
                    .catch(function () {
                        badgeEl.classList.remove('is-hidden-initial');
                        if (offlineBehavior === 'hide' && !badgeEl.classList.contains('is-live')) {
                            badgeEl.classList.add('is-hidden');
                        }
                    });
            } catch (err) {
                badgeEl.classList.remove('is-hidden-initial');
            }
        };

        checkLive();
        setInterval(checkLive, intervalMs);
    };

    // 10. Smooth Article / Content Transitions
    var initPageTransitions = function () {
        var transitionType = document.documentElement.getAttribute('data-page-transition');
        if (!transitionType || transitionType === 'none') return;

        var mainContent = document.querySelectorAll('.post-main-box, .feed-stream, .search-page-content');
        if (!mainContent.length) return;

        // Entrance animation
        mainContent.forEach(function (el) { el.classList.add('is-entering'); });
        setTimeout(function () {
            mainContent.forEach(function (el) { el.classList.remove('is-entering'); });
        }, 250);

        // Reset state on browser back/forward cache restore
        window.addEventListener('pageshow', function () {
            document.body.classList.remove('is-page-exiting');
            mainContent.forEach(function (el) {
                el.classList.remove('is-exiting');
                el.classList.add('is-entering');
            });
            setTimeout(function () {
                mainContent.forEach(function (el) { el.classList.remove('is-entering'); });
            }, 250);
        });

        // Intercept internal navigation clicks
        document.addEventListener('click', function (e) {
            if (!e) e = window.event || {};
            var link = (e.target && e.target.closest) ? e.target.closest('a') : null;
            if (!link) return;

            // Don't intercept modified clicks or non-left clicks
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
                return;
            }

            // Don't intercept target="_blank"
            if (link.getAttribute('target') === '_blank') return;

            // Don't intercept download links
            if (link.hasAttribute('download')) return;

            var href = link.getAttribute('href');
            if (!href || href.indexOf('#') === 0 || href.indexOf('javascript:') === 0 || href.indexOf('mailto:') === 0 || href.indexOf('tel:') === 0) {
                return;
            }

            try {
                var targetUrl;
                try {
                    targetUrl = new URL(link.href, window.location.href);
                } catch (uErr) {
                    var anchor = document.createElement('a');
                    anchor.href = link.href;
                    targetUrl = {
                        pathname: anchor.pathname,
                        search: anchor.search,
                        hash: anchor.hash,
                        origin: anchor.origin || (anchor.protocol + '//' + anchor.host),
                        protocol: anchor.protocol
                    };
                }

                var currentUrl;
                try {
                    currentUrl = new URL(window.location.href);
                } catch (cErr) {
                    currentUrl = {
                        pathname: window.location.pathname,
                        search: window.location.search,
                        hash: window.location.hash,
                        origin: window.location.origin || (window.location.protocol + '//' + window.location.host),
                        protocol: window.location.protocol
                    };
                }

                // Same page hash anchor
                if (targetUrl.pathname === currentUrl.pathname && targetUrl.search === currentUrl.search && targetUrl.hash) {
                    return;
                }

                // Check same origin or local preview file://
                var isSameOrigin = (targetUrl.origin === currentUrl.origin) || (currentUrl.origin === 'null' && targetUrl.protocol === 'file:');
                if (!isSameOrigin) return;

                // Trigger exit transition
                e.preventDefault();
                document.body.classList.add('is-page-exiting');
                mainContent.forEach(function (el) { el.classList.add('is-exiting'); });

                var duration = 180;
                if (window.getComputedStyle) {
                    var styleVal = window.getComputedStyle(document.documentElement).getPropertyValue('--page-trans-duration');
                    duration = parseInt(styleVal, 10) || 180;
                }

                setTimeout(function () {
                    window.location.href = link.href;
                }, duration);
            } catch (err) {
                // Allow browser default navigation if parsing fails
            }
        });
    };

    // 11. Breaking News Ticker Synchronization & Fallback Hydration
    var initTickerSync = function () {
        var track = document.querySelector('.js-ticker-track');
        if (!track) return;

        var items = track.querySelectorAll('.ticker-item:not([aria-hidden="true"])');
        var STORAGE_KEY = 'vtv_trending_ticker_data';

        if (items.length >= 2) {
            try {
                var data = toArray(items).map(function (item) {
                    var a = item.querySelector('a');
                    return {
                        url: a ? a.getAttribute('href') : '#',
                        title: a ? a.textContent.trim() : ''
                    };
                }).filter(function (item) { return !!item.title; });

                if (data.length > 0) {
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                }
            } catch (e) {}
        } else {
            try {
                var saved = localStorage.getItem(STORAGE_KEY);
                if (saved) {
                    var parsedData = JSON.parse(saved);
                    if (Array.isArray(parsedData) && parsedData.length > 0) {
                        var originalHtml = parsedData.map(function (item) {
                            return '<div class="ticker-item"><a href="' + item.url + '">' + item.title + '</a></div>';
                        }).join('');
                        var clonedHtml = parsedData.map(function (item) {
                            return '<div class="ticker-item" aria-hidden="true"><a href="' + item.url + '" tabindex="-1">' + item.title + '</a></div>';
                        }).join('');
                        track.innerHTML = originalHtml + clonedHtml;
                    }
                }
            } catch (e) {}
        }
    };

    // 12. Sticky Dock Dismissal & Footer Intersection Auto-Hide
    var initStickyAds = function () {
        var stickyAd = document.querySelector('.js-sticky-dock, .js-sticky-mobile-ad');
        if (!stickyAd) return;

        // Mark dock as active on body for legacy CSS selectors
        document.body.classList.add('dock-active');

        var closeBtn = stickyAd.querySelector('.js-dock-close, .js-sticky-close') || document.querySelector('.js-dock-close, .js-sticky-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                stickyAd.classList.add('is-hidden');
                document.body.classList.add('dock-dismissed');
                document.body.classList.remove('dock-active');
                setTimeout(function () {
                    stickyAd.style.display = 'none';
                }, 400);
            });
        }

        // Auto-recede when approaching footer
        var footer = document.querySelector('footer');
        if (footer) {
            if ('IntersectionObserver' in window) {
                var footerObserver = new IntersectionObserver(function (entries) {
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
            } else {
                // Fallback scroll listener for 2016 engines without IntersectionObserver
                window.addEventListener('scroll', function () {
                    var footerRect = footer.getBoundingClientRect();
                    if (footerRect.top < window.innerHeight) {
                        stickyAd.classList.add('is-dock-receded');
                        document.body.classList.add('dock-at-footer');
                    } else {
                        stickyAd.classList.remove('is-dock-receded');
                        document.body.classList.remove('dock-at-footer');
                    }
                });
            }
        }
    };

    // 13. Search Page Input Query Pre-population & Synchronization
    var initSearchPageQuery = function () {
        var searchInput = document.querySelector('.search-page-input');
        if (!searchInput) return;

        var extractParam = function (queryStr, paramName) {
            if (!queryStr) return '';
            var match = queryStr.match(new RegExp('(?:[?&#]|^)' + paramName + '=([^&#]*)'));
            return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : '';
        };

        var getQueryFromUrl = function () {
            var q = '';
            if (window.URLSearchParams) {
                try {
                    var params = new URLSearchParams(window.location.search);
                    q = params.get('q');
                    if (q) return q;

                    if (window.location.hash) {
                        var hash = window.location.hash.replace(/^#/, '');
                        var hashParams = new URLSearchParams(hash);
                        q = hashParams.get('gsc.q') || hashParams.get('q');
                        if (q) return q;
                    }
                } catch (e) {}
            }

            // Fallback for browsers without URLSearchParams
            q = extractParam(window.location.search, 'q');
            if (q) return q;

            if (window.location.hash) {
                q = extractParam(window.location.hash, 'gsc.q') || extractParam(window.location.hash, 'q');
                if (q) return q;
            }

            return '';
        };

        var populateQuery = function () {
            var currentQuery = getQueryFromUrl();
            if (currentQuery) {
                searchInput.value = decodeURIComponent(currentQuery);
            }
        };

        populateQuery();
        window.addEventListener('hashchange', populateQuery);
    };

    // Run on DOM ready
    var onDomReady = function () {
        initThemeToggle();
        initMobileMenu();
        initSearchModal();
        initStickyNav();
        initBackToTop();
        initTabs();
        initSliders();
        initCopyLink();
        initLiveDate();
        initLiveBadgeWidget();
        initPageTransitions();
        initTickerSync();
        initStickyAds();
        initSearchPageQuery();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onDomReady);
    } else {
        onDomReady();
    }
})();
