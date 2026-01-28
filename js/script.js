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
    
    // Run initial mobile adjustments
    setTimeout(adjustMobileLayout, 100);
});

// ===== MOBILE NAVIGATION - FIXED =====
function initMobileNavigation() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const primaryNav = document.querySelector('.primary-nav');
    const body = document.body;
    
    if (!mobileToggle || !primaryNav) {
        console.warn('Mobile navigation elements not found');
        return;
    }
    
    // Function to close mobile menu
    const closeMobileMenu = function() {
        primaryNav.classList.remove('active');
        body.classList.remove('nav-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.classList.remove('active');
        
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        
        // Enable body scrolling
        body.style.overflow = '';
        body.style.position = '';
    };
    
    // Function to open mobile menu
    const openMobileMenu = function() {
        primaryNav.classList.add('active');
        body.classList.add('nav-open');
        mobileToggle.setAttribute('aria-expanded', 'true');
        mobileToggle.classList.add('active');
        
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
        
        // Prevent body scrolling when menu is open
        body.style.overflow = 'hidden';
        body.style.position = 'fixed';
        body.style.width = '100%';
    };
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', function(e) {
        e.preventDefault();
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
        if (event.target.tagName === 'A' || event.target.closest('a')) {
            if (window.innerWidth <= 768) {
                setTimeout(closeMobileMenu, 300);
            }
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', debounce(function() {
        if (window.innerWidth > 768 && primaryNav.classList.contains('active')) {
            closeMobileMenu();
        }
    }, 250));
}

// ===== DROPDOWN MENUS - FIXED =====
function initDropdowns() {
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        const dropdown = toggle.closest('.dropdown');
        if (!dropdown) return;
        
        // Add click handler for all devices
        toggle.addEventListener('click', function(e) {
            // On mobile/tablet, toggle dropdown
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
        
        // Initialize hover behavior for desktop
        initDesktopDropdownHover(dropdown);
    });
    
    // Close dropdowns when clicking outside on mobile
    document.addEventListener('click', function(event) {
        const clickedDropdown = event.target.closest('.dropdown');
        
        if (window.innerWidth <= 1024) {
            if (!clickedDropdown) {
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

// Initialize desktop hover behavior
function initDesktopDropdownHover(dropdown) {
    if (window.innerWidth > 1024) {
        dropdown.addEventListener('mouseenter', function() {
            this.classList.add('open');
        });
        
        dropdown.addEventListener('mouseleave', function() {
            this.classList.remove('open');
        });
    }
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
        
        // Reinitialize dropdown hover behavior on resize
        if (width > 1024) {
            document.querySelectorAll('.dropdown').forEach(initDesktopDropdownHover);
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
        
        // Add touch-specific optimizations
        const tapTargets = document.querySelectorAll('a, button, [role="button"], input[type="submit"], input[type="button"]');
        tapTargets.forEach(target => {
            target.style.minHeight = '44px';
            target.style.minWidth = '44px';
        });
    } else {
        document.body.classList.add('no-touch-device');
    }
}

// ===== PREVENT HORIZONTAL OVERFLOW =====
function preventHorizontalOverflow() {
    // Ensure body doesn't overflow horizontally
    document.body.style.overflowX = 'hidden';
    document.body.style.width = '100%';
    document.body.style.maxWidth = '100vw';
    
    // Fix for iOS Safari 100vh issue
    function setVH() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        
        // Set min-height for mobile viewport
        if (window.innerWidth <= 768) {
            document.documentElement.style.minHeight = 'calc(var(--vh, 1vh) * 100)';
        }
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    
    // Fix images and tables that might cause overflow
    const potentialOverflowElements = document.querySelectorAll('img, table, iframe, video');
    potentialOverflowElements.forEach(element => {
        element.style.maxWidth = '100%';
        element.style.height = 'auto';
    });
    
    // Handle tables specifically
    const tables = document.querySelectorAll('table:not(.no-responsive)');
    tables.forEach(table => {
        if (!table.closest('.table-responsive')) {
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            wrapper.style.overflowX = 'auto';
            wrapper.style.webkitOverflowScrolling = 'touch';
            wrapper.style.width = '100%';
            wrapper.style.margin = '1rem 0';
            wrapper.style.border = '1px solid #eee';
            wrapper.style.borderRadius = '4px';
            
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
        }
    });
}

// ===== ADJUST MOBILE LAYOUT =====
function adjustMobileLayout() {
    const isMobile = window.innerWidth <= 768;
    
    // Stack page container on mobile
    const pageContainers = document.querySelectorAll('.page-container');
    pageContainers.forEach(container => {
        if (isMobile) {
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.gap = '20px';
        } else {
            container.style.display = 'grid';
            container.style.gridTemplateColumns = '2fr 1fr';
            container.style.gap = '40px';
        }
    });
    
    // Adjust sidebar on mobile
    const sidebars = document.querySelectorAll('.page-sidebar');
    sidebars.forEach(sidebar => {
        if (isMobile) {
            sidebar.style.order = '2';
            sidebar.style.marginTop = '20px';
            sidebar.style.maxHeight = 'none';
        } else {
            sidebar.style.order = '';
            sidebar.style.marginTop = '';
            sidebar.style.position = 'sticky';
            sidebar.style.top = '100px';
            sidebar.style.maxHeight = 'calc(100vh - 120px)';
            sidebar.style.overflowY = 'auto';
        }
    });
    
    // Adjust main content on mobile
    const mainContents = document.querySelectorAll('.page-content');
    mainContents.forEach(content => {
        if (isMobile) {
            content.style.order = '1';
        } else {
            content.style.order = '';
        }
    });
    
    // Adjust font sizes for better mobile readability
    if (isMobile) {
        document.documentElement.style.fontSize = '15px';
        
        // Adjust heading sizes
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            const currentSize = parseFloat(window.getComputedStyle(heading).fontSize);
            if (currentSize > 24) {
                heading.style.fontSize = Math.min(currentSize, 28) + 'px';
            }
        });
        
        // Adjust button sizes
        const buttons = document.querySelectorAll('.btn');
        buttons.forEach(button => {
            if (!button.classList.contains('btn-small')) {
                button.style.padding = '12px 20px';
                button.style.fontSize = '16px';
            }
        });
    } else {
        document.documentElement.style.fontSize = '';
    }
}

// ===== PET PAGES SPECIFIC FEATURES =====
function initPetPagesFeatures() {
    const isPetPage = window.location.pathname.includes('cats.html') ||
                     window.location.pathname.includes('dogs.html') ||
                     window.location.pathname.includes('birds.html') ||
                     window.location.pathname.includes('fish.html') ||
                     window.location.pathname.includes('small-animals.html');
    
    if (!isPetPage) return;
    
    // Initialize mobile-optimized pet page features
    initMobileOptimizedImages();
    initMobileSidebarToggle();
    initResponsiveTables();
    initMobileFriendlyContent();
}

// Mobile optimized images
function initMobileOptimizedImages() {
    const images = document.querySelectorAll('.content-image img, .sidebar-image');
    
    images.forEach(img => {
        // Ensure images don't overflow on mobile
        if (window.innerWidth <= 768) {
            img.style.maxHeight = '250px';
            img.style.objectFit = 'cover';
        }
        
        // Add loading attribute for performance
        if (!img.hasAttribute('loading')) {
            img.setAttribute('loading', 'lazy');
        }
    });
}

// Mobile sidebar toggle - SIMPLIFIED
function initMobileSidebarToggle() {
    const sidebar = document.querySelector('.page-sidebar');
    const mainContent = document.querySelector('.page-content');
    
    if (!sidebar || !mainContent || window.innerWidth > 768) return;
    
    // Check if toggle already exists
    if (document.querySelector('.sidebar-toggle-mobile')) return;
    
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'sidebar-toggle-mobile btn btn-secondary';
    toggleBtn.innerHTML = '<i class="fas fa-info-circle"></i> Quick Tips';
    toggleBtn.setAttribute('aria-label', 'Toggle sidebar information');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.style.cssText = 'width: 100%; margin: 10px 0; display: flex; align-items: center; justify-content: center; gap: 8px;';
    
    // Insert before sidebar
    sidebar.parentNode.insertBefore(toggleBtn, sidebar);
    
    // Initially hide sidebar on mobile
    sidebar.style.display = 'none';
    
    // Toggle functionality
    toggleBtn.addEventListener('click', function() {
        const isExpanded = this.getAttribute('aria-expanded') === 'true';
        
        if (isExpanded) {
            sidebar.style.display = 'none';
            this.innerHTML = '<i class="fas fa-info-circle"></i> Quick Tips';
            this.setAttribute('aria-expanded', 'false');
        } else {
            sidebar.style.display = 'block';
            this.innerHTML = '<i class="fas fa-times"></i> Hide Tips';
            this.setAttribute('aria-expanded', 'true');
            
            // Scroll sidebar into view
            setTimeout(() => {
                sidebar.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    });
}

// Responsive tables - SIMPLIFIED
function initResponsiveTables() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        // Ensure table is responsive
        if (table.offsetWidth > window.innerWidth * 0.9) {
            if (!table.closest('.table-responsive')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'table-responsive';
                wrapper.style.overflowX = 'auto';
                table.parentNode.insertBefore(wrapper, table);
                wrapper.appendChild(table);
            }
        }
    });
}

// Mobile friendly content
function initMobileFriendlyContent() {
    if (window.innerWidth <= 768) {
        // Adjust content sections padding
        const contentSections = document.querySelectorAll('.content-section');
        contentSections.forEach(section => {
            section.style.padding = '15px 10px';
        });
        
        // Adjust lists for better mobile readability
        const lists = document.querySelectorAll('ul, ol');
        lists.forEach(list => {
            list.style.paddingLeft = '20px';
            list.style.margin = '10px 0';
        });
        
        // Ensure all interactive elements are tappable
        const interactiveElements = document.querySelectorAll('a, button, [role="button"], input, select, textarea');
        interactiveElements.forEach(element => {
            element.style.minHeight = '44px';
            element.style.minWidth = '44px';
        });
    }
}

// ===== FORM VALIDATION =====
function initFormValidation() {
    // Home page CTA form
    const ctaForm = document.getElementById('ctaForm');
    if (ctaForm) {
        ctaForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = document.getElementById('ctaEmail');
            
            if (validateEmail(emailInput.value)) {
                // Simulate successful submission
                showFormMessage(ctaForm, 'success', 'Thank you! We\'ll contact you within 24 hours.');
                emailInput.value = '';
            } else {
                showFormMessage(ctaForm, 'error', 'Please enter a valid email address.');
                emailInput.focus();
            }
        });
    }
    
    // Consultation form validation
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', validateConsultationForm);
        
        // Mobile optimizations for form
        if (window.innerWidth <= 768) {
            const inputs = consultationForm.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.style.fontSize = '16px'; // Prevents iOS zoom
                input.style.minHeight = '44px';
            });
        }
    }
}

// Email validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Consultation form validation
function validateConsultationForm(e) {
    e.preventDefault();
    const form = e.target;
    let isValid = true;
    
    // Reset all errors
    clearAllFormErrors(form);
    
    // Validate required fields
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showInlineError(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Focus first error field
    if (!isValid) {
        const firstError = form.querySelector('.error');
        if (firstError) {
            firstError.focus();
        }
    }
    
    if (isValid) {
        showFormMessage(form, 'success', 'Thank you! We\'ll contact you within 48 hours.');
        form.reset();
    } else {
        showFormMessage(form, 'error', 'Please correct the errors above.');
    }
}

// Show inline error message
function showInlineError(field, message) {
    clearInlineError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');
    errorDiv.style.cssText = 'color: #f44336; font-size: 14px; margin-top: 5px;';
    
    field.parentNode.appendChild(errorDiv);
    field.classList.add('error');
    field.style.borderColor = '#f44336';
}

// Clear inline error
function clearInlineError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) existingError.remove();
    field.classList.remove('error');
    field.style.borderColor = '';
}

// Clear all form errors
function clearAllFormErrors(form) {
    form.querySelectorAll('.field-error').forEach(error => error.remove());
    form.querySelectorAll('.error').forEach(field => {
        field.classList.remove('error');
        field.style.borderColor = '';
    });
}

// Show form message
function showFormMessage(form, type, message) {
    // Remove existing messages
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) existingMessage.remove();
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.setAttribute('role', 'alert');
    messageDiv.textContent = message;
    messageDiv.style.cssText = 'padding: 15px; margin: 15px 0; border-radius: 5px; font-weight: 500;';
    
    if (type === 'success') {
        messageDiv.style.backgroundColor = '#e8f5e9';
        messageDiv.style.color = '#2e7d32';
        messageDiv.style.borderLeft = '4px solid #4caf50';
    } else {
        messageDiv.style.backgroundColor = '#ffebee';
        messageDiv.style.color = '#c62828';
        messageDiv.style.borderLeft = '4px solid #f44336';
    }
    
    form.insertBefore(messageDiv, form.firstChild);
    
    // Scroll to message on mobile
    if (window.innerWidth <= 768) {
        setTimeout(() => {
            messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    }
    
    // Remove success message after delay
    if (type === 'success') {
        setTimeout(() => {
            if (messageDiv.parentNode) messageDiv.remove();
        }, 5000);
    }
}

// ===== SMOOTH SCROLLING =====
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
                        const mobileToggle = document.querySelector('.mobile-menu-toggle');
                        if (mobileToggle) {
                            mobileToggle.setAttribute('aria-expanded', 'false');
                            mobileToggle.classList.remove('active');
                        }
                        document.body.style.overflow = '';
                        document.body.style.position = '';
                    }
                    
                    // Calculate offset for header
                    let offset = 80;
                    if (window.innerWidth <= 768) {
                        offset = 60;
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
            const iconType = icon.className.match(/fa-([\w-]+)/);
            if (iconType) {
                icon.setAttribute('aria-label', iconType[1].replace(/-/g, ' ') + ' icon');
            }
        }
    });
    
    // Ensure all images have alt text
    document.querySelectorAll('img:not([alt])').forEach(img => {
        if (!img.hasAttribute('alt')) {
            const altText = img.src.split('/').pop().split('.')[0].replace(/[_-]/g, ' ') || 'image';
            img.setAttribute('alt', altText);
        }
    });
    
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.style.cssText = 'position: absolute; top: -40px; left: 0; background: #003B6D; color: white; padding: 10px; z-index: 10000;';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Focus management for modals/dropdowns
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            const activeDropdown = document.querySelector('.dropdown.open');
            if (activeDropdown) {
                const focusable = activeDropdown.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        }
    });
}

// ===== DYNAMIC CONTENT =====
function initDynamicContent() {
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
    
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Highlight active navigation item
function highlightActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('a').forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Reset
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        
        // Check if active
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (linkHref && linkHref.includes(currentPage.replace('.html', '')))) {
            
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
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

// ===== WINDOW RESIZE HANDLER =====
window.addEventListener('resize', debounce(function() {
    const width = window.innerWidth;
    
    // Close mobile menu on desktop
    if (width > 768) {
        const primaryNav = document.querySelector('.primary-nav');
        if (primaryNav && primaryNav.classList.contains('active')) {
            primaryNav.classList.remove('active');
            document.body.style.overflow = '';
            document.body.style.position = '';
        }
        
        // Close dropdowns
        document.querySelectorAll('.dropdown.open').forEach(dropdown => {
            dropdown.classList.remove('open');
        });
        
        // Show sidebar if hidden
        const sidebar = document.querySelector('.page-sidebar');
        if (sidebar) {
            sidebar.style.display = 'block';
        }
        
        // Hide sidebar toggle
        const sidebarToggle = document.querySelector('.sidebar-toggle-mobile');
        if (sidebarToggle) {
            sidebarToggle.style.display = 'none';
        }
    }
    
    // Reinitialize responsive features
    preventHorizontalOverflow();
    adjustMobileLayout();
    
    // Update dropdown hover behavior
    if (width > 1024) {
        document.querySelectorAll('.dropdown').forEach(initDesktopDropdownHover);
    }
}, 250));

// ===== INITIALIZE ON LOAD =====
window.addEventListener('load', function() {
    preventHorizontalOverflow();
    adjustMobileLayout();
    
    // Add loaded class for transitions
    setTimeout(() => {
        document.body.classList.add('page-loaded');
    }, 100);
});

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('Error:', e.message);
    
    // User-friendly error handling
    if (e.message.includes('dropdown') || e.message.includes('navigation')) {
        console.warn('Navigation error detected. Attempting recovery...');
        setTimeout(initMobileNavigation, 100);
        setTimeout(initDropdowns, 100);
    }
});