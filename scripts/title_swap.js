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