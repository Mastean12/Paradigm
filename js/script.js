/**
 * Paradigm Pet Professionals - Main JavaScript File
 * Author: Paradigm Pet Professionals
 * Date: January 28, 2026
 * 
 * This file handles:
 * 1. Mobile navigation toggle and responsive behavior
 * 2. Form validation
 * 3. Interactive elements with mobile optimizations
 * 4. Accessibility enhancements
 * 5. Mobile-first responsive features
 * 6. Prevention of horizontal overflow on mobile
 */

// ===== DOCUMENT READY =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Paradigm Pet Professionals website loaded - Mobile Optimized');
    
    // Initialize all functionality
    initMobileNavigation();
    initDropdowns();
    initFormValidation();
    initSmoothScrolling();
    initAccessibilityFeatures();
    initDynamicContent();
    initPetPagesFeatures();
    initResponsiveUtilities();
    
    // Prevent horizontal overflow
    preventHorizontalOverflow();
    
    // Handle orientation changes
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            preventHorizontalOverflow();
            adjustMobileLayout();
        }, 100);
    });
});

// ===== MOBILE NAVIGATION - COMPLETELY REVISED =====
function initMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const primaryNav = document.querySelector('.primary-nav');
    const body = document.body;
    
    // Create mobile toggle if it doesn't exist
    if (!mobileToggle && primaryNav) {
        createMobileMenuToggle(primaryNav);
        return initMobileNavigation(); // Reinitialize
    }
    
    if (!mobileToggle || !primaryNav) return;
    
    // Function to close mobile menu
    const closeMobileMenu = function() {
        primaryNav.classList.remove('active');
        body.classList.remove('nav-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        
        // Enable body scrolling
        body.style.overflow = '';
    };
    
    // Function to open mobile menu
    const openMobileMenu = function() {
        primaryNav.classList.add('active');
        body.classList.add('nav-open');
        mobileToggle.setAttribute('aria-expanded', 'true');
        
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
        
        // Prevent body scrolling when menu is open
        body.style.overflow = 'hidden';
    };
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        
        if (primaryNav.classList.contains('active')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (primaryNav.classList.contains('active') &&
            !primaryNav.contains(event.target) &&
            !mobileToggle.contains(event.target)) {
            closeMobileMenu();
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && primaryNav.classList.contains('active')) {
            closeMobileMenu();
            mobileToggle.focus();
        }
    });
    
    // Close menu when clicking a link (for mobile)
    primaryNav.addEventListener('click', function(event) {
        if (event.target.tagName === 'A' && window.innerWidth <= 768) {
            setTimeout(closeMobileMenu, 300);
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', debounce(function() {
        if (window.innerWidth > 768 && primaryNav.classList.contains('active')) {
            closeMobileMenu();
        }
    }, 250));
}

// Create mobile menu toggle
function createMobileMenuToggle(navElement) {
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    const navContainer = navElement.parentElement;
    if (navContainer) {
        navContainer.insertBefore(mobileToggle, navElement);
    }
}

// ===== DROPDOWN MENUS - MOBILE OPTIMIZED =====
function initDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        const dropdown = toggle.closest('.dropdown');
        if (!dropdown) return;
        
        // Handle click on mobile/tablet
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                e.stopPropagation();
                
                const isOpen = dropdown.classList.contains('open');
                
                // Close all other dropdowns
                document.querySelectorAll('.dropdown.open').forEach(other => {
                    if (other !== dropdown) {
                        other.classList.remove('open');
                    }
                });
                
                // Toggle current dropdown
                if (isOpen) {
                    dropdown.classList.remove('open');
                } else {
                    dropdown.classList.add('open');
                }
            }
        });
        
        // Handle hover on desktop
        if (window.innerWidth > 1024) {
            dropdown.addEventListener('mouseenter', function() {
                this.classList.add('open');
            });
            
            dropdown.addEventListener('mouseleave', function() {
                this.classList.remove('open');
            });
        }
    });
    
    // Close dropdowns when clicking outside on mobile
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 1024) {
            const clickedInsideDropdown = event.target.closest('.dropdown');
            if (!clickedInsideDropdown) {
                document.querySelectorAll('.dropdown.open').forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
        }
    });
    
    // Close dropdowns on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.dropdown.open').forEach(dropdown => {
                dropdown.classList.remove('open');
            });
        }
    });
}

// ===== RESPONSIVE UTILITIES =====
function initResponsiveUtilities() {
    // Add responsive classes to body
    function updateResponsiveClasses() {
        const width = window.innerWidth;
        const body = document.body;
        
        // Remove all responsive classes
        body.classList.remove('is-mobile', 'is-tablet', 'is-desktop');
        
        // Add appropriate class
        if (width <= 768) {
            body.classList.add('is-mobile');
        } else if (width <= 1024) {
            body.classList.add('is-tablet');
        } else {
            body.classList.add('is-desktop');
        }
    }
    
    // Initial update
    updateResponsiveClasses();
    
    // Update on resize
    window.addEventListener('resize', debounce(updateResponsiveClasses, 250));
    
    // Initialize touch device detection
    detectTouchDevice();
}

// Detect touch device
function detectTouchDevice() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.add('no-touch-device');
    }
}

// ===== PREVENT HORIZONTAL OVERFLOW =====
function preventHorizontalOverflow() {
    // Ensure body doesn't overflow horizontally
    document.body.style.overflowX = 'hidden';
    document.body.style.maxWidth = '100vw';
    
    // Fix for iOS Safari 100vh issue
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    
    // Fix images and tables that might cause overflow
    const potentialOverflowElements = document.querySelectorAll('img, table, .content-image, .comparison-table, .sidebar-image');
    potentialOverflowElements.forEach(element => {
        element.style.maxWidth = '100%';
    });
    
    // Handle tables specifically
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const wrapper = table.closest('.table-responsive') || table.parentElement;
        if (wrapper && !wrapper.classList.contains('table-responsive')) {
            const newWrapper = document.createElement('div');
            newWrapper.className = 'table-responsive';
            newWrapper.style.overflowX = 'auto';
            newWrapper.style.webkitOverflowScrolling = 'touch';
            newWrapper.style.width = '100%';
            
            table.parentNode.insertBefore(newWrapper, table);
            newWrapper.appendChild(table);
        }
    });
}

// ===== ADJUST MOBILE LAYOUT =====
function adjustMobileLayout() {
    if (window.innerWidth <= 768) {
        // Stack page container on mobile
        const pageContainers = document.querySelectorAll('.page-container');
        pageContainers.forEach(container => {
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '20px';
        });
        
        // Adjust sidebar
        const sidebars = document.querySelectorAll('.page-sidebar');
        sidebars.forEach(sidebar => {
            sidebar.style.order = '2';
            sidebar.style.marginTop = '20px';
        });
        
        // Adjust main content
        const mainContents = document.querySelectorAll('.page-content');
        mainContents.forEach(content => {
            content.style.order = '1';
        });
    }
}

// ===== PET PAGES SPECIFIC FEATURES - MOBILE OPTIMIZED =====
function initPetPagesFeatures() {
    const isPetPage = window.location.pathname.includes('cats.html') ||
                     window.location.pathname.includes('dogs.html') ||
                     window.location.pathname.includes('birds.html') ||
                     window.location.pathname.includes('fish.html') ||
                     window.location.pathname.includes('small-animals.html');
    
    if (!isPetPage) return;
    
    // Initialize mobile-optimized pet page features
    initMobileOptimizedImages();
    initMobileSidebar();
    initResponsiveTables();
    initMobileFriendlyContent();
}

// Mobile optimized images
function initMobileOptimizedImages() {
    const images = document.querySelectorAll('img:not([data-responsive="handled"])');
    
    images.forEach(img => {
        // Mark as handled
        img.setAttribute('data-responsive', 'handled');
        
        // Ensure max-width for mobile
        if (window.innerWidth <= 768) {
            img.style.maxHeight = '250px';
            img.style.objectFit = 'cover';
        }
        
        // Lazy loading
        if ('IntersectionObserver' in window && img.dataset.src) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const targetImg = entry.target;
                        targetImg.src = targetImg.dataset.src;
                        targetImg.removeAttribute('data-src');
                        observer.unobserve(targetImg);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });
            
            observer.observe(img);
        }
    });
}

// Mobile sidebar
function initMobileSidebar() {
    if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.page-sidebar');
        const mainContent = document.querySelector('.page-content');
        
        if (!sidebar || !mainContent) return;
        
        // Check if toggle already exists
        if (sidebar.previousElementSibling && sidebar.previousElementSibling.classList.contains('sidebar-toggle-mobile')) {
            return;
        }
        
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle-mobile btn btn-secondary';
        toggleBtn.innerHTML = '<i class="fas fa-info-circle"></i> Quick Tips';
        toggleBtn.setAttribute('aria-label', 'Toggle sidebar information');
        toggleBtn.setAttribute('aria-expanded', 'false');
        
        // Insert after main content
        mainContent.parentNode.insertBefore(toggleBtn, sidebar);
        
        // Initially hide sidebar on mobile
        sidebar.style.display = 'none';
        
        // Toggle functionality
        toggleBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            if (isExpanded) {
                sidebar.style.display = 'none';
                this.innerHTML = '<i class="fas fa-info-circle"></i> Quick Tips';
            } else {
                sidebar.style.display = 'block';
                this.innerHTML = '<i class="fas fa-times"></i> Hide Tips';
                
                // Scroll sidebar into view
                setTimeout(() => {
                    sidebar.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    }
}

// Responsive tables
function initResponsiveTables() {
    const tables = document.querySelectorAll('.comparison-table, table');
    
    tables.forEach(table => {
        // Create wrapper if needed
        if (!table.parentElement.classList.contains('table-responsive')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            wrapper.style.overflowX = 'auto';
            wrapper.style.webkitOverflowScrolling = 'touch';
            wrapper.style.width = '100%';
            wrapper.style.margin = '20px 0';
            
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
        
        // Add scroll hint for mobile
        if (window.innerWidth <= 768 && table.offsetWidth > window.innerWidth) {
            const hint = document.createElement('div');
            hint.className = 'table-scroll-hint';
            hint.innerHTML = '<i class="fas fa-arrow-right"></i> Scroll to view full table';
            hint.style.cssText = 'text-align: center; padding: 8px; color: var(--secondary-dark); font-size: 0.9rem; font-style: italic;';
            
            table.parentNode.parentNode.insertBefore(hint, table.parentNode.nextSibling);
        }
    });
}

// Mobile friendly content
function initMobileFriendlyContent() {
    // Adjust content sections for mobile
    if (window.innerWidth <= 768) {
        const contentSections = document.querySelectorAll('.content-section');
        
        contentSections.forEach(section => {
            // Adjust padding
            section.style.padding = '15px';
            
            // Adjust headings
            const headings = section.querySelectorAll('h2, h3, h4');
            headings.forEach(heading => {
                if (heading.tagName === 'H2') {
                    heading.style.fontSize = '1.5rem';
                } else if (heading.tagName === 'H3') {
                    heading.style.fontSize = '1.3rem';
                } else if (heading.tagName === 'H4') {
                    heading.style.fontSize = '1.1rem';
                }
            });
            
            // Adjust lists
            const lists = section.querySelectorAll('ul, ol');
            lists.forEach(list => {
                list.style.paddingLeft = '20px';
                list.style.margin = '15px 0';
            });
        });
        
        // Adjust warning signs
        const warningSigns = document.querySelectorAll('.warning-sign');
        warningSigns.forEach(sign => {
            sign.style.flexDirection = 'column';
            sign.style.textAlign = 'center';
            sign.style.padding = '15px';
        });
    }
}

// ===== FORM VALIDATION - MOBILE OPTIMIZED =====
function initFormValidation() {
    // All form validation code remains the same as before
    // ... [keep all existing form validation code] ...
    
    // Add mobile-specific form adjustments
    if (window.innerWidth <= 768) {
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            // Make form inputs easier to tap on mobile
            const inputs = form.querySelectorAll('input, select, textarea, button');
            inputs.forEach(input => {
                input.style.minHeight = '44px'; // Apple's recommended minimum tap target
                input.style.fontSize = '16px'; // Prevents iOS zoom
            });
            
            // Ensure labels are visible
            const labels = form.querySelectorAll('label');
            labels.forEach(label => {
                label.style.display = 'block';
                label.style.marginBottom = '8px';
                label.style.fontWeight = '600';
            });
        });
    }
}

// ===== SMOOTH SCROLLING - MOBILE OPTIMIZED =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        if (anchor.classList.contains('dropdown-toggle')) return;
        
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Close mobile menu if open
                    const primaryNav = document.querySelector('.primary-nav');
                    if (primaryNav && primaryNav.classList.contains('active')) {
                        primaryNav.classList.remove('active');
                        document.querySelector('.mobile-menu-toggle').setAttribute('aria-expanded', 'false');
                    }
                    
                    // Calculate offset for mobile (account for fixed header)
                    let offset = 0;
                    if (window.innerWidth <= 768) {
                        const header = document.querySelector('.site-header');
                        if (header) {
                            offset = header.offsetHeight;
                        }
                    }
                    
                    // Scroll to target
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update URL
                    history.pushState(null, null, href);
                    
                    // Focus for accessibility
                    targetElement.setAttribute('tabindex', '-1');
                    targetElement.focus();
                    setTimeout(() => targetElement.removeAttribute('tabindex'), 1000);
                }
            }
        });
    });
}

// ===== ACCESSIBILITY FEATURES =====
function initAccessibilityFeatures() {
    // Add aria-labels to icons without text
    document.querySelectorAll('.fas, .fab, .fa').forEach(icon => {
        if (!icon.hasAttribute('aria-label') && 
            !icon.closest('button, a, [aria-label], [aria-labelledby]')) {
            const iconType = Array.from(icon.classList)
                .find(cls => cls.startsWith('fa-'))
                ?.replace('fa-', '')
                .replace(/-/g, ' ') || 'icon';
            icon.setAttribute('aria-label', iconType);
        }
    });
    
    // Ensure all images have alt text
    document.querySelectorAll('img:not([alt])').forEach(img => {
        if (!img.hasAttribute('alt')) {
            const imgName = img.src.split('/').pop().split('.')[0] || 'image';
            img.setAttribute('alt', imgName.replace(/-/g, ' '));
        }
    });
    
    // Touch device improvements
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Increase tap targets on touch devices
        const tapTargets = document.querySelectorAll('a, button, [role="button"]');
        tapTargets.forEach(target => {
            target.style.minHeight = '44px';
            target.style.minWidth = '44px';
            target.style.display = 'inline-flex';
            target.style.alignItems = 'center';
            target.style.justifyContent = 'center';
        });
    }
}

// ===== DYNAMIC CONTENT - MOBILE OPTIMIZED =====
function initDynamicContent() {
    // Lazy load images with mobile optimizations
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Load image
                    img.src = img.dataset.src;
                    
                    // Remove data-src to prevent duplicate loading
                    img.removeAttribute('data-src');
                    
                    // Add loaded class for potential animations
                    img.classList.add('loaded');
                    
                    // Stop observing
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.1
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Update current year in footer
    const yearElements = document.querySelectorAll('.current-year');
    if (yearElements.length > 0) {
        const currentYear = new Date().getFullYear();
        yearElements.forEach(element => {
            element.textContent = currentYear;
        });
    }
    
    // Highlight active navigation item
    highlightActiveNavItem();
    
    // Add loading states to buttons with mobile optimizations
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                const originalText = submitButton.textContent;
                const originalHTML = submitButton.innerHTML;
                
                // Create mobile-friendly loading state
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Processing...</span>';
                submitButton.disabled = true;
                
                // Reset after 5 seconds or on form reset
                const resetButton = () => {
                    submitButton.innerHTML = originalHTML;
                    submitButton.disabled = false;
                };
                
                setTimeout(resetButton, 5000);
                
                // Also reset if form is reset
                form.addEventListener('reset', resetButton);
            }
        });
    });
}

// Highlight active navigation item
function highlightActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const allLinks = document.querySelectorAll('a');
    
    allLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Reset all links
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        
        // Check if this link points to current page
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html') ||
            (linkHref && linkHref.includes(currentPage.replace('.html', '')))) {
            
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
            
            // Highlight parent dropdown if exists
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                const dropdownToggle = parentDropdown.querySelector('.dropdown-toggle');
                if (dropdownToggle) {
                    dropdownToggle.classList.add('active');
                }
            }
        }
    });
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ===== WINDOW RESIZE HANDLER - ENHANCED =====
window.addEventListener('resize', debounce(function() {
    const width = window.innerWidth;
    
    // Close mobile menu when resizing to desktop
    if (width > 768) {
        const primaryNav = document.querySelector('.primary-nav');
        if (primaryNav && primaryNav.classList.contains('active')) {
            primaryNav.classList.remove('active');
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            if (mobileToggle) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
            document.body.style.overflow = '';
        }
        
        // Close dropdowns
        document.querySelectorAll('.dropdown.open').forEach(dropdown => {
            dropdown.classList.remove('open');
        });
    }
    
    // Reinitialize responsive features
    preventHorizontalOverflow();
    adjustMobileLayout();
    
    // Reinitialize pet page features if on pet page
    const isPetPage = window.location.pathname.includes('cats.html') ||
                     window.location.pathname.includes('dogs.html') ||
                     window.location.pathname.includes('birds.html') ||
                     window.location.pathname.includes('fish.html') ||
                     window.location.pathname.includes('small-animals.html');
    
    if (isPetPage) {
        initMobileOptimizedImages();
        initResponsiveTables();
        initMobileFriendlyContent();
        
        // Handle sidebar toggle visibility
        if (width > 768) {
            const sidebarToggle = document.querySelector('.sidebar-toggle-mobile');
            if (sidebarToggle) {
                sidebarToggle.style.display = 'none';
            }
            const sidebar = document.querySelector('.page-sidebar');
            if (sidebar) {
                sidebar.style.display = 'block';
            }
        } else {
            const sidebarToggle = document.querySelector('.sidebar-toggle-mobile');
            if (sidebarToggle) {
                sidebarToggle.style.display = 'block';
            }
        }
    }
}, 250));

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // User-friendly error handling for mobile
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        // In production, log errors but don't show to users
        if (console && console.error) {
            console.error('An error occurred:', e.message);
        }
    }
});

// ===== INITIALIZE ON LOAD =====
// Run responsive adjustments on load
window.addEventListener('load', function() {
    preventHorizontalOverflow();
    adjustMobileLayout();
    
    // Add loaded class to body for CSS transitions
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);
});

// ===== EXPORT FOR DEVELOPMENT =====
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.PPP = {
        initMobileNavigation,
        initDropdowns,
        preventHorizontalOverflow,
        adjustMobileLayout,
        highlightActiveNavItem,
        debounce,
        throttle
    };
}