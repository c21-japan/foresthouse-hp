// ========================================
// 共通JavaScript - main.js
// フォレストハウス
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    
    // === ハンバーガーメニュー ===
    const hamburger = document.getElementById('js-hamburger');
    const spNav = document.getElementById('js-sp-nav');
    
    if (hamburger && spNav) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('is-active');
            spNav.classList.toggle('is-active');
            
            if (spNav.classList.contains('is-active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });
        
        // ナビリンククリックで閉じる
        const spNavLinks = spNav.querySelectorAll('a');
        spNavLinks.forEach(function(link) {
            link.addEventListener('click', function() {
                hamburger.classList.remove('is-active');
                spNav.classList.remove('is-active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // === スムーススクロール ===
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#contact-form') {
                // #contact-formの場合はデフォルト動作
                if (href === '#') return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // === FAQアコーディオン ===
    document.querySelectorAll('.faq__question').forEach(function(button) {
        button.addEventListener('click', function() {
            const expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            const answer = this.nextElementSibling;
            if (answer) {
                answer.classList.toggle('is-open');
            }
        });
    });
    
    // === スクロールアニメーション ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const fadeObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.fade-in').forEach(function(el) {
        fadeObserver.observe(el);
    });
    
    // === ヘッダースクロール時の影 ===
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('is-scrolled');
            } else {
                header.classList.remove('is-scrolled');
            }
        });
    }
    
});
