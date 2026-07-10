// --- Elements Selection ---
const loginForm = document.getElementById('login-form');
const loginView = document.getElementById('login-view');
const appView = document.getElementById('app-view');
const fabContainer = document.getElementById('fab-container');

const sidebar = document.getElementById('sidebar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const closeSidebarBtn = document.getElementById('close-sidebar');
const navLinks = document.querySelectorAll('.nav-link');
const pageTitle = document.getElementById('page-title');
const logoutBtn = document.getElementById('logout-btn');

const modules = document.querySelectorAll('.module');
const fabMain = document.getElementById('fab-main');

// --- Create Sidebar Overlay for Mobile ---
function createSidebarOverlay() {
    const existingOverlay = document.querySelector('.sidebar-overlay');
    if (existingOverlay) return;
    
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    document.body.appendChild(overlay);
    
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('show');
    });
}
createSidebarOverlay();

// --- Mock Authentication ---
loginForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent page reload
    
    // Hide Login, Show App
    loginView.classList.remove('active');
    loginView.classList.add('hidden');
    appView.classList.remove('hidden');
    fabContainer.classList.remove('hidden');
    
    // Trigger initial animations (Dashboard is default active)
    animateCounters();
});

logoutBtn.addEventListener('click', () => {
    appView.classList.add('hidden');
    fabContainer.classList.add('hidden');
    loginView.classList.remove('hidden');
    loginView.classList.add('active');
    
    // Reset sidebar if mobile
    sidebar.classList.remove('open');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.remove('show');
});

// --- Sidebar Navigation & Routing ---
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active state on links
        navLinks.forEach(l => l.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // Update Page Title
        const titleText = e.currentTarget.querySelector('span').innerText;
        pageTitle.innerText = titleText;
        
        // Get target module ID
        const targetModuleId = e.currentTarget.getAttribute('data-target');
        
        // Hide all modules, show target
        modules.forEach(mod => {
            mod.classList.remove('active');
            mod.classList.add('hidden');
        });
        const targetModule = document.getElementById(`module-${targetModuleId}`);
        targetModule.classList.remove('hidden');
        targetModule.classList.add('active');
        
        // Close sidebar on mobile after clicking
        if (window.innerWidth <= 767) {
            sidebar.classList.remove('open');
            const overlay = document.querySelector('.sidebar-overlay');
            if (overlay) overlay.classList.remove('show');
        }
        
        // Trigger specific animations if needed
        if (targetModuleId === 'dashboard') {
            animateCounters();
        }
    });
});

// --- Mobile Sidebar Toggle ---
mobileMenuBtn.addEventListener('click', () => {
    sidebar.classList.add('open');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.add('show');
});

closeSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('open');
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) overlay.classList.remove('show');
});

// --- Close sidebar when pressing Escape key ---
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && window.innerWidth <= 767 && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) overlay.classList.remove('show');
    }
});

// --- Number Counter Animation ---
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Lower is slower

    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            // Extract current numeric value, ignore currency symbols
            const count = +counter.innerText.replace(/[^0-9.-]+/g,"");
            
            const inc = target / speed;

            if (count < target) {
                let nextVal = Math.ceil(count + inc);
                // Preserve formatting based on target size or prefix
                let prefix = counter.innerText.includes('$') ? '$' : '';
                counter.innerText = prefix + nextVal.toLocaleString();
                setTimeout(updateCount, 15);
            } else {
                let prefix = counter.getAttribute('data-target') > 1000 && counter.innerText.includes('$') ? '$' : '';
                counter.innerText = prefix + target.toLocaleString();
            }
        };
        
        // Reset counter before animating
        counter.innerText = counter.innerText.includes('$') ? '$0' : '0';
        updateCount();
    });
}

// --- Floating Action Button (FAB) Toggle ---
fabMain.addEventListener('click', () => {
    fabContainer.classList.toggle('open');
});

// Close FAB when clicking outside
document.addEventListener('click', (e) => {
    if (!fabContainer.contains(e.target) && fabContainer.classList.contains('open')) {
        fabContainer.classList.remove('open');
    }
});

// Close FAB when pressing Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && fabContainer.classList.contains('open')) {
        fabContainer.classList.remove('open');
    }
});

// --- Prevent form submissions on mock settings page ---
const settingsForm = document.getElementById('settings-form');
if (settingsForm) {
    settingsForm.querySelector('.btn-primary').addEventListener('click', (e) => {
        e.preventDefault();
        alert('Settings saved (Mock Demo).');
    });
}

// --- Smooth Scrolling for mobile ---
if (navigator.userAgent.match(/mobile|android/i)) {
    document.addEventListener('touchstart', (e) => {
        const scrollElements = document.querySelectorAll('[class*="scroll"], [class*="kanban"], [class*="table-responsive"]');
        scrollElements.forEach(el => {
            if (el.contains(e.target)) {
                el.style.WebkitOverflowScrolling = 'touch';
            }
        });
    }, { passive: true });
}

// --- Prevent layout shifts on scroll ---
const html = document.documentElement;
const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
if (scrollbarWidth > 0) {
    html.style.overflowY = 'scroll';
}