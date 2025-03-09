// Dashboard JavaScript

// DOM Elements
const currentUserElement = document.getElementById('current-user');
const navLinks = document.querySelectorAll('.nav-links a');
const dashboardTabs = document.querySelectorAll('.dashboard-tab');
const myTasksCountElement = document.getElementById('my-tasks-count');
const completedTasksCountElement = document.getElementById('completed-tasks-count');
const availabilityStatusElement = document.getElementById('availability-status');
const recentTasksList = document.getElementById('recent-tasks-list');
const logoutBtn = document.getElementById('logout-btn');

// Task Management Elements
const createTaskBtn = document.getElementById('create-task-btn');
const newTaskBtn = document.getElementById('new-task-btn');
const taskFormContainer = document.getElementById('task-form-container');
const taskForm = document.getElementById('task-form');
const cancelTaskBtn = document.getElementById('cancel-task-btn');
const tasksContainer = document.getElementById('tasks-container');
const filterStatus = document.getElementById('filter-status');
const filterAssignee = document.getElementById('filter-assignee');
const taskAssigneeSelect = document.getElementById('task-assignee');

// Task Completion Modal Elements
const completeTaskModal = document.getElementById('complete-task-modal');
const completeTaskForm = document.getElementById('complete-task-form');
const completeTaskId = document.getElementById('complete-task-id');
const closeModal = document.querySelector('.close-modal');

// Timetable Elements
const timetableDate = document.getElementById('timetable-date');
const timetableGrid = document.getElementById('timetable-grid');
const updateStatusBtn = document.getElementById('update-status-btn');
const viewTimetableBtn = document.getElementById('view-timetable-btn');

// Archive Elements
const archiveContainer = document.getElementById('archive-container');
const archiveEmployee = document.getElementById('archive-employee');
const archiveDateFrom = document.getElementById('archive-date-from');
const archiveDateTo = document.getElementById('archive-date-to');
const applyArchiveFilters = document.getElementById('apply-archive-filters');

// Firebase references
const auth = firebase.auth();
const db = firebase.firestore();

// Current user data
let currentUser = null;
let currentUserData = null;
let teamMembers = [];

// Task data
let tasks = [];
let archivedTasks = [];

// Initialize the dashboard
function initDashboard() {
    console.log("Initializing dashboard...");
    
    // Check DOM elements
    console.log("Checking DOM elements...");
    console.log("tasksContainer:", tasksContainer ? "Found" : "Not found");
    console.log("recentTasksList:", recentTasksList ? "Found" : "Not found");
    console.log("archiveContainer:", archiveContainer ? "Found" : "Not found");
    console.log("currentUserElement:", currentUserElement ? "Found" : "Not found");
    
    // Check if tasks-tab exists
    const tasksTab = document.getElementById('tasks-tab');
    console.log("tasks-tab:", tasksTab ? "Found" : "Not found");
    
    // Create a test task to verify rendering
    function createTestTask() {
        console.log("Creating test task to verify rendering...");
        
        if (!tasksContainer) {
            console.error("Cannot create test task: tasksContainer not found");
            return;
        }
        
        const testTask = {
            id: 'test-task-' + Date.now(),
            title: 'Test Task',
            description: 'This is a test task to verify rendering',
            school: 'Test School',
            date: new Date().toISOString().split('T')[0],
            time: '12:00',
            status: 'pending',
            assignedTo: '',
            createdAt: new Date()
        };
        
        console.log("Test task created:", testTask);
        
        // Create task element
        const taskElement = document.createElement('div');
        taskElement.className = 'task-card test-task';
        taskElement.dataset.id = testTask.id;
        
        taskElement.innerHTML = `
            <div class="task-header">
                <h3>${testTask.title}</h3>
                <span class="task-date">Today at 12:00 PM</span>
            </div>
            <div class="task-location">
                <i class="fas fa-map-marker-alt"></i> ${testTask.school}
            </div>
            <div class="task-description">
                <p>${testTask.description}</p>
            </div>
            <div class="task-footer">
                <div class="task-assignee">
                    <i class="fas fa-user"></i> Unassigned
                </div>
                <div class="task-actions">
                    <button class="btn btn-sm assign-task" data-id="${testTask.id}">
                        <i class="fas fa-user-plus"></i> Assign
                    </button>
                </div>
            </div>
        `;
        
        // Add to container
        tasksContainer.appendChild(taskElement);
        console.log("Test task added to container");
    }
    
    // Check if Firebase is initialized
    if (!firebase || !firebase.apps || !firebase.apps.length) {
        console.error("Firebase is not initialized!");
        alert("Error: Firebase is not initialized. Please refresh the page and try again.");
        return;
    }
    
    console.log("Firebase is initialized:", firebase.apps.length > 0);
    
    // Check if Firestore and Auth are available
    if (!db) {
        console.error("Firestore is not initialized!");
        return;
    }
    
    if (!auth) {
        console.error("Auth is not initialized!");
        return;
    }
    
    console.log("Firestore and Auth are available");
    
    // Set up tab navigation
    setupTabNavigation();
    
    // Check if user is logged in
    auth.onAuthStateChanged(async (user) => {
        if (user) {
            console.log("User is logged in:", user.uid);
            // User is logged in
            currentUser = user;
            
            // Get user data from Firestore
            try {
                const userDoc = await db.collection('users').doc(user.uid).get();
                if (userDoc.exists) {
                    currentUserData = userDoc.data();
                    console.log("User data retrieved from Firestore:", currentUserData);
                    // Display user name
                    if (currentUserElement) {
                        currentUserElement.textContent = currentUserData.name || user.displayName || user.email;
                        console.log("Updated user name in UI:", currentUserElement.textContent);
                    } else {
                        console.error("Current user element not found in DOM");
                    }
                } else {
                    console.warn("User document does not exist in Firestore");
                }
            } catch (error) {
                console.error("Error getting user data:", error);
            }
            
            // Load team members
            await loadTeamMembers();
            
            // Load tasks
            loadTasks();
            
            // Create test task after a delay to verify rendering
            setTimeout(() => {
                if (tasks.length === 0) {
                    console.warn("No tasks loaded from Firestore, creating test task");
                    createTestTask();
                }
            }, 5000);
            
            // Set current date for timetable
            const today = new Date().toISOString().split('T')[0];
            if (timetableDate) {
                timetableDate.value = today;
                console.log("Set timetable date to today:", today);
            } else {
                console.warn("Timetable date element not found");
            }
            
            // Initialize timetable
            renderTimetable();
        } else {
            // User is not logged in, redirect to login page
            console.log("User is not logged in, redirecting to login page");
            window.location.href = 'login.html';
        }
    });
    
    // Logout button
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log("Logout button clicked");
            
            // Clear session storage
            sessionStorage.removeItem('hasVisitedLoginPage');
            localStorage.removeItem('currentUser');
            
            // Sign out from Firebase
            firebase.auth().signOut()
                .then(() => {
                    console.log("User signed out successfully");
                    // Redirect to login page
                    window.location.href = 'login.html';
                })
                .catch((error) => {
                    console.error("Error signing out:", error);
                    alert("Error signing out. Please try again.");
                });
        });
    } else {
        console.warn("Logout button not found");
    }
    
    // Task form events
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', () => {
            taskFormContainer.classList.add('active');
        });
    }
    
    if (newTaskBtn) {
        newTaskBtn.addEventListener('click', () => {
            taskFormContainer.classList.add('active');
        });
    }
    
    if (cancelTaskBtn) {
        cancelTaskBtn.addEventListener('click', () => {
            taskForm.reset();
            taskFormContainer.classList.remove('active');
        });
    }
    
    if (taskForm) {
        taskForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Get form values
            const title = document.getElementById('task-title').value;
            const school = document.getElementById('task-school').value;
            const description = document.getElementById('task-description').value;
            const date = document.getElementById('task-date').value;
            const time = document.getElementById('task-time').value;
            const assignee = document.getElementById('task-assignee').value;
            
            // Create new task
            const newTask = {
                title: title,
                school: school,
                description: description,
                date: date,
                time: time,
                assignedTo: assignee,
                status: 'pending',
                createdBy: currentUser.uid,
                createdByName: currentUserData.name || currentUser.displayName || currentUser.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            };
            
            try {
                // Add task to Firestore
                await db.collection('tasks').add(newTask);
                
                // Reset form and hide
                taskForm.reset();
                taskFormContainer.classList.remove('active');
            } catch (error) {
                console.error("Error adding task:", error);
                alert("Error adding task: " + error.message);
            }
        });
    }
    
    // Task filter events
    if (filterStatus) {
        filterStatus.addEventListener('change', renderTasks);
    }
    
    if (filterAssignee) {
        filterAssignee.addEventListener('change', renderTasks);
    }
    
    // Complete task modal events
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            completeTaskModal.classList.remove('active');
        });
    }
    
    if (completeTaskForm) {
        completeTaskForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const taskId = completeTaskId.value;
            const completionTime = document.getElementById('completion-time').value;
            const solutionDescription = document.getElementById('solution-description').value;
            
            if (!taskId) {
                alert("Task ID is missing");
                return;
            }
            
            try {
                // Update task in Firestore
                await db.collection('tasks').doc(taskId).update({
                    status: 'completed',
                    completedBy: currentUser.uid,
                    completedByName: currentUserData.name || currentUser.displayName || currentUser.email,
                    completedAt: firebase.firestore.Timestamp.fromDate(new Date(completionTime)),
                    solution: solutionDescription
                });
                
                // Hide modal
                completeTaskModal.classList.remove('active');
                completeTaskForm.reset();
            } catch (error) {
                console.error("Error completing task:", error);
                alert("Error completing task: " + error.message);
            }
        });
    }
    
    // Timetable events
    if (timetableDate) {
        timetableDate.addEventListener('change', renderTimetable);
    }
    
    if (updateStatusBtn) {
        updateStatusBtn.addEventListener('click', () => {
            updateAvailabilityStatus();
        });
    }
    
    if (viewTimetableBtn) {
        viewTimetableBtn.addEventListener('click', () => {
            // Switch to timetable tab
            switchToTab('timetables');
        });
    }
    
    // Archive filter events
    if (applyArchiveFilters) {
        applyArchiveFilters.addEventListener('click', renderArchivedTasks);
    }
}

// Set up tab navigation
function setupTabNavigation() {
    console.log("Setting up tab navigation...");
    console.log("Nav links found:", navLinks.length);
    
    if (navLinks && navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                console.log("Nav link clicked:", this.getAttribute('data-tab'));
                
                // Get the tab to show
                const tabToShow = this.getAttribute('data-tab');
                switchToTab(tabToShow);
            });
        });
    } else {
        console.error("Navigation links not found");
    }
}

// Switch to a specific tab
function switchToTab(tabName) {
    console.log("Switching to tab:", tabName);
    
    // Remove active class from all links and tabs
    navLinks.forEach(link => link.classList.remove('active'));
    dashboardTabs.forEach(tab => tab.classList.remove('active'));
    
    // Add active class to clicked link and corresponding tab
    const targetLink = document.querySelector(`.nav-links a[data-tab="${tabName}"]`);
    const targetTab = document.getElementById(`${tabName}-tab`);
    
    if (targetLink) {
        targetLink.classList.add('active');
    } else {
        console.error(`Link for tab ${tabName} not found`);
    }
    
    if (targetTab) {
        targetTab.classList.add('active');
    } else {
        console.error(`Tab ${tabName}-tab not found`);
    }
}

// Load team members from Firestore
async function loadTeamMembers() {
    console.log("Loading team members from Firestore...");
    
    try {
        const snapshot = await db.collection('users').where('role', '==', 'technician').get();
        console.log(`Received ${snapshot.docs.length} team members from Firestore`);
        
        teamMembers = [];
        
        snapshot.forEach(doc => {
            const userData = doc.data();
            console.log(`Processing team member: ${doc.id}`, userData);
            
            teamMembers.push({
                id: doc.id,
                name: userData.name || userData.displayName || userData.email || 'Unknown User',
                email: userData.email || 'No email'
            });
        });
        
        console.log("Team members loaded:", teamMembers);
        
        // Populate team member dropdowns
        populateTeamMemberDropdowns();
    } catch (error) {
        console.error("Error loading team members:", error);
    }
}

// Populate team member dropdowns
function populateTeamMemberDropdowns() {
    // Task assignee dropdown
    if (taskAssigneeSelect) {
        // Clear existing options except the first one
        while (taskAssigneeSelect.options.length > 1) {
            taskAssigneeSelect.remove(1);
        }
        
        // Add team members
        teamMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = member.name;
            taskAssigneeSelect.appendChild(option);
        });
    }
    
    // Filter assignee dropdown
    if (filterAssignee) {
        // Clear existing options except the first one
        while (filterAssignee.options.length > 1) {
            filterAssignee.remove(1);
        }
        
        // Add team members
        teamMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = member.name;
            filterAssignee.appendChild(option);
        });
    }
    
    // Archive employee dropdown
    if (archiveEmployee) {
        // Clear existing options except the first one
        while (archiveEmployee.options.length > 1) {
            archiveEmployee.remove(1);
        }
        
        // Add team members
        teamMembers.forEach(member => {
            const option = document.createElement('option');
            option.value = member.id;
            option.textContent = member.name;
            archiveEmployee.appendChild(option);
        });
    }
}

// Load tasks from Firestore
function loadTasks() {
    console.log("Loading tasks from Firestore...");
    
    // Set up real-time listener for tasks
    db.collection('tasks')
        .orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
            console.log(`Received ${snapshot.docs.length} tasks from Firestore`);
            
            // Debug: Log the raw data from Firestore
            snapshot.docs.forEach(doc => {
                console.log(`Raw task data for ${doc.id}:`, doc.data());
            });
            
            tasks = [];
            archivedTasks = [];
            
            snapshot.forEach(doc => {
                const taskData = doc.data();
                console.log(`Processing task: ${doc.id}`, taskData);
                
                try {
                    // Handle potential missing fields
                    const task = {
                        id: doc.id,
                        ...taskData,
                        // Ensure these fields exist with defaults if missing
                        title: taskData.title || 'Untitled Task',
                        description: taskData.description || 'No description provided',
                        school: taskData.school || 'Unknown Location',
                        status: taskData.status || 'pending',
                        date: taskData.date || new Date().toISOString().split('T')[0],
                        time: taskData.time || '09:00',
                        assignedTo: taskData.assignedTo || '',
                        createdAt: taskData.createdAt ? taskData.createdAt.toDate() : new Date(),
                        completedAt: taskData.completedAt ? taskData.completedAt.toDate() : null
                    };
                    
                    console.log(`Processed task object:`, task);
                    
                    if (task.status === 'completed') {
                        archivedTasks.push(task);
                    } else {
                        tasks.push(task);
                    }
                } catch (error) {
                    console.error(`Error processing task ${doc.id}:`, error);
                }
            });
            
            console.log(`Processed ${tasks.length} active tasks and ${archivedTasks.length} archived tasks`);
            console.log("Active tasks:", tasks);
            console.log("Archived tasks:", archivedTasks);
            
            // Update UI
            renderTasks();
            renderRecentTasks();
            renderArchivedTasks();
            updateDashboardCounts();
        }, error => {
            console.error("Error loading tasks:", error);
        });
}

// Update dashboard counts
function updateDashboardCounts() {
    if (myTasksCountElement) {
        // Count tasks assigned to current user
        const myTasksCount = tasks.filter(task => task.assignedTo === currentUser.uid).length;
        myTasksCountElement.textContent = myTasksCount;
    }
    
    if (completedTasksCountElement) {
        // Count tasks completed by current user
        const completedTasksCount = archivedTasks.filter(task => task.completedBy === currentUser.uid).length;
        completedTasksCountElement.textContent = completedTasksCount;
    }
    
    // Update the availability status if it's not set yet
    if (availabilityStatusElement && availabilityStatusElement.textContent === 'Available') {
        // Check if user has a status in Firestore
        if (currentUser && currentUserData && currentUserData.status) {
            availabilityStatusElement.textContent = currentUserData.status;
            availabilityStatusElement.className = 'card-value';
            availabilityStatusElement.classList.add(currentUserData.status.toLowerCase());
        }
    }
    
    // Add a count for unassigned tasks if user is admin
    const isAdmin = currentUserData && currentUserData.role === 'admin';
    
    // Find or create the unassigned tasks card
    let unassignedTasksCard = document.querySelector('.dashboard-card.unassigned-tasks');
    
    if (isAdmin) {
        // Count unassigned tasks
        const unassignedTasksCount = tasks.filter(task => !task.assignedTo).length;
        
        if (!unassignedTasksCard) {
            // Create a new card for unassigned tasks
            const dashboardOverview = document.querySelector('.dashboard-overview');
            if (dashboardOverview) {
                unassignedTasksCard = document.createElement('div');
                unassignedTasksCard.className = 'dashboard-card unassigned-tasks';
                unassignedTasksCard.innerHTML = `
                    <div class="card-icon">
                        <i class="fas fa-inbox"></i>
                    </div>
                    <div class="card-content">
                        <h3>Unassigned Tasks</h3>
                        <p class="card-value" id="unassigned-tasks-count">${unassignedTasksCount}</p>
                        <p>Tasks waiting to be assigned</p>
                    </div>
                `;
                dashboardOverview.appendChild(unassignedTasksCard);
            }
        } else {
            // Update the existing card
            const countElement = unassignedTasksCard.querySelector('#unassigned-tasks-count');
            if (countElement) {
                countElement.textContent = unassignedTasksCount;
            }
        }
    } else if (unassignedTasksCard) {
        // Remove the card if user is not admin
        unassignedTasksCard.remove();
    }
}

// Update availability status
async function updateAvailabilityStatus() {
    if (!currentUser) return;
    
    const statuses = ['Available', 'Busy', 'Away'];
    const currentStatus = availabilityStatusElement.textContent;
    
    // Get next status in rotation
    let nextStatusIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    const nextStatus = statuses[nextStatusIndex];
    
    try {
        // Update user status in Firestore
        await db.collection('users').doc(currentUser.uid).update({
            status: nextStatus,
            lastStatusUpdate: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        // Update UI
        availabilityStatusElement.textContent = nextStatus;
        
        // Update status class
        availabilityStatusElement.className = 'card-value';
        availabilityStatusElement.classList.add(nextStatus.toLowerCase());
    } catch (error) {
        console.error("Error updating status:", error);
    }
}

// Render tasks
function renderTasks() {
    console.log("Rendering tasks...");
    
    if (!tasksContainer) {
        console.error("Tasks container not found!");
        return;
    }
    
    // Get filter values
    const statusFilter = filterStatus ? filterStatus.value : 'all';
    const assigneeFilter = filterAssignee ? filterAssignee.value : 'all';
    
    console.log(`Filtering tasks - Status: ${statusFilter}, Assignee: ${assigneeFilter}`);
    console.log(`Total tasks before filtering: ${tasks.length}`);
    
    // Filter tasks
    let filteredTasks = [...tasks];
    
    if (statusFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
    }
    
    if (assigneeFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.assignedTo === assigneeFilter);
    }
    
    console.log(`Filtered tasks: ${filteredTasks.length}`);
    console.log("Filtered task list:", filteredTasks);
    
    // Clear container
    tasksContainer.innerHTML = '';
    
    // Show message if no tasks
    if (filteredTasks.length === 0) {
        console.log("No tasks to display after filtering");
        tasksContainer.innerHTML = '<div class="no-tasks-message">No tasks to display.</div>';
        return;
    }
    
    // Render tasks
    filteredTasks.forEach((task, index) => {
        console.log(`Rendering task ${index + 1}/${filteredTasks.length}: ${task.id}`);
        
        // Find assignee name
        let assigneeName = 'Unassigned';
        if (task.assignedTo) {
            const assignee = teamMembers.find(member => member.id === task.assignedTo);
            assigneeName = assignee ? assignee.name : 'Unassigned';
            console.log(`Task assigned to: ${assigneeName} (ID: ${task.assignedTo})`);
        } else {
            console.log("Task is unassigned");
        }
        
        // Create task element
        const taskElement = document.createElement('div');
        taskElement.className = 'task-card';
        taskElement.dataset.id = task.id;
        
        // Format date and time
        let taskDate;
        try {
            taskDate = new Date(task.date + 'T' + (task.time || '09:00'));
            console.log(`Task date parsed: ${taskDate}`);
        } catch (error) {
            console.error(`Error parsing date for task ${task.id}:`, error);
            taskDate = new Date();
        }
        
        const formattedDate = taskDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        const formattedTime = taskDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        // Check if this is a task from the contact form
        const isContactFormTask = task.source === 'contact_form';
        console.log(`Task from contact form: ${isContactFormTask}`);
        
        const requesterInfo = isContactFormTask ? 
            `<div class="task-requester">
                <i class="fas fa-user-circle"></i> Requested by: ${task.requesterName || 'Unknown'}
                <br><i class="fas fa-envelope"></i> ${task.requesterEmail || 'No email provided'}
            </div>` : '';
        
        taskElement.innerHTML = `
            <div class="task-header">
                <h3>${task.title}</h3>
                <span class="task-date">${formattedDate} at ${formattedTime}</span>
            </div>
            <div class="task-location">
                <i class="fas fa-map-marker-alt"></i> ${task.school}
            </div>
            <div class="task-description">
                <p>${task.description}</p>
            </div>
            ${requesterInfo}
            <div class="task-footer">
                <div class="task-assignee">
                    <i class="fas fa-user"></i> ${assigneeName}
                </div>
                <div class="task-actions">
                    ${task.assignedTo ? 
                        `<button class="btn btn-sm complete-task" data-id="${task.id}">
                            <i class="fas fa-check"></i> Complete
                        </button>` : 
                        `<button class="btn btn-sm assign-task" data-id="${task.id}">
                            <i class="fas fa-user-plus"></i> Assign
                        </button>`
                    }
                </div>
            </div>
        `;
        
        // Add to container
        tasksContainer.appendChild(taskElement);
        console.log(`Task ${task.id} added to container`);
        
        // Add event listener for complete button
        const completeBtn = taskElement.querySelector('.complete-task');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => {
                completeTask(task.id);
            });
        }
        
        // Add event listener for assign button
        const assignBtn = taskElement.querySelector('.assign-task');
        if (assignBtn) {
            assignBtn.addEventListener('click', () => {
                assignTask(task.id);
            });
        }
    });
    
    console.log("Task rendering complete");
}

// Complete task
function completeTask(taskId) {
    // Show completion modal
    completeTaskModal.classList.add('active');
    completeTaskId.value = taskId;
    
    // Set default completion time to now
    const now = new Date();
    const formattedDateTime = now.toISOString().slice(0, 16); // Format: YYYY-MM-DDTHH:MM
    document.getElementById('completion-time').value = formattedDateTime;
}

// Render recent tasks
function renderRecentTasks() {
    if (!recentTasksList) return;
    
    // Get recent tasks (up to 5)
    const recentTasks = [...tasks].sort((a, b) => {
        return new Date(b.createdAt) - new Date(a.createdAt);
    }).slice(0, 5);
    
    // Clear container
    recentTasksList.innerHTML = '';
    
    // Show message if no tasks
    if (recentTasks.length === 0) {
        recentTasksList.innerHTML = '<p class="no-tasks-message">No recent tasks to display.</p>';
        return;
    }
    
    // Render tasks
    recentTasks.forEach(task => {
        // Find assignee name
        let assigneeText = 'Unassigned';
        if (task.assignedTo) {
            const assignee = teamMembers.find(member => member.id === task.assignedTo);
            assigneeText = assignee ? assignee.name : 'Unassigned';
        }
        
        // Check if this is from contact form
        const isContactFormTask = task.source === 'contact_form';
        const sourceIcon = isContactFormTask ? 
            '<i class="fas fa-envelope" title="From contact form"></i> ' : '';
        
        // Create task element
        const taskElement = document.createElement('div');
        taskElement.className = 'recent-task-item';
        
        // Format date
        const taskDate = new Date(task.date);
        const formattedDate = taskDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric' 
        });
        
        taskElement.innerHTML = `
            <div class="recent-task-info">
                <h4>${sourceIcon}${task.title}</h4>
                <p>${task.school} - ${formattedDate}</p>
            </div>
            <div class="recent-task-assignee">
                <span>${assigneeText}</span>
            </div>
        `;
        
        // Add to container
        recentTasksList.appendChild(taskElement);
    });
}

// Render timetable
function renderTimetable() {
    if (!timetableGrid) return;
    
    // Clear timetable
    timetableGrid.innerHTML = '';
    
    // Create timetable rows for each team member
    teamMembers.forEach(member => {
        const row = document.createElement('div');
        row.className = 'timetable-row';
        
        // Add employee name
        const nameCell = document.createElement('div');
        nameCell.className = 'employee-name';
        nameCell.textContent = member.name;
        row.appendChild(nameCell);
        
        // Add time slots
        for (let hour = 8; hour <= 18; hour++) {
            const slot = document.createElement('div');
            slot.className = 'time-slot';
            slot.dataset.hour = hour;
            slot.dataset.employee = member.id;
            
            // Add click event to toggle status
            slot.addEventListener('click', function() {
                // Toggle status: none -> available -> busy -> maybe -> none
                if (!this.classList.contains('available') && !this.classList.contains('busy') && !this.classList.contains('maybe')) {
                    this.className = 'time-slot available';
                } else if (this.classList.contains('available')) {
                    this.className = 'time-slot busy';
                } else if (this.classList.contains('busy')) {
                    this.className = 'time-slot maybe';
                } else {
                    this.className = 'time-slot';
                }
                
                // Save timetable data to Firestore (in a real app)
                // This would save the employee's availability for this time slot
            });
            
            row.appendChild(slot);
        }
        
        // Add row to timetable
        timetableGrid.appendChild(row);
    });
    
    // Load timetable data from Firestore (in a real app)
    // This would load the availability data for each employee
}

// Render archived tasks
function renderArchivedTasks() {
    if (!archiveContainer) return;
    
    // Get filter values
    const employeeFilter = archiveEmployee ? archiveEmployee.value : 'all';
    const dateFromFilter = archiveDateFrom ? new Date(archiveDateFrom.value) : null;
    const dateToFilter = archiveDateTo ? new Date(archiveDateTo.value) : null;
    
    // Filter tasks
    let filteredTasks = [...archivedTasks];
    
    if (employeeFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.completedBy === employeeFilter);
    }
    
    if (dateFromFilter && !isNaN(dateFromFilter)) {
        filteredTasks = filteredTasks.filter(task => new Date(task.completedAt) >= dateFromFilter);
    }
    
    if (dateToFilter && !isNaN(dateToFilter)) {
        // Add one day to include the end date
        const adjustedDateTo = new Date(dateToFilter);
        adjustedDateTo.setDate(adjustedDateTo.getDate() + 1);
        filteredTasks = filteredTasks.filter(task => new Date(task.completedAt) < adjustedDateTo);
    }
    
    // Clear container
    archiveContainer.innerHTML = '';
    
    // Show message if no tasks
    if (filteredTasks.length === 0) {
        archiveContainer.innerHTML = '<div class="no-tasks-message">No archived tasks to display.</div>';
        return;
    }
    
    // Render tasks
    filteredTasks.forEach(task => {
        // Find assignee and completer names
        const assignee = teamMembers.find(member => member.id === task.assignedTo);
        const assigneeName = assignee ? assignee.name : 'Unassigned';
        
        const completer = teamMembers.find(member => member.id === task.completedBy);
        const completerName = completer ? completer.name : task.completedByName || 'Unknown';
        
        // Create task element
        const taskElement = document.createElement('div');
        taskElement.className = 'archive-item';
        
        // Format dates
        const taskDate = new Date(task.date);
        const formattedTaskDate = taskDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
        
        const completedDate = new Date(task.completedAt);
        const formattedCompletedDate = completedDate.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        taskElement.innerHTML = `
            <div class="archive-header">
                <h3>${task.title}</h3>
                <span class="archive-date">Completed: ${formattedCompletedDate}</span>
            </div>
            <div class="archive-details">
                <div class="archive-info">
                    <p><strong>School/Location:</strong> ${task.school}</p>
                    <p><strong>Scheduled:</strong> ${formattedTaskDate}</p>
                    <p><strong>Assigned To:</strong> ${assigneeName}</p>
                    <p><strong>Completed By:</strong> ${completerName}</p>
                </div>
                <div class="archive-description">
                    <p><strong>Issue:</strong> ${task.description}</p>
                    <p><strong>Solution:</strong> ${task.solution || 'No solution provided'}</p>
                </div>
            </div>
        `;
        
        // Add to container
        archiveContainer.appendChild(taskElement);
    });
}

// Assign task to a technician
function assignTask(taskId) {
    // Find the task
    const task = tasks.find(t => t.id === taskId);
    if (!task) {
        console.error(`Task with ID ${taskId} not found`);
        return;
    }
    
    // Create a simple modal for assignment
    const modalHTML = `
        <div class="modal active" id="assign-task-modal">
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <h3>Assign Task</h3>
                <form id="assign-task-form">
                    <input type="hidden" id="assign-task-id" value="${taskId}">
                    <div class="form-group">
                        <label for="assign-to">Assign To:</label>
                        <select id="assign-to" required>
                            <option value="">Select a technician</option>
                            ${teamMembers.map(member => 
                                `<option value="${member.id}">${member.name}</option>`
                            ).join('')}
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Assign Task</button>
                </form>
            </div>
        </div>
    `;
    
    // Add modal to the page
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHTML;
    document.body.appendChild(modalContainer);
    
    // Get modal elements
    const modal = document.getElementById('assign-task-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const form = document.getElementById('assign-task-form');
    
    // Close modal when clicking the X
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });
    
    // Handle form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const assignTo = document.getElementById('assign-to').value;
        if (!assignTo) {
            alert('Please select a technician');
            return;
        }
        
        try {
            // Update task in Firestore
            await db.collection('tasks').doc(taskId).update({
                assignedTo: assignTo,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            
            // Remove modal
            document.body.removeChild(modalContainer);
        } catch (error) {
            console.error('Error assigning task:', error);
            alert('Error assigning task: ' + error.message);
        }
    });
}

// Initialize the dashboard when the page loads
document.addEventListener('DOMContentLoaded', initDashboard); 