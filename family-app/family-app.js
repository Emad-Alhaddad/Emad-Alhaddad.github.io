(function () {
    'use strict';

    var STORAGE_KEY = 'family-app-lang';
    var DEFAULT_LANG = 'ar';

    function getLang() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored === 'ar' || stored === 'en') return stored;
        } catch (e) { /* ignore */ }
        return DEFAULT_LANG;
    }

    function setLang(lang) {
        var html = document.documentElement;
        html.setAttribute('lang', lang);
        html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

        document.querySelectorAll('.i18n[data-lang]').forEach(function (el) {
            if (el.getAttribute('data-lang') === lang) {
                el.classList.add('i18n-active');
                el.removeAttribute('hidden');
            } else {
                el.classList.remove('i18n-active');
                el.setAttribute('hidden', '');
            }
        });

        document.querySelectorAll('[data-lang-label]').forEach(function (btn) {
            var show = btn.getAttribute('data-lang-label');
            btn.textContent = lang === 'ar' ? (show === 'en' ? 'EN' : 'English') : (show === 'ar' ? 'عربي' : 'العربية');
            btn.setAttribute('aria-label', lang === 'ar' ? 'Switch to English' : 'التبديل إلى العربية');
        });

        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch (e) { /* ignore */ }
    }

    function toggleLang() {
        setLang(getLang() === 'ar' ? 'en' : 'ar');
    }

    function initLangToggle() {
        document.querySelectorAll('.lang-toggle').forEach(function (btn) {
            btn.addEventListener('click', toggleLang);
        });
    }

    function initFaq() {
        var items = document.querySelectorAll('.faq-item');
        if (!items.length) return;

        items.forEach(function (item) {
            item.addEventListener('toggle', function () {
                if (!item.open) return;
                items.forEach(function (other) {
                    if (other !== item && other.open) other.open = false;
                });
            });
        });
    }

    function initCarousel() {
        var carousel = document.querySelector('#screenshots .carousel');
        if (!carousel) return;

        var wrap = carousel.closest('.carousel-wrap');
        var prev = wrap ? wrap.querySelector('.carousel-btn-prev') : null;
        var next = wrap ? wrap.querySelector('.carousel-btn-next') : null;
        var slideWidth = function () {
            var slide = carousel.querySelector('.carousel-slide');
            if (!slide) return 280;
            var gap = 20;
            return slide.offsetWidth + gap;
        };

        function scrollByDir(direction) {
            var amount = slideWidth() * direction;
            var isRtl = document.documentElement.getAttribute('dir') === 'rtl';
            carousel.scrollBy({ left: isRtl ? -amount * direction : amount * direction, behavior: 'smooth' });
        }

        if (prev) {
            prev.addEventListener('click', function () {
                scrollByDir(-1);
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                scrollByDir(1);
            });
        }

        carousel.setAttribute('tabindex', '0');
        carousel.addEventListener('keydown', function (e) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                scrollByDir(document.documentElement.getAttribute('dir') === 'rtl' ? 1 : -1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                scrollByDir(document.documentElement.getAttribute('dir') === 'rtl' ? -1 : 1);
            }
        });
    }

    function init() {
        setLang(getLang());
        initLangToggle();
        initFaq();
        initCarousel();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
