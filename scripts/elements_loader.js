// Get the HTML elements that will contain our header and footer components
const headerContainer = document.getElementById('header');
const footerContainer = document.getElementById('footer');

/**
 * Loads an HTML component file into the specified container
 * 
 * @param {string} containerId - The ID of the HTML element where the component should be inserted
 * @param {string} componentName - The name of the component file (without .html extension)
 * @returns {Promise<boolean>} - Promise resolving to success/failure status
 */
async function loadComponent(containerId, componentName) {
    const containerElement = document.getElementById(containerId);

    try {
        const response = await fetch(`components/${componentName}.html`);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

        containerElement.innerHTML = await response.text();
        console.log(`${componentName} component loaded successfully`);

        // If we just loaded the header, highlight the current page in the navigation menu
        if (containerId === 'header') {
            highlightCurrentPageInMenu();
        }

        return true;
    } catch (error) {
        containerElement.innerHTML = `<div style="color: red">Error loading ${componentName}: ${error.message}</div>`;
        console.error(`Failed to load ${componentName} component:`, error);
        return false;
    }
}

/**
 * Highlights the navigation link that matches the current page
 */
function highlightCurrentPageInMenu() {
    const currentPageFileName = window.location.pathname.split('/').pop() || 'index.html';
    const navigationLinks = document.querySelectorAll('.header-nav a');

    navigationLinks.forEach(link => {
        link.classList.remove('active'); // Remove existing highlights
        if (link.getAttribute('href') === currentPageFileName) {
            link.classList.add('active'); // Highlight the current page link
        }
    });
}

// Load the header and footer, then initialize the title
loadComponent('header', 'header').then(() => {
    console.log("Header loaded, initializing title...");
    initializeTitle(); // Call the title initialization function from title_swap.js
});
loadComponent('footer', 'footer');

/**
 * Sets up all the dynamic elements in the footer (time, date, and location)
 */
async function setupFooterElements() {
  // Wait for the footer elements to be available in the DOM
  const footerElementsLoaded = new Promise(resolve => {
    // Check periodically if our footer elements exist
    const checkInterval = setInterval(() => {
      if (document.getElementById('current-date') && 
          document.getElementById('current-time') &&
          document.getElementById('user-location')) {
        clearInterval(checkInterval);
        resolve();
      }
    }, 100);
    
    // Stop checking after 3 seconds to prevent infinite loop
    setTimeout(() => {
      clearInterval(checkInterval);
      resolve();
    }, 3000);
  });
  
  // Wait until footer is ready
  await footerElementsLoaded;
  
  // Start the date/time display
  startClockAndCalendar();
  
  // Show user's geographic location
  showUserLocation();
}

/**
 * Updates the date and time in the footer dynamically
 */
function startClockAndCalendar() {
  const dateElement = document.getElementById('current-date');
  const timeElement = document.getElementById('current-time');
  
  if (!dateElement || !timeElement) return;
  
  const updateDateTime = function() {
    const now = new Date();
    
    const weekday = now.toLocaleDateString(undefined, { weekday: 'long' });
    const month = now.toLocaleDateString(undefined, { month: 'long' });
    const day = now.getDate();
    const year = now.getFullYear();
    
    const formattedDate = `${toTitleCase(weekday)}, ${day} de ${toTitleCase(month)} de ${year}`;
    dateElement.textContent = formattedDate;
    
    timeElement.textContent = now.toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };
  
  updateDateTime();
  setInterval(updateDateTime, 1000);
}

/**
 * Converts text to title case, removing "-feira" from weekdays
 * 
 * @param {string} text - The text to be converted
 * @returns {string} - The converted text
 */
function toTitleCase(text) {
  const lowercaseWords = ['de', 'do', 'da', 'dos', 'das'];
  
  let modifiedText = text.replace(/-feira/gi, '');
  
  return modifiedText.replace(/\b\w+/g, function(word) {
    if (lowercaseWords.includes(word.toLowerCase())) {
      return word.toLowerCase();
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
}

/**
 * Displays the user's geographic location in the footer
 */
async function showUserLocation() {
  const locationElement = document.getElementById('user-location');
  if (!locationElement) return;
  
  locationElement.textContent = 'Getting location...';
  
  try {
    const position = await getPositionAsync();
    
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    
    locationElement.textContent = `${latitude}°, ${longitude}°`;
  } catch (error) {
    locationElement.textContent = 'Location Unavailable';
  }
}

/**
 * Wraps the geolocation API in a promise
 * 
 * @returns {Promise<GeolocationPosition>} - Promise resolving to the user's position
 */
function getPositionAsync() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// Add this to elements_loader.js or as a separate script
document.addEventListener('DOMContentLoaded', function() {
    // Get current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Find all navigation links
    const navLinks = document.querySelectorAll('.header-nav a');
    
    // Add 'active' class to the link matching the current page
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});