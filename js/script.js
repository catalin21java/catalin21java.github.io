// Mobile Menu Toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a nav link
const navItems = document.querySelectorAll('.nav-links li a');
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            mobileMenu.classList.remove('active');
        }
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for navbar height
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link based on scroll position
window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Form submission
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const subject = this.querySelector('input[placeholder="Subject"]').value;
        const message = this.querySelector('textarea').value;
        
        // Simple validation
        if (name && email && subject && message) {
            // In a real application, you would send this data to a server
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });
}

// Newsletter subscription
const newsletterForm = document.querySelector('.footer-newsletter form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('input[type="email"]').value;
        
        if (email) {
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        } else {
            alert('Please enter your email address.');
        }
    });
}

// Animation on scroll (simple implementation)
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .about-image, .contact-form');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.3;
        
        if (elementPosition < screenPosition) {
            element.classList.add('animate');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Add animation classes to CSS elements
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .about-image, .contact-form');
    
    elements.forEach(element => {
        element.classList.add('fade-in');
    });
});

// Contact form submission (task request)
const taskRequestForm = document.getElementById('task-request-form');
const formSuccess = document.getElementById('form-success');

if (taskRequestForm) {
    taskRequestForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const phone = document.getElementById('contact-phone').value;
        const company = document.getElementById('contact-school').value;
        const urgency = document.getElementById('contact-urgency').value;
        const issue = document.getElementById('contact-issue').value;
        
        // Create task data object with the correct structure to match dashboard expectations
        const taskData = {
            title: `IT Support - ${company}`,
            company: company,
            description: issue,
            urgency: urgency,
            requesterName: name,
            requesterEmail: email,
            requesterPhone: phone,
            // Important fields needed for dashboard integration
            status: 'pending',
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            // Set to unassigned initially - admin will assign later
            assignedTo: '',
            // Use a special ID for tasks created from the contact form
            source: 'contact_form'
        };
        
        console.log("Submitting task request:", taskData);
        
        // Save to Firebase
        firebase.firestore().collection('tasks').add(taskData)
            .then((docRef) => {
                console.log('Task request submitted successfully with ID:', docRef.id);
                
                // Show success message
                taskRequestForm.style.display = 'none';
                formSuccess.classList.add('active');
                
                // Reset form after 5 seconds
                setTimeout(() => {
                    taskRequestForm.reset();
                    taskRequestForm.style.display = 'block';
                    formSuccess.classList.remove('active');
                }, 5000);
            })
            .catch((error) => {
                console.error('Error submitting task request:', error);
                alert('A apărut o eroare la trimiterea solicitării. Vă rugăm să încercați din nou mai târziu.');
            });
    });
}