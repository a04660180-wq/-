/**
 * من جد وجد | Nursery Website Script
 * Production JavaScript Architecture
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initStatsCounters();
    initFAQAccordion();
    initTestimonialsSlider();
    initGalleryLightbox();
    initContactForm();
    initScrollTop();
});

/* ==========================================================================
   1. Navigation & Mobile Drawer
   ========================================================================== */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

    // Sticky Navbar on Scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Hamburger Toggle
    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileNav.classList.toggle('active');
            document.body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close Mobile Nav when clicking any link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close when clicking outside mobile nav
        document.addEventListener('click', (e) => {
            if (mobileNav.classList.contains('active') &&
                !mobileNav.contains(e.target) &&
                !hamburger.contains(e.target)) {
                hamburger.classList.remove('active');
                mobileNav.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

/* ==========================================================================
   2. Scroll Trigger Animations (IntersectionObserver)
   ========================================================================== */
function initScrollAnimations() {
    const animatableElements = document.querySelectorAll(
        '.animate-on-scroll, .animate-from-left, .animate-from-right'
    );

    if (!('IntersectionObserver' in window)) {
        animatableElements.forEach(el => el.classList.add('visible'));
        return;
    }

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatableElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   3. Animated Stats Counters
   ========================================================================== */
function initStatsCounters() {
    const counters = document.querySelectorAll('.counter');
    if (counters.length === 0) return;

    let hasRun = false;

    const countUp = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000;
            const increment = target / (duration / 16);

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target;
                }
            };
            updateCounter();
        });
    };

    const statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;

    if (!('IntersectionObserver' in window)) {
        countUp();
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasRun) {
                hasRun = true;
                countUp();
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);
}

/* ==========================================================================
   4. FAQ Accordion Toggle
   ========================================================================== */
function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other accordion items
            faqItems.forEach(otherItem => otherItem.classList.remove('active'));

            // Toggle clicked item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   5. Testimonials Slider
   ========================================================================== */
function initTestimonialsSlider() {
    const track = document.querySelector('.testimonials-track');
    const dotsContainer = document.querySelector('.slider-dots');
    const slides = document.querySelectorAll('.testimonial-card');

    if (!track || slides.length === 0 || !dotsContainer) return;

    let currentIndex = 0;
    dotsContainer.innerHTML = '';

    // Create pagination dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('slider-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.slider-dot');

    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(${currentIndex * 100}%)`;
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // Auto-advance slider every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        goToSlide(currentIndex);
    }, 5000);
}

/* ==========================================================================
   6. Gallery Lightbox
   ========================================================================== */
function initGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || galleryItems.length === 0) return;

    const lightboxClose = lightbox.querySelector('.lightbox-close');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const lightboxPlaceholder = lightbox.querySelector('.lightbox-placeholder');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');

    let currentItemIndex = 0;

    const openLightbox = (index) => {
        currentItemIndex = index;
        const item = galleryItems[currentItemIndex];
        const caption = item.querySelector('.gallery-overlay-text')?.innerText || '';
        const emoji = item.querySelector('.gallery-item-placeholder')?.innerText || '📸';

        if (lightboxCaption) lightboxCaption.innerText = caption;
        if (lightboxPlaceholder) lightboxPlaceholder.innerText = emoji;

        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    };

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentItemIndex = (currentItemIndex - 1 + galleryItems.length) % galleryItems.length;
            openLightbox(currentItemIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentItemIndex = (currentItemIndex + 1) % galleryItems.length;
            openLightbox(currentItemIndex);
        });
    }
}

/* ==========================================================================
   7. Contact Form Handling
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const successMsg = document.getElementById('formSuccess');

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        let isValid = true;
        const inputs = form.querySelectorAll('[required]');

        inputs.forEach(input => {
            const formGroup = input.closest('.form-group');
            if (!input.value.trim()) {
                isValid = false;
                if (formGroup) formGroup.classList.add('error');
            } else {
                if (formGroup) formGroup.classList.remove('error');
            }
        });

        if (isValid) {
            form.style.display = 'none';
            if (successMsg) successMsg.classList.add('show');
        }
    });

    // Remove error class on input change
    form.querySelectorAll('.form-input, .form-select').forEach(element => {
        element.addEventListener('input', () => {
            const formGroup = element.closest('.form-group');
            if (formGroup) formGroup.classList.remove('error');
        });
    });
}

/* ==========================================================================
   8. Scroll To Top Button
   ========================================================================== */
function initScrollTop() {
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (!scrollTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
