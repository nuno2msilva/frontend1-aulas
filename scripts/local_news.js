// Fetch news data from JSON file
async function getNews() {
    try {
        // Make HTTP request to get data.json
        const response = await fetch('./data/data.json');
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
    const mainContent = document.getElementById("content");
    
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
                <div class="news-tags">
                    ${tagsHTML}
                </div>
            </article>
        `;
    }
    
    // Wrap all news in the rectangle div
    mainContent.innerHTML = `<div id="news-rectangle">${allNewsHTML}</div>`;
}

// Initialize news in the page
getNews();

