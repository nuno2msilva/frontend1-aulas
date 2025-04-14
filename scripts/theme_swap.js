// Configure theme handling
async function pageTheme() {
    // Set dark theme as default
    document.body.className = 'dark';
    // Get the theme toggle button
    const themeBtn = document.querySelector('nav ul li:first-child button');
    // Set initial button text
    themeBtn.textContent = 'SHEIKAH (DARK)';
    
    // Check if a theme was saved in sessionStorage
    const savedTheme = sessionStorage.getItem('theme');
    if (savedTheme) {
        // Apply saved theme
        document.body.className = savedTheme;
        // Update button text based on current theme
        themeBtn.textContent = savedTheme === 'dark' ? 'SHEIKAH (DARK)' : 'ZONAI (LIGHT)';
    }
    
    // Add click event to toggle theme
    themeBtn.addEventListener('click', function() {
        if (document.body.className === 'dark') {
            // Switch to light theme
            document.body.className = 'light';
            // Update button text
            themeBtn.textContent = 'ZONAI (LIGHT)';
            // Save preference to sessionStorage
            sessionStorage.setItem('theme', 'light');
        } else {
            // Switch to dark theme
            document.body.className = 'dark';
            // Update button text
            themeBtn.textContent = 'SHEIKAH (DARK)';
            // Save preference to sessionStorage
            sessionStorage.setItem('theme', 'dark');
        }
    });
}

// Initialize theme settings
pageTheme();