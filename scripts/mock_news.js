// Store link for the API in a constant variable
const apiURL = "https://67f5684b913986b16fa476f9.mockapi.io/api/onion/";

/**
 * Function to fetch news data from the API with a timeout
 * @returns {Promise<Array>} Array of news objects
 */
async function getNews() {
  // Use fetch with AbortController for timeout handling
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  
  try {
    // Fetch news data with timeout signal
    const response = await fetch(`${apiURL}news`, { signal: controller.signal });
    const data = await response.json();
    return data;
  } catch (error) {
    // Handle timeout errors with a friendly message
    if (error.name === 'AbortError') {
      throw new Error('Request timed out after 10 seconds');
    }
    throw error;
  } finally {
    // Always clear the timeout to prevent memory leaks
    clearTimeout(timeout);
  }
}

/**
 * Initialize the page when the DOM is loaded
 */
document.addEventListener("DOMContentLoaded", async () => {
  const postList = document.getElementById("content");
  
  if (!postList) {
    console.error("Could not find element with ID 'content'");
    return;
  }

  try {
    // Get news data and display the first 5 items
    const posts = await getNews();
    const limitedPosts = posts.slice(0, 5);

    // Build all posts HTML
    let allPostsHTML = '';
    limitedPosts.forEach(post => {
      allPostsHTML += `
        <div class="post-item">
          <h3 class="post-title">${post.title}</h3>
          <p class="post-content">${post.description}</p>
          <div class="post-date">
            ${new Date(post.date).toLocaleDateString("pt-PT", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
        </div>
      `;
    });
    // Wrap all posts in a rectangle
    postList.innerHTML = `<div id="news-rectangle">${allPostsHTML}</div>`;
  } catch (error) {
    console.error("Error loading news:", error);
    postList.innerHTML = `
      <div class="error-message">
        <p>Failed to load news: ${error.message}</p>
      </div>
    `;
  }
});