// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize GSAP and ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    
    // Custom cursor
    const cursor = document.querySelector('.cursor');
    const cursorFollower = document.querySelector('.cursor-follower');
    
    document.addEventListener('mousemove', function(e) {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.05
        });
        
        gsap.to(cursorFollower, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.15
        });
    });
    
    // Add hover effect to links and buttons
    const links = document.querySelectorAll('a, button, .gallery-item, .hamburger');
    
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            cursorFollower.classList.add('active');
            gsap.to(cursor, { scale: 1.5, duration: 0.2 });
            gsap.to(cursorFollower, { scale: 0.5, duration: 0.2 });
        });
        
        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            cursorFollower.classList.remove('active');
            gsap.to(cursor, { scale: 1, duration: 0.2 });
            gsap.to(cursorFollower, { scale: 1, duration: 0.2 });
        });
    });
    
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navbar.classList.toggle('active');
    });
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navbar.classList.remove('active');
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
    
    // Split text animation for hero section
    const splitTextElements = document.querySelectorAll('.split-text');
    
    splitTextElements.forEach(element => {
        const text = element.textContent;
        element.textContent = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i] === ' ' ? ' ' : text[i];
            element.appendChild(span);
            
            gsap.from(span, {
                y: 50,
                opacity: 0,
                duration: 0.3,
                delay: 0.2 + (i * 0.02),
                ease: 'power2.out'
            });
        }
    });
    
    // Reveal animations on scroll
    const revealTextElements = document.querySelectorAll('.reveal-text');
    const revealItems = document.querySelectorAll('.reveal-item');
    const contactRevealItems = document.querySelectorAll('.contact .reveal-item, .contact .reveal-text');
    
    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight * 0.9) &&
            rect.bottom >= 0
        );
    }
    
    // Initial check for elements in viewport
    function checkViewport() {
        revealTextElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('active');
            }
        });
        
        revealItems.forEach((item, index) => {
            if (isInViewport(item)) {
                // Skip delay for contact section items
                if (item.closest('.contact')) {
                    item.classList.add('active');
                } else {
                    setTimeout(() => {
                        item.classList.add('active');
                    }, index * 50);
                }
            }
        });
        
        // Make contact section items appear immediately when in viewport
        contactRevealItems.forEach(item => {
            if (isInViewport(item)) {
                item.classList.add('active');
            }
        });
    }
    
    // Run on initial load
    checkViewport();
    
    // Check on scroll
    window.addEventListener('scroll', checkViewport);
    
    // Parallax effect
    const parallaxElements = document.querySelectorAll('.parallax-img');
    
    parallaxElements.forEach(element => {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            const parent = element.parentElement;
            const parentTop = parent.getBoundingClientRect().top + scrollPosition;
            const speed = 0.3;
            
            if (scrollPosition > parentTop - window.innerHeight && 
                scrollPosition < parentTop + parent.offsetHeight) {
                const yPos = (scrollPosition - parentTop) * speed;
                gsap.to(element, {
                    y: yPos,
                    ease: 'none'
                });
            }
        });
    });
    
    // GSAP animations
    // Hero animations
    gsap.from('.hero-content', {
        y: 50,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out'
    });
    
    gsap.from('.scroll-indicator', {
        y: 30,
        opacity: 0,
        duration: 0.5,
        delay: 0.7,
        ease: 'power2.out'
    });
    
    // Section headers animation
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            y: 30,
            opacity: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    });
    
    // Contact section special animation (faster appearance)
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
        ScrollTrigger.create({
            trigger: contactSection,
            start: 'top 90%',
            onEnter: () => {
                gsap.to('.contact .reveal-text, .contact .reveal-item', {
                    opacity: 1,
                    y: 0,
                    duration: 0.2,
                    stagger: 0.05,
                    ease: 'power1.out'
                });
            }
        });
    }
    
    // Gallery Modal
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.querySelector('.gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const closeModal = document.querySelector('.close-modal');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentImgIndex = 0;
    
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImgIndex = index;
            const imgSrc = item.querySelector('img').src;
            modalImg.src = imgSrc;
            modal.style.display = 'block';
            
            // Disable scrolling when modal is open
            document.body.style.overflow = 'hidden';
            
            // Animation
            gsap.from(modalImg, {
                scale: 0.9,
                opacity: 0,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
    
    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImgIndex--;
        if (currentImgIndex < 0) {
            currentImgIndex = galleryItems.length - 1;
        }
        modalImg.src = galleryItems[currentImgIndex].querySelector('img').src;
        
        // Animation
        gsap.from(modalImg, {
            x: -30,
            opacity: 0,
            duration: 0.2,
            ease: 'power2.out'
        });
    });
    
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        currentImgIndex++;
        if (currentImgIndex >= galleryItems.length) {
            currentImgIndex = 0;
        }
        modalImg.src = galleryItems[currentImgIndex].querySelector('img').src;
        
        // Animation
        gsap.from(modalImg, {
            x: 30,
            opacity: 0,
            duration: 0.2,
            ease: 'power2.out'
        });
    });
    
    // Key navigation for gallery
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            } else if (e.key === 'Escape') {
                closeModal.click();
            }
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        });
    });
    
    // Active navigation based on scroll position
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= (sectionTop - 200)) {
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
    
    // Form submission
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulating form submission
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Success message (in a real application, you would handle the form data here)
                submitBtn.textContent = 'Message Sent!';
                submitBtn.style.backgroundColor = '#4CAF50';
                
                // Reset form
                contactForm.reset();
                
                // Reset button after a delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 1500);
            }, 800);
        });
    }
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const input = this.querySelector('input');
            const button = this.querySelector('button');
            const originalIcon = button.innerHTML;
            
            // Validate email
            const email = input.value;
            if (!email || !email.includes('@')) {
                input.style.borderColor = 'red';
                return;
            }
            
            // Reset validation
            input.style.borderColor = '';
            
            // Simulate subscription
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;
            
            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-check"></i>';
                button.style.backgroundColor = '#4CAF50';
                
                // Reset form
                input.value = '';
                
                // Reset button after a delay
                setTimeout(() => {
                    button.innerHTML = originalIcon;
                    button.style.backgroundColor = '';
                    button.disabled = false;
                }, 1500);
            }, 800);
        });
    }
    
    // Additional animations for surroundings section
    gsap.from('.surroundings-card', {
        scrollTrigger: {
            trigger: '.surroundings-gallery',
            start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out'
    });
    
    // Animation for offer cards
    gsap.from('.offer-card', {
        scrollTrigger: {
            trigger: '.offers',
            start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power3.out'
    });
});
