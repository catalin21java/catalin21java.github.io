// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyARw9zNcamDieDxQRa2LPlzH7jZmQbvfro",
  authDomain: "tools4it.firebaseapp.com",
  projectId: "tools4it",
  storageBucket: "tools4it.firebasestorage.app",
  messagingSenderId: "1022315329224",
  appId: "1:1022315329224:web:c46199748123b4ed08d7fd",
  measurementId: "G-FPSK46W7CS"
};

console.log("Initializing Firebase with config:", firebaseConfig);

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

// Initialize Firebase services
const db = firebase.firestore();
const auth = firebase.auth();

console.log("Firebase services initialized: Firestore and Auth");

// Export Firebase services for use in other files
window.db = db;
window.auth = auth;

// Authentication state observer
auth.onAuthStateChanged((user) => {
  if (user) {
    // User is signed in
    console.log("User is signed in:", user.uid);
    console.log("User email:", user.email);
    console.log("User display name:", user.displayName);
    
    // Store user info in localStorage for persistence across pages
    localStorage.setItem('currentUser', JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email.split('@')[0]
    }));
    
    // Get user data from Firestore
    db.collection('users').doc(user.uid).get()
      .then(doc => {
        if (doc.exists) {
          console.log("User data from Firestore:", doc.data());
        } else {
          console.log("No user document found in Firestore");
        }
      })
      .catch(error => {
        console.error("Error getting user document:", error);
      });
  } else {
    // User is signed out
    console.log("User is signed out");
    localStorage.removeItem('currentUser');
    // But don't redirect if already on login page or index page
    const currentPage = window.location.pathname;
    if (currentPage.includes('dashboard.html') && 
        !currentPage.includes('login.html') && 
        !currentPage.endsWith('index.html') && 
        !currentPage.endsWith('/')) {
      console.log("Redirecting to login page from:", currentPage);
      window.location.href = 'login.html';
    }
  }
});

// Authentication functions
const firebaseAuth = {
  // Sign in with email and password
  signIn: (email, password) => {
    console.log("Attempting to sign in with email:", email);
    return auth.signInWithEmailAndPassword(email, password);
  },
  
  // Sign out
  signOut: () => {
    console.log("Signing out user");
    // Clear session storage
    sessionStorage.removeItem('hasVisitedLoginPage');
    localStorage.removeItem('currentUser');
    
    // Sign out from Firebase
    return auth.signOut();
  },
  
  // Get current user
  getCurrentUser: () => {
    const user = auth.currentUser;
    console.log("Current user:", user ? user.uid : "No user signed in");
    return user;
  }
};

// Firestore functions for task management
const taskManager = {
  // Add a new task
  addTask: (taskData) => {
    console.log("Adding new task:", taskData);
    return db.collection('tasks').add({
      ...taskData,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  },
  
  // Get all tasks
  getTasks: (callback) => {
    console.log("Setting up listener for all tasks");
    return db.collection('tasks')
      .orderBy('createdAt', 'desc')
      .onSnapshot(callback);
  },
  
  // Get tasks for a specific user
  getUserTasks: (userId, callback) => {
    console.log("Setting up listener for tasks assigned to user:", userId);
    return db.collection('tasks')
      .where('assignedTo', '==', userId)
      .orderBy('createdAt', 'desc')
      .onSnapshot(callback);
  },
  
  // Update a task
  updateTask: (taskId, taskData) => {
    console.log("Updating task:", taskId, taskData);
    return db.collection('tasks').doc(taskId).update({
      ...taskData,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    });
  },
  
  // Delete a task
  deleteTask: (taskId) => {
    console.log("Deleting task:", taskId);
    return db.collection('tasks').doc(taskId).delete();
  },
  
  // Mark a task as completed
  completeTask: (taskId, solutionData) => {
    console.log("Marking task as completed:", taskId, solutionData);
    return db.collection('tasks').doc(taskId).update({
      status: 'completed',
      completedAt: firebase.firestore.FieldValue.serverTimestamp(),
      solution: solutionData
    });
  }
};

// Export the authentication and task manager functions
window.firebaseAuth = firebaseAuth;
window.taskManager = taskManager;

console.log("Firebase module loaded and ready"); 