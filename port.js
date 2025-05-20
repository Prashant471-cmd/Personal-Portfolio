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
            
            if (pageYOffset >= sectionTop - 100) {
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
    // 2. Project Portfolio Enhancement
    // ===============================
    
    // Project data - store in local storage for persistence
    const projectsData = [
        {
            id: 1,
            title: "E-commerce Website",
            description: "A responsive online store with modern design and smooth navigation",
            image: "https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg",
            link: "#",
            technologies: ["HTML", "CSS", "JavaScript", "Responsive Design"]
        },
        {
            id: 2,
            title: "Restaurant Website",
            description: "Clean and elegant design for a local restaurant",
            image: "https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg",
            link: "#",
            technologies: ["HTML", "CSS", "JavaScript", "Web Accessibility"]
        },
        {
            id: 3,
            title: "Photography Portfolio",
            description: "Minimalist portfolio for a professional photographer",
            image: "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg",
            link: "#",
            technologies: ["HTML", "CSS", "JavaScript", "Performance Optimization"]
        }
    ];
    
    // Initialize localStorage projects if not exists
    if (!localStorage.getItem('portfolioProjects')) {
        localStorage.setItem('portfolioProjects', JSON.stringify(projectsData));
    }
    
    // Render projects function
    function renderProjects() {
        const projectGrid = document.querySelector('.project-grid');
        if (!projectGrid) return;
        
        // Get projects from localStorage
        const projects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];
        
        // Clear existing projects
        projectGrid.innerHTML = '';
        
        // Create project cards
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.dataset.id = project.id;
            
            // Create tech badges HTML
            const techBadges = project.technologies ? 
                `<div class="tech-badges">
                    ${project.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                </div>` : '';
            
            projectCard.innerHTML = `
                <img src="${project.image}" alt="${project.title}">
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                ${techBadges}
                <div class="project-actions">
                    <a href="${project.link}" class="btn btn-outline" target="_blank">View Project</a>
                    <button class="btn btn-icon project-details-btn" title="View Details">
                        <i class="fas fa-info-circle"></i>
                    </button>
                </div>
            `;
            
            projectGrid.appendChild(projectCard);
            
            // Add click handler for details button
            projectCard.querySelector('.project-details-btn').addEventListener('click', () => {
                showProjectDetails(project);
            });
        });
        
        // Add hover effects
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.classList.add('card-hover');
            });
            
            card.addEventListener('mouseleave', function() {
                this.classList.remove('card-hover');
            });
        });
    }
    
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
    
    // Initialize projects
    renderProjects();
    
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
            
            // Store in local storage
            saveMessage(newMessage);
            
            // Show success message
            showNotification('Message sent successfully! I will get back to you soon.', 'success');
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Save message to localStorage
    function saveMessage(message) {
        const messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages.push(message);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
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
    // 5. Dynamic Skills Visualization
    // ===============================
    
    // Skill data
    const skillsData = [
        { name: "HTML", proficiency: 90 },
        { name: "CSS", proficiency: 85 },
        { name: "Responsive Design", proficiency: 80 },
        { name: "Web Accessibility", proficiency: 75 },
        { name: "Cross-browser Compatibility", proficiency: 70 },
        { name: "Performance Optimization", proficiency: 65 }
    ];
    
    // Initialize skills if not in localStorage
    if (!localStorage.getItem('portfolioSkills')) {
        localStorage.setItem('portfolioSkills', JSON.stringify(skillsData));
    }
    
    // Render skills with visual indicators
    function renderSkills() {
        const skillList = document.querySelector('.skill-list');
        if (!skillList) return;
        
        // Get skills from localStorage
        const skills = JSON.parse(localStorage.getItem('portfolioSkills')) || [];
        
        // Clear existing skills
        skillList.innerHTML = '';
        
        // Create skill items
        skills.forEach(skill => {
            const skillItem = document.createElement('li');
            
            skillItem.innerHTML = `
                <span class="skill-name">${skill.name}</span>
                <div class="skill-bar">
                    <div class="skill-progress" style="width: ${skill.proficiency}%"></div>
                </div>
                <span class="skill-percentage">${skill.proficiency}%</span>
            `;
            
            skillList.appendChild(skillItem);
        });
    }
    
    // Initialize skills visualization
    renderSkills();
    
    // ===============================
    // 6. Theme Switcher
    // ===============================
    
    function createThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.title = 'Toggle Dark/Light mode';
        
        document.body.appendChild(themeToggle);
        
        // Check for saved theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
        
        // Toggle theme on click
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            
            if (document.body.classList.contains('light-mode')) {
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme', 'light');
            } else {
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', 'dark');
            }
        });
    }
    
    // Initialize theme toggle
    createThemeToggle();
    
    // ===============================
    // 7. Portfolio Filter System
    // ===============================
    
    function createPortfolioFilter() {
        const projectsSection = document.querySelector('#projects');
        if (!projectsSection) return;
        
        // Get all unique technologies from projects
        const projects = JSON.parse(localStorage.getItem('portfolioProjects')) || [];
        const allTechnologies = new Set();
        
        projects.forEach(project => {
            if (project.technologies) {
                project.technologies.forEach(tech => allTechnologies.add(tech));
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
                document.querySelectorAll('.project-card').forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                    } else {
                        const projectId = parseInt(card.dataset.id);
                        const project = projects.find(p => p.id === projectId);
                        
                        if (project && project.technologies && project.technologies.includes(filter)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    }
    
    // Initialize portfolio filter
    createPortfolioFilter();
    
    // ===============================
    // 8. Simple Animation System
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
    // 9. Simple Portfolio Analytics
    // ===============================
    
    function initAnalytics() {
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
    }
    
    // Initialize analytics
    initAnalytics();
});