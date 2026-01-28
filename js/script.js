
/**
 * Paradigm Pet Professionals - Main JavaScript File
 * Author: [Your Name]
 * Date: January 28, 2026
 * 
 * This file handles:
 * 1. Mobile navigation toggle
 * 2. Form validation
 * 3. Interactive elements
 * 4. Accessibility enhancements
 * 5. Pet care guides navigation (Cats, Dogs, Birds, Fish, Small Animals)
 */

// ===== DOCUMENT READY =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Paradigm Pet Professionals website loaded');
    
    // Initialize all functionality
    initMobileMenu();
    initDropdowns();
    initFormValidation();
    initSmoothScrolling();
    initAccessibilityFeatures();
    initDynamicContent();
    initPetPagesFeatures();
});

// ===== MOBILE NAVIGATION =====
function initMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const primaryNav = document.querySelector('.primary-nav');
    const mainNav = document.querySelector('.main-nav .nav-menu');
    
    // If no mobile toggle but we have a main nav, create one for mobile
    if (!mobileToggle && mainNav && window.innerWidth <= 768) {
        createMobileMenuToggle(mainNav);
        return;
    }
    
    if (!mobileToggle || !primaryNav) return;
    
    // Toggle mobile menu
    mobileToggle.addEventListener('click', function() {
        primaryNav.classList.toggle('active');
        mobileToggle.setAttribute('aria-expanded', 
            primaryNav.classList.contains('active') ? 'true' : 'false'
        );
        
        // Update icon
        const icon = mobileToggle.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!primaryNav.contains(event.target) && 
            !mobileToggle.contains(event.target) && 
            primaryNav.classList.contains('active')) {
            primaryNav.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            
            // Reset icon
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        }
    });
    
    // Close menu on escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && primaryNav.classList.contains('active')) {
            primaryNav.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            
            // Reset icon
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
            
            // Return focus to toggle button
            mobileToggle.focus();
        }
    });
}

// Create mobile menu toggle if it doesn't exist
function createMobileMenuToggle(navElement) {
    const mobileToggle = document.createElement('button');
    mobileToggle.className = 'mobile-menu-toggle';
    mobileToggle.setAttribute('aria-label', 'Toggle navigation menu');
    mobileToggle.setAttribute('aria-expanded', 'false');
    mobileToggle.innerHTML = '<i class="fas fa-bars"></i>';
    
    const navContainer = navElement.parentElement;
    navContainer.insertBefore(mobileToggle, navElement);
    
    // Add mobile class to nav
    navElement.classList.add('primary-nav');
    
    // Reinitialize mobile menu
    initMobileMenu();
}

// ===== DROPDOWN MENUS =====
function initDropdowns() {
    // Find all dropdown toggles in the navigation
    const dropdownToggles = document.querySelectorAll('.dropdown > a, .nav-menu .dropdown > a');
    
    // Also look for any element with dropdown class
    const dropdownParents = document.querySelectorAll('.dropdown, .nav-menu li:has(ul)');
    
    dropdownParents.forEach(parent => {
        const toggle = parent.querySelector('a');
        if (!toggle) return;
        
        // Handle hover on desktop
        parent.addEventListener('mouseenter', function() {
            if (window.innerWidth > 768) {
                this.classList.add('open');
            }
        });
        
        parent.addEventListener('mouseleave', function() {
            if (window.innerWidth > 768) {
                this.classList.remove('open');
            }
        });
        
        // Handle click on mobile
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle this dropdown
                parent.classList.toggle('open');
                
                // Close other dropdowns in the same menu
                const allDropdowns = document.querySelectorAll('.dropdown.open, .nav-menu li.open');
                allDropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== parent && 
                        otherDropdown.closest('.nav-menu') === parent.closest('.nav-menu')) {
                        otherDropdown.classList.remove('open');
                    }
                });
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
        if (window.innerWidth <= 768) {
            // Check if click is inside any dropdown
            const clickedInsideDropdown = event.target.closest('.dropdown') || 
                                         event.target.closest('.nav-menu li:has(ul)');
            
            if (!clickedInsideDropdown) {
                // Close all dropdowns
                document.querySelectorAll('.dropdown.open, .nav-menu li.open').forEach(dropdown => {
                    dropdown.classList.remove('open');
                });
            }
        }
    });
    
    // Close dropdowns on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && window.innerWidth <= 768) {
            document.querySelectorAll('.dropdown.open, .nav-menu li.open').forEach(dropdown => {
                dropdown.classList.remove('open');
            });
        }
    });
}

// ===== PET PAGES SPECIFIC FEATURES =====
function initPetPagesFeatures() {
    // Only run on pet pages
    const isPetPage = window.location.pathname.includes('cats.html') ||
                     window.location.pathname.includes('dogs.html') ||
                     window.location.pathname.includes('birds.html') ||
                     window.location.pathname.includes('fish.html') ||
                     window.location.pathname.includes('small-animals.html');
    
    if (!isPetPage) return;
    
    console.log('Initializing pet page features for:', window.location.pathname);
    
    // 1. Image lazy loading for pet pages
    initPetPageLazyLoading();
    
    // 2. Sidebar toggle for mobile
    initMobileSidebar();
    
    // 3. Tabbed content for comparison tables
    initComparisonTables();
    
    // 4. Expandable content sections
    initExpandableSections();
    
    // 5. Print/download functionality
    initPrintDownload();
}

// Lazy load images on pet pages
function initPetPageLazyLoading() {
    const petImages = document.querySelectorAll('.pet-intro-image img, .content-image img, .sidebar-image img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Load image if it has data-src
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        delete img.dataset.src;
                    }
                    
                    // Add loaded class for animation
                    img.classList.add('loaded');
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px', // Start loading 50px before image enters viewport
            threshold: 0.1
        });
        
        petImages.forEach(img => {
            // Add loading animation
            img.classList.add('lazy-load');
            imageObserver.observe(img);
        });
    }
}

// Mobile sidebar toggle
function initMobileSidebar() {
    if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.page-sidebar');
        const mainContent = document.querySelector('.page-content');
        
        if (!sidebar || !mainContent) return;
        
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'sidebar-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-chevron-right"></i> View Sidebar';
        toggleBtn.setAttribute('aria-label', 'Toggle sidebar');
        toggleBtn.setAttribute('aria-expanded', 'false');
        
        // Insert after main content
        mainContent.parentNode.insertBefore(toggleBtn, sidebar);
        
        // Toggle sidebar
        toggleBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            sidebar.classList.toggle('mobile-open');
            
            // Update icon and text
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-chevron-right');
                icon.classList.toggle('fa-chevron-left');
            }
            this.innerHTML = isExpanded ? 
                '<i class="fas fa-chevron-right"></i> View Sidebar' : 
                '<i class="fas fa-chevron-left"></i> Hide Sidebar';
        });
        
        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', function(event) {
            if (window.innerWidth <= 768 && 
                !sidebar.contains(event.target) && 
                !toggleBtn.contains(event.target) && 
                sidebar.classList.contains('mobile-open')) {
                sidebar.classList.remove('mobile-open');
                toggleBtn.setAttribute('aria-expanded', 'false');
                toggleBtn.innerHTML = '<i class="fas fa-chevron-right"></i> View Sidebar';
            }
        });
    }
}

// Make comparison tables responsive
function initComparisonTables() {
    const comparisonTables = document.querySelectorAll('.comparison-table');
    
    comparisonTables.forEach(table => {
        if (window.innerWidth <= 768) {
            // On mobile, make tables horizontally scrollable
            const wrapper = document.createElement('div');
            wrapper.className = 'table-responsive';
            wrapper.style.overflowX = 'auto';
            wrapper.style.webkitOverflowScrolling = 'touch';
            
            table.parentNode.insertBefore(wrapper, table);
            wrapper.appendChild(table);
            
            // Add hint for scrolling
            const scrollHint = document.createElement('div');
            scrollHint.className = 'scroll-hint';
            scrollHint.innerHTML = '<i class="fas fa-arrow-right"></i> Scroll horizontally to view all columns';
            scrollHint.style.cssText = 'text-align: center; padding: 8px; color: var(--secondary-dark); font-size: 0.9rem;';
            
            wrapper.parentNode.insertBefore(scrollHint, wrapper.nextSibling);
        }
    });
    
    // Recheck on resize
    window.addEventListener('resize', debounce(function() {
        const tables = document.querySelectorAll('.comparison-table');
        tables.forEach(table => {
            const wrapper = table.parentElement;
            if (window.innerWidth <= 768 && wrapper.className !== 'table-responsive') {
                // Create wrapper for mobile
                const newWrapper = document.createElement('div');
                newWrapper.className = 'table-responsive';
                newWrapper.style.overflowX = 'auto';
                newWrapper.style.webkitOverflowScrolling = 'touch';
                
                table.parentNode.insertBefore(newWrapper, table);
                newWrapper.appendChild(table);
            } else if (window.innerWidth > 768 && wrapper.className === 'table-responsive') {
                // Remove wrapper on desktop
                wrapper.parentNode.insertBefore(table, wrapper);
                wrapper.remove();
            }
        });
    }, 250));
}

// Expandable sections for detailed content
function initExpandableSections() {
    // Create expandable sections for long content
    const longSections = document.querySelectorAll('.content-section');
    
    longSections.forEach((section, index) => {
        const content = section.querySelector('p, .info-card, ul');
        if (!content || section.textContent.length < 500) return;
        
        // Check if already has toggle
        if (section.querySelector('.expand-toggle')) return;
        
        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'expand-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i> Read More';
        toggleBtn.setAttribute('aria-expanded', 'false');
        toggleBtn.setAttribute('aria-controls', `section-${index}-content`);
        
        // Wrap content
        const contentWrapper = document.createElement('div');
        contentWrapper.id = `section-${index}-content`;
        contentWrapper.className = 'expandable-content';
        contentWrapper.style.maxHeight = '300px';
        contentWrapper.style.overflow = 'hidden';
        contentWrapper.style.position = 'relative';
        
        // Add gradient overlay
        const overlay = document.createElement('div');
        overlay.className = 'content-overlay';
        overlay.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: 50px;
            background: linear-gradient(transparent, white);
            pointer-events: none;
        `;
        
        contentWrapper.appendChild(content.cloneNode(true));
        contentWrapper.appendChild(overlay);
        content.replaceWith(contentWrapper);
        
        // Insert toggle button
        contentWrapper.parentNode.insertBefore(toggleBtn, contentWrapper.nextSibling);
        
        // Toggle functionality
        toggleBtn.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            
            if (isExpanded) {
                contentWrapper.style.maxHeight = '300px';
                this.innerHTML = '<i class="fas fa-chevron-down"></i> Read More';
                overlay.style.display = 'block';
            } else {
                contentWrapper.style.maxHeight = contentWrapper.scrollHeight + 'px';
                this.innerHTML = '<i class="fas fa-chevron-up"></i> Show Less';
                overlay.style.display = 'none';
            }
        });
    });
}

// Print and download functionality for care guides
function initPrintDownload() {
    // Add print buttons to download cards
    const downloadCards = document.querySelectorAll('.download-card');
    
    downloadCards.forEach(card => {
        const printBtn = document.createElement('button');
        printBtn.className = 'btn btn-outline';
        printBtn.style.marginLeft = '10px';
        printBtn.innerHTML = '<i class="fas fa-print"></i> Print';
        
        printBtn.addEventListener('click', function() {
            printCareGuide();
        });
        
        const existingBtn = card.querySelector('.btn');
        if (existingBtn) {
            existingBtn.parentNode.insertBefore(printBtn, existingBtn.nextSibling);
        }
    });
}

function printCareGuide() {
    const petType = document.querySelector('h1').textContent.toLowerCase();
    const printContent = document.querySelector('.page-content').innerHTML;
    const sidebarContent = document.querySelector('.page-sidebar').innerHTML;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
        <head>
            <title>${document.title} - Print</title>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                h1, h2, h3 { color: #003b6d; }
                .tip-list li { margin-bottom: 8px; }
                .warning-sign { background: #fff3cd; padding: 10px; margin: 10px 0; }
                .info-card { background: #f8f9fa; padding: 15px; margin: 15px 0; }
                @media print {
                    .no-print { display: none; }
                }
            </style>
        </head>
        <body>
            <h1>${document.querySelector('h1').textContent}</h1>
            ${printContent}
            <hr>
            <h2>Quick Reference</h2>
            ${sidebarContent}
            <p class="no-print" style="margin-top: 20px; font-size: 0.9em; color: #666;">
                Printed from Paradigm Pet Professionals - ${new Date().toLocaleDateString()}
            </p>
            <script>
                window.onload = function() { window.print(); };
            </script>
        </body>
        </html>
    `);
    printWindow.document.close();
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
                showFormMessage(ctaForm, 'success', 'Thank you! We\'ll contact you within 24 hours to discuss your pet\'s needs.');
                emailInput.value = '';
                
                // Analytics event (simulated)
                console.log('CTA form submitted with email:', emailInput.value);
            } else {
                showFormMessage(ctaForm, 'error', 'Please enter a valid email address.');
                emailInput.focus();
            }
        });
    }
    
    // Consultation page form (when we create it)
    const consultationForm = document.getElementById('consultationForm');
    if (consultationForm) {
        consultationForm.addEventListener('submit', validateConsultationForm);
    }
    
    // Real-time email validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                showInlineError(this, 'Please enter a valid email address (e.g., name@example.com)');
            } else {
                clearInlineError(this);
            }
        });
    });
    
    // Real-time phone validation
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[name="phone"]');
    phoneInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                showInlineError(this, 'Please enter a valid 10-digit phone number');
            } else {
                clearInlineError(this);
            }
        });
        
        // Format phone number as user types
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
}

// Email validation helper
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Phone validation helper
function validatePhone(phone) {
    // Remove all non-digits
    const digits = phone.replace(/\D/g, '');
    return digits.length === 10;
}

// Phone number formatting
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 3 && value.length <= 6) {
        value = value.replace(/(\d{3})(\d+)/, '($1) $2');
    } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d+)/, '($1) $2-$3');
    }
    
    input.value = value;
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
            
            // Focus on first invalid field
            if (isValid === false) {
                field.focus();
                isValid = null; // Prevent multiple focus calls
            }
        }
    });
    
    // Validate email
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value && !validateEmail(emailField.value)) {
        showInlineError(emailField, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate phone
    const phoneField = form.querySelector('input[type="tel"], input[name="phone"]');
    if (phoneField && phoneField.value && !validatePhone(phoneField.value)) {
        showInlineError(phoneField, 'Please enter a valid 10-digit phone number');
        isValid = false;
    }
    
    // Validate pet age (if it's a number field)
    const ageField = form.querySelector('input[name="petAge"]');
    if (ageField && ageField.value) {
        const age = parseInt(ageField.value);
        if (isNaN(age) || age < 0 || age > 30) {
            showInlineError(ageField, 'Please enter a valid age between 0 and 30');
            isValid = false;
        }
    }
    
    if (isValid) {
        // Simulate form submission
        showFormMessage(form, 'success', 'Thank you for your consultation request! A Pexpert will contact you within 48 hours.');
        form.reset();
        
        // In a real implementation, you would send data to a server here
        console.log('Consultation form submitted successfully');
    } else {
        showFormMessage(form, 'error', 'Please correct the errors above and try again.');
    }
}

// Show inline error message
function showInlineError(field, message) {
    clearInlineError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.setAttribute('role', 'alert');
    
    field.parentNode.insertBefore(errorDiv, field.nextSibling);
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    // Announce error to screen readers
    announceToScreenReader(message);
}

// Clear inline error
function clearInlineError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.classList.remove('error');
    field.setAttribute('aria-invalid', 'false');
}

// Clear all form errors
function clearAllFormErrors(form) {
    form.querySelectorAll('.field-error').forEach(error => error.remove());
    form.querySelectorAll('.error').forEach(field => {
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
    });
}

// Show form success/error message
function showFormMessage(form, type, message) {
    // Remove existing messages
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.setAttribute('role', 'alert');
    messageDiv.textContent = message;
    
    // Insert at beginning of form
    form.insertBefore(messageDiv, form.firstChild);
    
    // Announce to screen readers
    announceToScreenReader(message);
    
    // Scroll to message if it's not visible
    messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Remove message after 10 seconds (for success messages)
    if (type === 'success') {
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 10000);
    }
}

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    // Handle anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Skip dropdown toggles
        if (anchor.classList.contains('dropdown-toggle')) return;
        
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only process actual anchor links (not # alone)
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
                    
                    // Scroll to target
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    
                    // Update URL without page jump
                    history.pushState(null, null, href);
                    
                    // Focus on target for accessibility
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
    // Add aria-labels to decorative icons
    document.querySelectorAll('.fas, .fab').forEach(icon => {
        if (!icon.hasAttribute('aria-label') && !icon.closest('button, a')) {
            // Get icon purpose from class names
            const iconClass = Array.from(icon.classList).find(cls => cls.startsWith('fa-'));
            if (iconClass) {
                const label = iconClass.replace('fa-', '').replace('-', ' ') + ' icon';
                icon.setAttribute('aria-label', label);
            }
        }
    });
    
    // Handle focus trapping for dropdowns on mobile
    document.addEventListener('keydown', function(e) {
        const openDropdown = document.querySelector('.dropdown.open');
        
        if (openDropdown && e.key === 'Tab') {
            const focusableElements = openDropdown.querySelectorAll('a, button, input');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
            }
        }
    });
    
    // Announce dynamic content to screen readers
    window.announceToScreenReader = announceToScreenReader;
}

// Screen reader announcement function
function announceToScreenReader(message, priority = 'polite') {
    // Create or get announcement div
    let announcementDiv = document.getElementById('screen-reader-announcement');
    
    if (!announcementDiv) {
        announcementDiv = document.createElement('div');
        announcementDiv.id = 'screen-reader-announcement';
        announcementDiv.setAttribute('aria-live', 'polite');
        announcementDiv.setAttribute('aria-atomic', 'true');
        announcementDiv.style.cssText = `
            position: absolute;
            width: 1px;
            height: 1px;
            padding: 0;
            margin: -1px;
            overflow: hidden;
            clip: rect(0, 0, 0, 0);
            white-space: nowrap;
            border: 0;
        `;
        document.body.appendChild(announcementDiv);
    }
    
    // Update priority if needed
    if (priority === 'assertive') {
        announcementDiv.setAttribute('aria-live', 'assertive');
    } else {
        announcementDiv.setAttribute('aria-live', 'polite');
    }
    
    // Update message
    announcementDiv.textContent = message;
    
    // Clear message after a delay (so it can be announced again)
    setTimeout(() => {
        if (announcementDiv.textContent === message) {
            announcementDiv.textContent = '';
        }
    }, 1000);
}

// ===== DYNAMIC CONTENT =====
function initDynamicContent() {
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    // Add current year to footer
    const yearSpans = document.querySelectorAll('.current-year');
    if (yearSpans.length > 0) {
        const currentYear = new Date().getFullYear();
        yearSpans.forEach(span => {
            span.textContent = currentYear;
        });
    }
    
    // Highlight active nav item based on current page
    highlightActiveNavItem();
    
    // Add loading states to buttons
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                const originalText = submitButton.textContent;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitButton.disabled = true;
                
                // Reset button after 5 seconds (in case of error)
                setTimeout(() => {
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 5000);
            }
        });
    });
}

// Highlight active navigation item - UPDATED FOR ALL PET PAGES
function highlightActiveNavItem() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log('Current page:', currentPage);
    
    // Find all navigation links
    const allNavLinks = document.querySelectorAll('a');
    
    allNavLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Remove existing active states
        link.classList.remove('active');
        link.removeAttribute('aria-current');
        
        // Check if this link points to current page
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage === 'index.html' && linkHref === 'index.html') ||
            (linkHref && linkHref.includes(currentPage.replace('.html', '')))) {
            
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
            
            // Also highlight parent dropdown if exists
            const parentDropdown = link.closest('.dropdown');
            if (parentDropdown) {
                const dropdownToggle = parentDropdown.querySelector('a');
                if (dropdownToggle) {
                    dropdownToggle.classList.add('active');
                }
            }
        }
    });
    
    // Special handling for pet pages dropdown
    const petPages = ['cats.html', 'dogs.html', 'birds.html', 'fish.html', 'small-animals.html'];
    if (petPages.includes(currentPage)) {
        // Find and highlight "Pet Care Guides" parent item
        const petGuidesLinks = document.querySelectorAll('a[href*="cats.html"], a[href*="dogs.html"]');
        petGuidesLinks.forEach(link => {
            const parentLi = link.closest('li');
            if (parentLi && parentLi.parentElement.classList.contains('dropdown-menu')) {
                const dropdownToggle = parentLi.closest('.dropdown').querySelector('.dropdown-toggle');
                if (dropdownToggle) {
                    dropdownToggle.classList.add('active');
                }
            }
        });
    }
}

// ===== UTILITY FUNCTIONS =====

// Debounce function for performance
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

// Throttle function for performance
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
    // Close mobile menu when resizing to desktop
    if (window.innerWidth > 768) {
        const primaryNav = document.querySelector('.primary-nav');
        if (primaryNav && primaryNav.classList.contains('active')) {
            primaryNav.classList.remove('active');
            const mobileToggle = document.querySelector('.mobile-menu-toggle');
            if (mobileToggle) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                
                // Reset icon
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
        }
        
        // Close all dropdowns on desktop resize
        document.querySelectorAll('.dropdown.open, .nav-menu li.open').forEach(dropdown => {
            dropdown.classList.remove('open');
        });
    }
    
    // Reinitialize pet page features on resize
    const isPetPage = window.location.pathname.includes('cats.html') ||
                     window.location.pathname.includes('dogs.html') ||
                     window.location.pathname.includes('birds.html') ||
                     window.location.pathname.includes('fish.html') ||
                     window.location.pathname.includes('small-animals.html');
    
    if (isPetPage) {
        initMobileSidebar();
        initComparisonTables();
    }
}, 250));

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    
    // Don't show error messages to users in production
    // In development, you might want to display them
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Show error in console only for development
    }
});

// ===== PET PAGES INITIALIZATION =====
// Check if we're on a pet page and run initialization
function checkAndInitPetPages() {
    const petPagePattern = /(cats|dogs|birds|fish|small-animals)\.html$/i;
    if (petPagePattern.test(window.location.pathname)) {
        initPetPagesFeatures();
    }
}

// Run check on page load and navigation
checkAndInitPetPages();

// ===== EXPORT FUNCTIONS FOR TESTING =====
// (Only in development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.PPP = {
        validateEmail,
        validatePhone,
        showInlineError,
        clearInlineError,
        showFormMessage,
        announceToScreenReader,
        initPetPagesFeatures,
        highlightActiveNavItem
    };
}