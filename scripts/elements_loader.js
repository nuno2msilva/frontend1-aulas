// Get the HTML elements that will contain our header and footer components
const headerContainer = document.getElementById('header');
const footerContainer = document.getElementById('footer');

/**
 * Loads an HTML component file into the specified container
 * 
 * @param {string} containerId - The ID of the HTML element where component should be inserted
 * @param {string} componentName - The name of the component file (without .html extension)
 * @returns {Promise<boolean>} - Promise resolving to success/failure status
 */
async function loadComponent(containerId, componentName) {
  // Find the container where we'll put the component
  const containerElement = document.getElementById(containerId);
  
  try {
    // Fetch the HTML file from the components folder
    // For example: 'components/header.html' or 'components/footer.html'
    const response = await fetch(`components/${componentName}.html`);
    
    // Check if the fetch was successful
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    
    // Get the HTML content and insert it into the container
    containerElement.innerHTML = await response.text();
    console.log(`${componentName} component loaded successfully`);
    
    // If we just loaded the header, highlight the current page in the navigation menu
    if (containerId === 'header') {
      highlightCurrentPageInMenu();
    }
    
    return true; // Successfully loaded
  } catch (error) {
    // Show error message if something went wrong
    containerElement.innerHTML = `<div style="color: red">Error loading ${componentName}: ${error.message}</div>`;
    console.error(`Failed to load ${componentName} component:`, error);
    return false; // Failed to load
  }
}

/**
 * Finds and highlights the navigation link that matches the current page
 */
async function highlightCurrentPageInMenu() {
  try {
    // Figure out which page we're on
    const currentPageFileName = window.location.pathname.split('/').pop() || 'index.html';
    
    // Small delay to make sure the navigation menu is fully loaded
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Find all navigation links in the header
    const navigationLinks = document.querySelectorAll('.header-nav a');
    
    // First, remove any existing highlights
    navigationLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    // Then find the link that matches our current page and highlight it
    navigationLinks.forEach(link => {
      const linkDestination = link.getAttribute('href');
      
      // Highlight if the link matches current page or if we're on home page
      if ((linkDestination === currentPageFileName) || 
          (linkDestination === 'index.html' && (currentPageFileName === '' || currentPageFileName === '/'))) {
        link.classList.add('active');
        console.log(`Highlighted navigation link: ${linkDestination}`);
      }
    });
  } catch (error) {
    console.error('Something went wrong while highlighting the current page link:', error);
  }
}

// Load the header and footer, then setup date/time/location display
loadComponent('header', 'header');
loadComponent('footer', 'footer').then(() => {
  setupFooterElements();
});

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