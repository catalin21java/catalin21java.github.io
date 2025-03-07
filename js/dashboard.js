// Dashboard JavaScript

// DOM Elements
const currentUserElement = document.getElementById('current-user');
const navLinks = document.querySelectorAll('.nav-links a');
const dashboardTabs = document.querySelectorAll('.dashboard-tab');
const myTasksCountElement = document.getElementById('my-tasks-count');
const completedTasksCountElement = document.getElementById('completed-tasks-count');
const availabilityStatusElement = document.getElementById('availability-status');
const recentTasksList = document.getElementById('recent-tasks-list');

// Task Management Elements
const createTaskBtn = document.getElementById('create-task-btn');
const newTaskBtn = document.getElementById('new-task-btn');
const taskFormContainer = document.getElementById('task-form-container');
const taskForm = document.getElementById('task-form');
const cancelTaskBtn = document.getElementById('cancel-task-btn');
const tasksContainer = document.getElementById('tasks-container');
const filterStatus = document.getElementById('filter-status');
const filterAssignee = document.getElementById('filter-assignee');

// Task Completion Modal Elements
const completeTaskModal = document.getElementById('complete-task-modal');
const completeTaskForm = document.getElementById('complete-task-form');
const completeTaskId = document.getElementById('complete-task-id');
const closeModal = document.querySelector('.close-modal');

// Timetable Elements
const timetableDate = document.getElementById('timetable-date');
const timeSlots = document.querySelectorAll('.time-slot');
const updateStatusBtn = document.getElementById('update-status-btn');
const viewTimetableBtn = document.getElementById('view-timetable-btn');

// Archive Elements
const archiveContainer = document.getElementById('archive-container');
const archiveEmployee = document.getElementById('archive-employee');
const archiveDateFrom = document.getElementById('archive-date-from');
const archiveDateTo = document.getElementById('archive-date-to');
const applyArchiveFilters = document.getElementById('apply-archive-filters');

// Data Storage (in a real application, this would be stored in a database)
let currentUser = 'Admin';
let tasks = [];
let archivedTasks = [];
let timetableData = {};

// Initialize the dashboard
function initDashboard() {
    // Get user from URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    
    if (userParam) {
        currentUser = userParam;
    }
    
    // Set current date for timetable
    const today = new Date().toISOString().split('T')[0];
    if (timetableDate) {
        timetableDate.value = today;
    }
    
    // Set current user
    if (currentUserElement) {
        currentUserElement.textContent = currentUser;
    }
    
    // Add event listeners
    if (navLinks) {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Get the tab to show
                const tabToShow = this.getAttribute('data-tab');
                
                // Remove active class from all links and tabs
                navLinks.forEach(link => link.classList.remove('active'));
                dashboardTabs.forEach(tab => tab.classList.remove('active'));
                
                // Add active class to clicked link and corresponding tab
                this.classList.add('active');
                document.getElementById(`${tabToShow}-tab`).classList.add('active');
            });
        });
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
        taskForm.addEventListener('submit', function(e) {
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
                id: Date.now().toString(), // Generate a unique ID
                title: title,
                school: school,
                description: description,
                date: date,
                time: time,
                assignee: assignee,
                status: 'pending',
                createdBy: currentUser,
                createdAt: new Date().toISOString()
            };
            
            // Add task to array
            tasks.push(newTask);
            
            // Update UI
            renderTasks();
            renderRecentTasks();
            updateDashboardCounts();
            
            // Reset form and hide
            taskForm.reset();
            taskFormContainer.classList.remove('active');
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
        completeTaskForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const taskId = completeTaskId.value;
            const solution = document.getElementById('task-solution').value;
            
            // Find the task
            const taskIndex = tasks.findIndex(task => task.id === taskId);
            
            if (taskIndex !== -1) {
                // Update task
                const task = tasks[taskIndex];
                task.status = 'completed';
                task.completedBy = currentUser;
                task.completedAt = new Date().toISOString();
                task.solution = solution;
                
                // Move to archived tasks
                archivedTasks.push(task);
                tasks.splice(taskIndex, 1);
                
                // Update UI
                renderTasks();
                renderRecentTasks();
                renderArchivedTasks();
                updateDashboardCounts();
                
                // Hide modal
                completeTaskModal.classList.remove('active');
                completeTaskForm.reset();
            }
        });
    }
    
    // Timetable events
    if (timetableDate) {
        timetableDate.addEventListener('change', renderTimetable);
    }
    
    if (updateStatusBtn) {
        updateStatusBtn.addEventListener('click', () => {
            updateTimetableStatus();
        });
    }
    
    if (viewTimetableBtn) {
        viewTimetableBtn.addEventListener('click', () => {
            // Switch to timetable tab
            navLinks.forEach(link => link.classList.remove('active'));
            dashboardTabs.forEach(tab => tab.classList.remove('active'));
            
            const timetableLink = document.querySelector('a[data-tab="timetables"]');
            if (timetableLink) {
                timetableLink.classList.add('active');
                document.getElementById('timetables-tab').classList.add('active');
            }
        });
    }
    
    // Archive filter events
    if (applyArchiveFilters) {
        applyArchiveFilters.addEventListener('click', renderArchivedTasks);
    }
    
    // Initialize time slots
    if (timeSlots) {
        timeSlots.forEach(slot => {
            slot.addEventListener('click', function() {
                // Toggle status: none -> available -> busy -> unavailable -> none
                const currentStatus = this.className.replace('time-slot', '').trim();
                let newStatus = 'available';
                
                if (currentStatus === 'available') {
                    newStatus = 'busy';
                } else if (currentStatus === 'busy') {
                    newStatus = 'unavailable';
                } else if (currentStatus === 'unavailable') {
                    newStatus = '';
                }
                
                // Remove all status classes
                this.className = 'time-slot';
                
                // Add new status class if not 'none'
                if (newStatus) {
                    this.classList.add(newStatus);
                }
                
                // Save to timetable data
                const date = timetableDate.value;
                const hour = this.getAttribute('data-hour');
                const employee = this.getAttribute('data-employee');
                
                if (!timetableData[date]) {
                    timetableData[date] = {};
                }
                
                if (!timetableData[date][employee]) {
                    timetableData[date][employee] = {};
                }
                
                timetableData[date][employee][hour] = newStatus || 'none';
            });
        });
    }
    
    // Load sample data
    loadSampleData();
    
    // Update UI
    updateDashboardCounts();
    renderTasks();
    renderRecentTasks();
    renderArchivedTasks();
    renderTimetable();
}

function updateDashboardCounts() {
    if (myTasksCountElement) {
        const myTasksCount = tasks.filter(task => task.assignee === currentUser).length;
        myTasksCountElement.textContent = myTasksCount;
    }
    
    if (completedTasksCountElement) {
        const completedTasksCount = archivedTasks.filter(task => task.completedBy === currentUser).length;
        completedTasksCountElement.textContent = completedTasksCount;
    }
    
    if (availabilityStatusElement) {
        const today = new Date().toISOString().split('T')[0];
        const currentHour = new Date().getHours();
        
        let status = 'Available';
        
        if (timetableData[today] && timetableData[today][currentUser] && timetableData[today][currentUser][currentHour]) {
            const currentStatus = timetableData[today][currentUser][currentHour];
            
            if (currentStatus === 'busy') {
                status = 'Busy';
            } else if (currentStatus === 'unavailable') {
                status = 'Unavailable';
            }
        }
        
        availabilityStatusElement.textContent = status;
        
        // Update status class
        availabilityStatusElement.className = '';
        availabilityStatusElement.classList.add(status.toLowerCase());
    }
}

function renderTasks() {
    if (!tasksContainer) return;
    
    // Get filter values
    const statusFilter = filterStatus ? filterStatus.value : 'all';
    const assigneeFilter = filterAssignee ? filterAssignee.value : 'all';
    
    // Filter tasks
    let filteredTasks = [...tasks];
    
    if (statusFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
    }
    
    if (assigneeFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.assignee === assigneeFilter);
    }
    
    // Sort tasks by date (newest first)
    filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Clear container
    tasksContainer.innerHTML = '';
    
    // Check if there are tasks to display
    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = '<div class="no-tasks-message">No tasks to display.</div>';
        return;
    }
    
    // Render tasks
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-card';
        
        const formattedDate = new Date(`${task.date}T${task.time}`).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
        
        taskElement.innerHTML = `
            <div class="task-header">
                <h3>${task.title}</h3>
                <span class="task-school">${task.school}</span>
            </div>
            <div class="task-details">
                <p>${task.description}</p>
                <div class="task-meta">
                    <span class="task-date"><i class="fas fa-calendar"></i> ${formattedDate}</span>
                    <span class="task-assignee"><i class="fas fa-user"></i> ${task.assignee || 'Unassigned'}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn btn-primary complete-task-btn" data-id="${task.id}">Complete Task</button>
            </div>
        `;
        
        // Add event listener to complete button
        const completeBtn = taskElement.querySelector('.complete-task-btn');
        completeBtn.addEventListener('click', () => {
            completeTask(task.id);
        });
        
        tasksContainer.appendChild(taskElement);
    });
}

function completeTask(taskId) {
    // Show the complete task modal
    completeTaskModal.classList.add('active');
    completeTaskId.value = taskId;
}

function renderRecentTasks() {
    if (!recentTasksList) return;
    
    // Clear container
    recentTasksList.innerHTML = '';
    
    // Get tasks for current user
    const userTasks = [...tasks, ...archivedTasks].filter(task => 
        task.assignee === currentUser || task.completedBy === currentUser
    );
    
    // Sort by date (newest first)
    userTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Limit to 5 tasks
    const recentTasks = userTasks.slice(0, 5);
    
    // Check if there are tasks to display
    if (recentTasks.length === 0) {
        recentTasksList.innerHTML = '<p class="no-tasks-message">No recent tasks to display.</p>';
        return;
    }
    
    // Render tasks
    recentTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'recent-task-item';
        
        const formattedDate = new Date(`${task.date}T${task.time}`).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
        
        taskElement.innerHTML = `
            <div class="recent-task-info">
                <h4>${task.title}</h4>
                <p>${task.school} - ${formattedDate}</p>
            </div>
            <div class="recent-task-status ${task.status === 'completed' ? 'status-completed' : 'status-pending'}">
                ${task.status === 'completed' ? 'Completed' : 'Pending'}
            </div>
        `;
        
        recentTasksList.appendChild(taskElement);
    });
}

function renderTimetable() {
    if (!timetableDate) return;
    
    const date = timetableDate.value;
    
    // Clear all time slots
    timeSlots.forEach(slot => {
        slot.className = 'time-slot';
    });
    
    // Set time slot statuses
    if (timetableData[date]) {
        timeSlots.forEach(slot => {
            const hour = slot.getAttribute('data-hour');
            const employee = slot.getAttribute('data-employee');
            
            if (timetableData[date][employee] && timetableData[date][employee][hour]) {
                const status = timetableData[date][employee][hour];
                if (status !== 'none') {
                    slot.classList.add(status);
                }
            }
        });
    }
}

function renderArchivedTasks() {
    if (!archiveContainer) return;
    
    // Get filter values
    const employeeFilter = archiveEmployee ? archiveEmployee.value : 'all';
    const dateFromFilter = archiveDateFrom ? archiveDateFrom.value : '';
    const dateToFilter = archiveDateTo ? archiveDateTo.value : '';
    
    // Filter archived tasks
    let filteredTasks = [...archivedTasks];
    
    if (employeeFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.completedBy === employeeFilter);
    }
    
    if (dateFromFilter) {
        const fromDate = new Date(dateFromFilter);
        filteredTasks = filteredTasks.filter(task => new Date(task.completedAt) >= fromDate);
    }
    
    if (dateToFilter) {
        const toDate = new Date(dateToFilter);
        toDate.setHours(23, 59, 59, 999); // End of day
        filteredTasks = filteredTasks.filter(task => new Date(task.completedAt) <= toDate);
    }
    
    // Sort by completion date (newest first)
    filteredTasks.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
    
    // Clear container
    archiveContainer.innerHTML = '';
    
    // Check if there are tasks to display
    if (filteredTasks.length === 0) {
        archiveContainer.innerHTML = '<div class="no-tasks-message">No archived tasks to display.</div>';
        return;
    }
    
    // Render tasks
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'archive-item';
        
        const formattedDate = new Date(`${task.date}T${task.time}`).toLocaleString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
        
        const completedDate = new Date(task.completedAt).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
        
        taskElement.innerHTML = `
            <div class="archive-header">
                <h3>${task.title}</h3>
                <span class="archive-school">${task.school}</span>
            </div>
            <div class="archive-details">
                <p><strong>Description:</strong> ${task.description}</p>
                <p><strong>Scheduled:</strong> ${formattedDate}</p>
                <p><strong>Completed by:</strong> ${task.completedBy}</p>
                <p><strong>Completed on:</strong> ${completedDate}</p>
                <p><strong>Solution:</strong> ${task.solution}</p>
            </div>
        `;
        
        archiveContainer.appendChild(taskElement);
    });
}

function updateTimetableStatus() {
    // Save the current timetable data for the selected date
    const date = timetableDate.value;
    
    // Get the day of week (0-6, where 0 is Sunday)
    const dayOfWeek = new Date(date).getDay();
    
    // For each employee, save their schedule for this day of week
    // This would typically be saved to a database
    
    // For now, just show a success message
    alert('Timetable status updated successfully!');
    
    // In a real application, you would save the schedule for this day of week
    // so that it can be applied to future weeks
}

function initializeTimetableData() {
    timetableData = {};
    
    const today = new Date();
    
    // Create entries for the next 14 days
    for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        
        timetableData[dateString] = {
            'Mihaela': {},
            'Catalin': {},
            'Horia': {},
            'Daniel': {}
        };
    }
}

function loadSampleData() {
    // Sample tasks
    const sampleTasks = [
        {
            id: '1',
            title: 'Fix Projector',
            school: 'Lincoln High School',
            description: 'Projector in Room 101 is not working. Check connections and bulb.',
            date: '2025-03-10',
            time: '09:00',
            assignee: 'Mihaela',
            status: 'pending',
            createdBy: 'Admin',
            createdAt: '2025-03-09T14:30:00Z'
        },
        {
            id: '2',
            title: 'Install Software',
            school: 'Washington Elementary',
            description: 'Install educational software on 20 computers in the lab.',
            date: '2025-03-11',
            time: '13:00',
            assignee: 'Catalin',
            status: 'pending',
            createdBy: 'Admin',
            createdAt: '2025-03-09T15:45:00Z'
        },
        {
            id: '3',
            title: 'Network Troubleshooting',
            school: 'Jefferson Middle School',
            description: 'Internet connection is slow in the library. Check router and connections.',
            date: '2025-03-12',
            time: '10:30',
            assignee: 'Horia',
            status: 'pending',
            createdBy: 'Admin',
            createdAt: '2025-03-09T16:20:00Z'
        },
        {
            id: '4',
            title: 'Printer Setup',
            school: 'Roosevelt High School',
            description: 'Set up new printer in the main office and connect to all computers.',
            date: '2025-03-13',
            time: '14:00',
            assignee: 'Daniel',
            status: 'pending',
            createdBy: 'Admin',
            createdAt: '2025-03-09T17:10:00Z'
        }
    ];
    
    // Sample archived tasks
    const sampleArchivedTasks = [
        {
            id: '5',
            title: 'Replace Keyboard',
            school: 'Lincoln High School',
            description: 'Replace broken keyboard in computer lab, station #5.',
            date: '2025-03-05',
            time: '11:00',
            assignee: 'Mihaela',
            status: 'completed',
            createdBy: 'Admin',
            createdAt: '2025-03-04T09:30:00Z',
            completedBy: 'Mihaela',
            completedAt: '2025-03-05T11:45:00Z',
            solution: 'Replaced keyboard with a new one from inventory. Tested all keys and everything is working properly.'
        },
        {
            id: '6',
            title: 'Update Antivirus',
            school: 'Washington Elementary',
            description: 'Update antivirus software on all teacher computers.',
            date: '2025-03-06',
            time: '13:30',
            assignee: 'Catalin',
            status: 'completed',
            createdBy: 'Admin',
            createdAt: '2025-03-04T10:15:00Z',
            completedBy: 'Catalin',
            completedAt: '2025-03-06T15:20:00Z',
            solution: 'Updated antivirus software on all 15 teacher computers. Also ran a full system scan on each machine.'
        },
        {
            id: '7',
            title: 'Wi-Fi Configuration',
            school: 'Jefferson Middle School',
            description: 'Configure new Wi-Fi access point in the gymnasium.',
            date: '2025-03-07',
            time: '09:30',
            assignee: 'Horia',
            status: 'completed',
            createdBy: 'Admin',
            createdAt: '2025-03-04T11:45:00Z',
            completedBy: 'Horia',
            completedAt: '2025-03-07T10:15:00Z',
            solution: 'Installed and configured new access point. Extended network coverage to the entire gymnasium. Signal strength is excellent.'
        },
        {
            id: '8',
            title: 'Smart Board Installation',
            school: 'Roosevelt High School',
            description: 'Install new smart board in Room 203.',
            date: '2025-03-08',
            time: '14:30',
            assignee: 'Daniel',
            status: 'completed',
            createdBy: 'Admin',
            createdAt: '2025-03-04T13:20:00Z',
            completedBy: 'Daniel',
            completedAt: '2025-03-08T16:00:00Z',
            solution: 'Installed smart board and calibrated touch sensors. Connected to teacher computer and tested all functions. Provided brief training to the teacher.'
        }
    ];
    
    // Add sample data to arrays
    tasks = [...sampleTasks];
    archivedTasks = [...sampleArchivedTasks];
    
    // Initialize timetable data
    initializeTimetableData();
    
    // Add some sample timetable data
    const today = new Date().toISOString().split('T')[0];
    
    if (!timetableData[today]) {
        timetableData[today] = {};
    }
    
    // Mihaela's schedule
    timetableData[today]['Mihaela'] = {
        '9': 'busy',
        '10': 'busy',
        '11': 'available',
        '12': 'unavailable',
        '13': 'available',
        '14': 'available',
        '15': 'busy',
        '16': 'busy'
    };
    
    // Catalin's schedule
    timetableData[today]['Catalin'] = {
        '9': 'available',
        '10': 'available',
        '11': 'busy',
        '12': 'unavailable',
        '13': 'busy',
        '14': 'busy',
        '15': 'available',
        '16': 'available'
    };
    
    // Horia's schedule
    timetableData[today]['Horia'] = {
        '9': 'busy',
        '10': 'busy',
        '11': 'busy',
        '12': 'unavailable',
        '13': 'available',
        '14': 'available',
        '15': 'available',
        '16': 'busy'
    };
    
    // Daniel's schedule
    timetableData[today]['Daniel'] = {
        '9': 'available',
        '10': 'available',
        '11': 'available',
        '12': 'unavailable',
        '13': 'busy',
        '14': 'busy',
        '15': 'busy',
        '16': 'available'
    };
}

// Initialize the dashboard when the DOM is loaded
document.addEventListener('DOMContentLoaded', initDashboard); 