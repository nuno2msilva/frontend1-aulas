async function initializeUsername() {
    const footer = document.getElementById("footer");
    while (!footer || !footer.querySelector("#username")) {
        await new Promise(resolve => setTimeout(resolve, 50));
    }
    getUsername();
}

async function getUsername() {
    try {
        const savedUsername = localStorage.getItem("username");
        updateUsername(savedUsername || "Anon");
    } catch (error) {
        console.error("Error fetching username:", error);
    }
}

function updateUsername(username) {
    const usernameElement = document.getElementById("username");
    if (usernameElement) {
        usernameElement.textContent = username;
    } else {
        console.error("Element with ID 'username' not found.");
    }
}

    document.addEventListener("DOMContentLoaded", () => {
    const changeNameForm = document.getElementById("changeName");
    if (changeNameForm) {
        changeNameForm.addEventListener("submit", function(event) {
            event.preventDefault();
            const newUsername = document.getElementById("titleInput").value.trim();
            if (newUsername) {
                localStorage.setItem("username", newUsername);
                updateUsername(newUsername);
                document.getElementById("titleInput").value = "";
            }
        });
    }
});

initializeUsername();