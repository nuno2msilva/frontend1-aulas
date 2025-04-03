async function getNews() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        
        if (data.news && data.news.length > 0) {
            const sortedNews = [...data.news].sort((a, b) => {
                return parseInt(a.id) + parseInt(b.id);
            });
            
            displayAllNews(sortedNews);
        }
    } catch(error) {
        console.error('Error loading news:', error);
    }
}

function displayAllNews(newsItems) {
    const mainContent = document.querySelector('.main-content');
    
    let allNewsHTML = '';
    
    for (const news of newsItems) {
        let tagsHTML = '';
        if (news.tags && Array.isArray(news.tags) && news.tags.length > 0) {
            tagsHTML = news.tags.map(tag => `<span class="${tag.type}">${tag.value}</span>`).join(' ');
        }
        
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
    
    mainContent.innerHTML = allNewsHTML;
}

// Call the function when the page loads
getNews();