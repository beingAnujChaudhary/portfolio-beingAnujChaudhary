// script.js
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM Content Loaded: Optimizing scripts for speed and smoothness.");

    // --- Loader Hiding ---
    const loader = document.getElementById('loader');
    if (loader) {
        const totalLoaderTime = 3500;
        const loaderFadeOutDuration = 500;

        setTimeout(() => {
            loader.style.opacity = '0';
            loader.style.visibility = 'hidden';
            
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.parentNode.removeChild(loader);
                    console.log("Loader removed from DOM.");
                }
            }, loaderFadeOutDuration);
        }, totalLoaderTime);
    } else {
        console.warn("Loader element not found.");
    }

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu') || document.getElementById('mobile-menu-close-btn');

    if (menuToggle && mobileMenu && closeMenuBtn) {
        const toggleMenu = (show) => {
            mobileMenu.classList.toggle('active', show);
            menuToggle.setAttribute('aria-expanded', show.toString());
            mobileMenu.setAttribute('aria-hidden', (!show).toString());
            document.body.style.overflow = show ? 'hidden' : '';
            if (show) {
                const firstFocusableElement = mobileMenu.querySelector('a, button');
                if (firstFocusableElement) firstFocusableElement.focus();
                console.log("Mobile menu opened.");
            } else {
                menuToggle.focus();
                console.log("Mobile menu closed.");
            }
        };

        menuToggle.addEventListener('click', () => {
            const isExpanded = !mobileMenu.classList.contains('active');
            toggleMenu(isExpanded);
        });

        closeMenuBtn.addEventListener('click', () => {
            toggleMenu(false);
        });

        const mobileMenuLinks = mobileMenu.querySelectorAll('.mobile-menu-link');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mobileMenu.classList.contains('active')) {
                    toggleMenu(false);
                }
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                toggleMenu(false);
            }
        });
        console.log("Mobile menu listeners initialized.");
    } else {
        console.warn("Mobile menu elements not found.");
    }

    // --- Project Fixed Image Preview ---
    const projectsContainer = document.getElementById('projects-container');
    const fixedImagePreview = document.getElementById('fixed-image');

    if (projectsContainer && fixedImagePreview) {
        const projectItems = projectsContainer.querySelectorAll('.project-item');
        const isDesktopForProjectPreview = () => window.innerWidth >= 768;

        const showPreview = (item) => {
            if (isDesktopForProjectPreview()) {
                const imageUrl = item.getAttribute('data-image');
                if (imageUrl) {
                    fixedImagePreview.style.backgroundImage = `url(${imageUrl})`;
                    fixedImagePreview.classList.add('active');
                }
            }
        };

        const hidePreview = () => {
            if (isDesktopForProjectPreview()) {
                fixedImagePreview.classList.remove('active');
            }
        };

        projectItems.forEach(item => {
            item.addEventListener('mouseenter', () => showPreview(item));
            item.addEventListener('focus', () => showPreview(item));
            item.addEventListener('mouseleave', hidePreview);
            item.addEventListener('blur', hidePreview);
        });
        console.log("Project fixed image preview listeners initialized.");
    } else {
        console.log("Project container or fixed image preview element not found on this page.");
    }

    // --- Dynamic year in footer ---
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear().toString();
    }

    // Add active class to nav links based on current page
    try {
        const currentPage = window.location.pathname.split("/").pop() || "index.html";
        const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-link');
        navLinks.forEach(link => {
            let linkHref = link.getAttribute('href');
            if (linkHref && linkHref.startsWith('./')) {
                linkHref = linkHref.substring(2);
            }

            if (linkHref === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    } catch (e) {
        console.error("Error setting active nav link:", e);
    }
});