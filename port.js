// script.js - Enhanced functionality for portfolio website

document.addEventListener('DOMContentLoaded', function() {
    // ===============================
    // 1. Navigation & Scrolling
    // ===============================
    
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
                
                // Update active nav link
                document.querySelectorAll('.main-nav a').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                this.classList.add('active');
            }
        });
    });
    
    // Active navigation based on scroll position
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.main-nav a');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
    
    // ===============================
    // 2. Project Modal System
    // ===============================
    
    // Show project details modal
    function showProjectDetails(project) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('project-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'project-modal';
            modal.className = 'modal';
            document.body.appendChild(modal);
        }
        
        // Populate modal with project details
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-header">
                    <h2>${project.title}</h2>
                </div>
                <div class="modal-body">
                    <img src="${project.image}" alt="${project.title}" class="modal-image">
                    <div class="project-description">
                        <p>${project.description}</p>
                        <div class="tech-section">
                            <h4>Technologies Used</h4>
                            <div class="tech-list">
                                ${project.technologies ? project.technologies.map(tech => 
                                    `<span class="tech-badge">${tech}</span>`).join('') : 'Not specified'}
                            </div>
                        </div>
                    </div>
                    <div class="project-links">
                        <a href="${project.link}" class="btn btn-primary" target="_blank">View Live Project</a>
                    </div>
                </div>
            </div>
        `;
        
        // Show modal
        modal.style.display = 'block';
        
        // Add close button handler
        modal.querySelector('.close-modal').addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        // Close when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Set up project modal click listeners on static cards
    function initProjectModals() {
        document.querySelectorAll('.project-card').forEach(card => {
            const detailsBtn = card.querySelector('.project-details-btn');
            if (!detailsBtn) return;

            detailsBtn.addEventListener('click', () => {
                const title = card.querySelector('h3').textContent;
                const description = card.querySelector('p').textContent;
                const image = card.querySelector('img').src;
                const techBadges = Array.from(card.querySelectorAll('.tech-badge')).map(b => b.textContent);
                const link = card.querySelector('.btn-outline').getAttribute('href') || '#';
                
                showProjectDetails({ title, description, image, technologies: techBadges, link });
            });

            // Card hover effects
            card.addEventListener('mouseenter', function() {
                this.classList.add('card-hover');
            });
            
            card.addEventListener('mouseleave', function() {
                this.classList.remove('card-hover');
            });
        });
    }

    initProjectModals();
    
    // ===============================
    // 3. Contact Form with Validation & Storage
    // ===============================
    
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Form validation
            if (!name || !email || !message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }
            
            // Email validation
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Create message object
            const newMessage = {
                id: Date.now(),
                name,
                email,
                message,
                date: new Date().toISOString(),
                read: false
            };
            
            // Store in local storage safely
            try {
                const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
                messages.push(newMessage);
                localStorage.setItem('contactMessages', JSON.stringify(messages));
            } catch (err) {
                console.error("Error saving contact message:", err);
            }
            
            // Show success message
            showNotification('Message sent successfully! I will get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Email validation helper
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }
    
    // ===============================
    // 4. Notification System
    // ===============================
    
    function showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Set content and style based on type
        notification.textContent = message;
        notification.className = `notification ${type}`;
        
        // Show notification
        notification.style.display = 'block';
        notification.style.opacity = '1';
        
        // Hide after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 500);
        }, 3000);
    }
    
    // ===============================
    // 5. Portfolio Filter System
    // ===============================
    
    function initPortfolioFilter() {
        const projectsSection = document.querySelector('#projects');
        if (!projectsSection) return;
        
        // Read technologies statically from the DOM cards
        const allTechnologies = new Set();
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            const techString = card.getAttribute('data-technologies');
            if (techString) {
                techString.split(',').forEach(tech => allTechnologies.add(tech.trim()));
            }
        });
        
        // Create filter UI
        const filterContainer = document.createElement('div');
        filterContainer.className = 'filter-container';
        
        filterContainer.innerHTML = `
            <div class="filter-heading">Filter by technology:</div>
            <div class="filter-buttons">
                <button class="filter-btn active" data-filter="all">All</button>
                ${Array.from(allTechnologies).map(tech => 
                    `<button class="filter-btn" data-filter="${tech}">${tech}</button>`).join('')}
            </div>
        `;
        
        // Insert filter before project grid
        const projectGrid = projectsSection.querySelector('.project-grid');
        projectsSection.insertBefore(filterContainer, projectGrid);
        
        // Add filter functionality
        const filterButtons = filterContainer.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filter = this.getAttribute('data-filter');
                
                // Filter projects
                cards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                    } else {
                        const techString = card.getAttribute('data-technologies') || '';
                        const technologies = techString.split(',').map(t => t.trim());
                        
                        if (technologies.includes(filter)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });

                // Trigger a scroll event to update elements' opacity in view (animate-visible)
                window.dispatchEvent(new Event('scroll'));
            });
        });
    }

    initPortfolioFilter();
    
    // ===============================
    // 6. Scroll Animation System
    // ===============================
    
    // Fade in elements as they scroll into view
    function initScrollAnimations() {
        const animateElements = document.querySelectorAll('.project-card, .hero-content, .about-content, h2');
        
        // Add animation class to elements
        animateElements.forEach(element => {
            element.classList.add('animate-on-scroll');
        });
        
        // Animation on scroll function
        function checkAnimation() {
            animateElements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (elementPosition < windowHeight * 0.9) {
                    element.classList.add('animate-visible');
                }
            });
        }
        
        // Run once on load
        checkAnimation();
        
        // Run on scroll
        window.addEventListener('scroll', checkAnimation);
    }
    
    // Initialize animations
    initScrollAnimations();
    
    // ===============================
    // 7. Portfolio Analytics
    // ===============================
    
    function initAnalytics() {
        try {
            // Page visit tracking
            const visitDate = new Date().toISOString();
            const visits = JSON.parse(localStorage.getItem('portfolioVisits')) || [];
            visits.push({ date: visitDate, page: window.location.pathname });
            localStorage.setItem('portfolioVisits', JSON.stringify(visits));
            
            // Section view tracking
            const sections = document.querySelectorAll('section');
            const viewedSections = new Set();
            
            function trackSectionViews() {
                sections.forEach(section => {
                    const sectionTop = section.getBoundingClientRect().top;
                    const windowHeight = window.innerHeight;
                    
                    if (sectionTop < windowHeight * 0.7 && !viewedSections.has(section.id)) {
                        viewedSections.add(section.id);
                        
                        // Record section view
                        const sectionViews = JSON.parse(localStorage.getItem('sectionViews')) || {};
                        sectionViews[section.id] = (sectionViews[section.id] || 0) + 1;
                        localStorage.setItem('sectionViews', JSON.stringify(sectionViews));
                    }
                });
            }
            
            // Track section views on scroll
            window.addEventListener('scroll', trackSectionViews);
            
            // Initial check
            trackSectionViews();
        } catch (err) {
            console.error("Analytics error:", err);
        }
    }
    
    // Initialize analytics
    initAnalytics();
});