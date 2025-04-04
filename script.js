// Fetch news data from JSON file
async function getNews() {
    try {
        // Make HTTP request to get data.json
        const response = await fetch('data.json');
        // Parse JSON response to JavaScript object
        const data = await response.json();
        
        // Check if news data exists and is not empty
        if (data.news && data.news.length > 0) {
            // Create a copy of news array and sort by ID
            const sortedNews = [...data.news].sort((a, b) => {
                return parseInt(a.id) - parseInt(b.id);
            });
            
            // Pass sorted news to display function
            displayAllNews(sortedNews);
        }
    } catch(error) {
        // Log any errors that occur during fetch
        console.error('Error loading news:', error);
    }
}

// Render news items to the page
function displayAllNews(newsItems) {
    // Find the container for news content
    const mainContent = document.querySelector('.main-content');
    
    // Initialize empty string to build HTML
    let allNewsHTML = '';
    
    // Loop through each news item
    for (const news of newsItems) {
        // Initialize empty string for tags
        let tagsHTML = '';
        // Check if tags exist and are in array format
        if (news.tags && Array.isArray(news.tags) && news.tags.length > 0) {
            // Convert each tag object to HTML span and join them
            tagsHTML = news.tags.map(tag => `<span class="${tag.type}">${tag.value}</span>`).join(' ');
        }
        
        // Build HTML for each news article
        allNewsHTML += `
            <article class="news-item">
                <div class="news-date">${news.date}</div>
                <h2 class="news-title">${news.title}</h2>
                <p class="news-description">${news.content}</p>
                <div class="news-tags">
                    ${tagsHTML}
                </div>
            </article>
        `;
    }
    
    // Insert generated HTML into the page
    mainContent.innerHTML = allNewsHTML;
}

// Initialize news in the page
getNews();

// Load or fetch page title
async function getPageTitle() {
    try {
        const savedTitle = localStorage.getItem("pageTitle");
        if (savedTitle) {
            updatePageTitle(savedTitle);
            console.log(savedTitle);
            return null;
        }
        // If no saved title, use default
        updatePageTitle("Lucky Clover Gazette");
    } catch (error) {}
}

// Update the page title in the DOM
function updatePageTitle(title) {
    const pageTitle = document.getElementById("page-title");
    pageTitle.textContent = title;
}

// Handle form submission for title change
document.getElementById("changeName").addEventListener("submit", function(event) {
    event.preventDefault();
    const newTitle = document.getElementById("titleInput").value.trim();
    if (newTitle) {
        localStorage.setItem("pageTitle", newTitle);
        updatePageTitle(newTitle);
        document.getElementById("titleInput").value = "";
    }
});

// Initialize page title
getPageTitle();

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