// This is where I'll store all my travel notes
// I'm going to use localStorage directly with unique keys instead of an array

// Global variables
let currentEditingKey = null; // Stores the key of the note being edited
let isModalOpen = false; // Tracks if modal is open

// When the page loads, I want to check if there are any saved notes
document.addEventListener('DOMContentLoaded', function() {
    // First, get the form element so I can listen for when it's submitted
    const noteForm = document.getElementById('addnote').querySelector('form');
    
    // Display any existing notes right away
    displayNotes();
    
    // Create and append the modal HTML to the body
    createModal();
    
    // Add an event listener for when the form is submitted
    noteForm.addEventListener('submit', function(event) {
        // This prevents the form from actually submitting and refreshing the page
        event.preventDefault();
        
        // Get the values from the form
        const title = document.getElementById('_1').value;
        const date = document.getElementById('_date').value;
        const content = document.getElementById('_2').value;
        
        // Check if the disclaimer checkbox is checked
        const disclaimerChecked = document.getElementById('_3_0').checked;
        
        // Only proceed if they checked the disclaimer
        if (disclaimerChecked) {
            // Add the new note directly to localStorage with a unique ID
            addNote(title, date, content);
            
            // Clear the form fields after adding the note
            noteForm.reset();
        } else {
            alert('Please acknowledge the disclaimer to save your note.');
        }
    });

    // Add keyboard event listener to handle Escape key for modal
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && isModalOpen) {
            handleModalClose();
        }
    });
});

// Function to create the edit modal HTML
function createModal() {
    const modal = document.createElement('div');
    modal.id = 'edit-modal';
    modal.className = 'modal';
    modal.style.display = 'none';
    
    const modalContent = `
        <div class="modal-content">
            <div class="modal-header">
                <span class="close-modal">&times;</span>
                <h2>Edit Note</h2>
            </div>
            <div class="modal-body">
                <form id="edit-form">
                    <div>
                        <label for="edit-title">Title</label>
                        <input type="text" id="edit-title" required>
                    </div>
                    <div>
                        <label for="edit-date">Date</label>
                        <input type="date" id="edit-date" required>
                    </div>
                    <div>
                        <label for="edit-content">Content</label>
                        <textarea id="edit-content" required minlength="10" rows="5"></textarea>
                    </div>
                    <div class="modal-buttons">
                        <button type="submit" id="save-edit-btn">Save Changes</button>
                        <button type="button" id="cancel-edit-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Add event listeners for the modal
    const closeBtn = document.querySelector('.close-modal');
    closeBtn.addEventListener('click', handleModalClose);
    
    const cancelBtn = document.getElementById('cancel-edit-btn');
    cancelBtn.addEventListener('click', handleModalClose);
    
    const editForm = document.getElementById('edit-form');
    editForm.addEventListener('submit', function(event) {
        event.preventDefault();
        saveEditedNote();
    });
    
    // Also listen for clicks outside the modal to trigger confirmation
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            handleModalClose();
        }
    });
}

// This function handles closing the modal with confirmation if needed
function handleModalClose() {
    // Check if there are unsaved changes
    if (hasUnsavedChanges()) {
        if (confirm('You have unsaved changes. Are you sure you want to close the editor?')) {
            closeModal();
        }
    } else {
        closeModal();
    }
}

// Helper function to check if there are unsaved changes
function hasUnsavedChanges() {
    if (!currentEditingKey) return false;
    
    // Get the original note from localStorage
    const note = JSON.parse(localStorage.getItem(currentEditingKey));
    
    // Get the current values from the edit form
    const currentTitle = document.getElementById('edit-title').value;
    const currentDate = document.getElementById('edit-date').value;
    const currentContent = document.getElementById('edit-content').value;
    
    // Compare with the original values
    if (decodeFromBase64(note.title) !== currentTitle) return true;
    if (note.date !== currentDate) return true;
    if (decodeFromBase64(note.content) !== currentContent) return true;
    
    return false;
}

// This function opens the edit modal with the selected note
function openEditModal(key) {
    // Set the current editing key
    currentEditingKey = key;
    
    // Get the note from localStorage
    const note = JSON.parse(localStorage.getItem(key));
    
    // Populate the edit form with decoded data
    document.getElementById('edit-title').value = decodeFromBase64(note.title);
    document.getElementById('edit-date').value = note.date;
    document.getElementById('edit-content').value = decodeFromBase64(note.content);
    
    // Show the modal
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'block';
    isModalOpen = true;
    
    // Focus on the title input for immediate editing
    document.getElementById('edit-title').focus();
}

// This function closes the modal
function closeModal() {
    const modal = document.getElementById('edit-modal');
    modal.style.display = 'none';
    currentEditingKey = null;
    isModalOpen = false;
}

// This function saves the edited note
function saveEditedNote() {
    if (!currentEditingKey) return;
    
    // Get the values from the edit form
    const title = document.getElementById('edit-title').value;
    const date = document.getElementById('edit-date').value;
    const content = document.getElementById('edit-content').value;
    
    // Get the existing note to preserve the creation timestamp
    const existingNote = JSON.parse(localStorage.getItem(currentEditingKey));
    
    // Create the updated note object
    const updatedNote = {
        title: encodeToBase64(title),
        date: date,
        content: encodeToBase64(content),
        created: existingNote.created, // Preserve the original creation date
        modified: new Date().toISOString() // Add a modification timestamp
    };
    
    // Save the updated note to localStorage
    localStorage.setItem(currentEditingKey, JSON.stringify(updatedNote));
    
    // Close the modal
    closeModal();
    
    // Update the displayed list of notes
    displayNotes();
    
    // Show a success message
    showToast('Note updated successfully!');
}

// This function shows a toast notification
function showToast(message) {
    // Check if a toast container exists, if not create one
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);
    }
    
    // Create the toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    // Add the toast to the container
    toastContainer.appendChild(toast);
    
    // Remove the toast after 3 seconds
    setTimeout(function() {
        toast.classList.add('fade-out');
        setTimeout(function() {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// This function encodes text using Base64
// I'm using this to encrypt sensitive information in my notes
function encodeToBase64(text) {
    // btoa() is a built-in function that converts text to Base64
    return btoa(text);
}

// This function decodes Base64 encoded text back to normal text
function decodeFromBase64(encodedText) {
    // atob() is a built-in function that converts Base64 back to text
    return atob(encodedText);
}

// Function to add a new note to localStorage with a unique ID
function addNote(title, date, content) {
    // Create a new note object
    const newNote = {
        // Encrypt the title and content using Base64
        title: encodeToBase64(title),
        date: date, // No need to encrypt the date
        content: encodeToBase64(content),
        created: new Date().toISOString() // Add a timestamp of when the note was created
    };
    
    // Generate a unique ID for the note
    const noteId = 'note-' + new Date().getTime();
    
    // Save the new note to localStorage
    localStorage.setItem(noteId, JSON.stringify(newNote));
    
    // Update the displayed list of notes
    displayNotes();
    
    // Show a success message
    showToast('New note added successfully!');
}

// Function to display the notes in the HTML
function displayNotes() {
    // Get the element where we'll display the notes
    const notesList = document.querySelector("#content div > main");
    
    // Clear the current content
    notesList.innerHTML = '';
    
    // Get all keys from localStorage
    const keys = Object.keys(localStorage);
    
    // Filter keys to only include notes
    const noteKeys = keys.filter(key => key.startsWith('note-'));
    
    // Sort notes by date (newest first)
    noteKeys.sort((a, b) => {
        const noteA = JSON.parse(localStorage.getItem(a));
        const noteB = JSON.parse(localStorage.getItem(b));
        return new Date(noteB.date) - new Date(noteA.date);
    });
    
    // If there are no notes, show a message
    if (noteKeys.length === 0) {
        notesList.innerHTML = '<p class="no-notes-message">No travel notes saved yet. Add your first adventure!</p>';
        return;
    }
    
    // Create a header for the notes section
    const header = document.createElement('h2');
    header.textContent = 'My Travel Notes';
    notesList.appendChild(header);
    
    // Add each note to the page
    noteKeys.forEach((key) => {
        // Get the note from localStorage
        const note = JSON.parse(localStorage.getItem(key));
        
        // Decode the title and content from Base64
        const decodedTitle = decodeFromBase64(note.title);
        const decodedContent = decodeFromBase64(note.content);
        
        // Create a section for each note
        const noteElement = document.createElement('article');
        noteElement.className = 'note-card';
        
        // Format the date nicely
        const formattedDate = new Date(note.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        // Prepare the modified label if note has been modified
        let modifiedLabel = '';
        if (note.modified) {
            const modifiedDate = new Date(note.modified).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            modifiedLabel = `<div class="note-modified">Modified: ${modifiedDate}</div>`;
        }
        
        // Add the note content with HTML
        noteElement.innerHTML = `
            <h3>${decodedTitle}</h3>
            <div class="note-date">${formattedDate}</div>
            <div class="note-content">${decodedContent.replace(/\n/g, '<br>')}</div>
            ${modifiedLabel}
            <button class="edit-btn" data-key="${key}">Edit</button>
            <button class="delete-btn" data-key="${key}">Delete</button>
        `;
        
        // Add the note to the page
        notesList.appendChild(noteElement);
        
        // Add event listener to delete button
        const deleteBtn = noteElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', function() {
            deleteNote(key);
        });
        
        // Add event listener to edit button
        const editBtn = noteElement.querySelector('.edit-btn');
        editBtn.addEventListener('click', function() {
            openEditModal(key);
        });
    });
}

// Function to delete a note
function deleteNote(key) {
    // Ask for confirmation before deleting
    if (confirm('Are you sure you want to delete this travel note?')) {
        // Remove the note from localStorage
        localStorage.removeItem(key);
        
        // Update the display
        displayNotes();
        
        // Show a success message
        showToast('Note deleted successfully!');
    }
}