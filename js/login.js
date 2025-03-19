// Wait for DOM content to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Login page loaded');
    
    // Get form elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const registerLink = document.getElementById('register-link');
    const backToLoginBtn = document.getElementById('back-to-login');
    const errorMessage = document.getElementById('error-message');
    const registerErrorMessage = document.getElementById('register-error-message');

    // Toggle between login and register forms
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.login-form').style.display = 'none';
        document.querySelector('.login-footer').style.display = 'none';
        document.getElementById('register-form').style.display = 'block';
    });

    backToLoginBtn.addEventListener('click', () => {
        document.querySelector('.login-form').style.display = 'block';
        document.querySelector('.login-footer').style.display = 'block';
        document.getElementById('register-form').style.display = 'none';
    });

    // Handle login form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            // Sign in with Firebase Auth
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Clear any error messages
            errorMessage.textContent = '';
            errorMessage.style.display = 'none';
            
            // Store user info in localStorage for persistence
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || email.split('@')[0]
            }));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } catch (error) {
            // Handle login errors
            console.error('Login error:', error);
            errorMessage.textContent = getErrorMessage(error.code);
            errorMessage.style.display = 'block';
        }
    });

    // Handle register form submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        
        // Validate passwords match
        if (password !== confirmPassword) {
            registerErrorMessage.textContent = 'Passwords do not match';
            registerErrorMessage.style.display = 'block';
            return;
        }
        
        try {
            // Create user with Firebase Auth
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Update user profile with name
            await user.updateProfile({
                displayName: name
            });
            
            // Create user document in Firestore
            await db.collection('users').doc(user.uid).set({
                name: name,
                email: email,
                role: 'technician', // Default role
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Clear any error messages
            registerErrorMessage.textContent = '';
            registerErrorMessage.style.display = 'none';
            
            // Store user info in localStorage
            localStorage.setItem('user', JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName: name
            }));
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
        } catch (error) {
            // Handle registration errors
            console.error('Registration error:', error);
            registerErrorMessage.textContent = getErrorMessage(error.code);
            registerErrorMessage.style.display = 'block';
        }
    });

    // Check if user is already logged in
    auth.onAuthStateChanged(user => {
        console.log('Auth state changed:', user ? user.email : 'No user');
        if (user) {
            // User is signed in, redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    });

    // Helper function to get user-friendly error messages
    function getErrorMessage(errorCode) {
        console.log('Getting error message for code:', errorCode);
        switch (errorCode) {
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                return 'Invalid email or password. Please try again.';
            case 'auth/email-already-in-use':
                return 'Email is already in use. Please use a different email or login.';
            case 'auth/weak-password':
                return 'Password is too weak. Please use a stronger password.';
            case 'auth/invalid-email':
                return 'Invalid email format. Please enter a valid email.';
            case 'auth/operation-not-allowed':
                return 'Email/password accounts are not enabled. Please contact support.';
            case 'auth/network-request-failed':
                return 'Network error. Please check your internet connection.';
            case 'auth/internal-error':
                return 'An internal error occurred. Please try again or use a different browser.';
            case 'auth/too-many-requests':
                return 'Too many unsuccessful login attempts. Please try again later.';
            default:
                return 'An error occurred. Please try again later.';
        }
    }

    // For demo purposes, pre-fill the demo account
    const demoLoginBtn = document.querySelector('.login-help');
    if (demoLoginBtn) {
        demoLoginBtn.addEventListener('click', () => {
            document.getElementById('email').value = 'admin@tools4it.com';
            document.getElementById('password').value = 'password123';
        });
    }
}); 