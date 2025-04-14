// Get the containers where components will be placed
const headerContainer = document.getElementById('header');
const footerContainer = document.getElementById('footer');

async function loadComponent(id, path) {
  const container = document.getElementById(id);
  try {
    const response = await fetch(`components/${path}.html`);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
    container.innerHTML = await response.text();
    console.log(`${path} loaded successfully`);
    
    // After loading header, set active navigation link
    if (id === 'header') {
      setActiveNavLink();
    }
  } catch (error) {
    // Display error message in container
    container.innerHTML = `<div style="color: red">Error loading ${path}: ${error.message}</div>`;
    console.error(`${path} load failed:`, error);
  }
}

// Function to set active class on current page nav link
async function setActiveNavLink() {
  try {
    // Get the current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Wait a small delay to ensure DOM is fully loaded
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Get all navigation links
    const navLinks = document.querySelectorAll('.header-nav a');
    
    // Remove any existing active classes first
    navLinks.forEach(link => {
      link.classList.remove('active');
    });
    
    // Loop through the links and find the matching one
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      
      // Check if href matches current page or if it's index.html and we're at root
      if ((href === currentPage) || 
          (href === 'index.html' && (currentPage === '' || currentPage === '/'))) {
        link.classList.add('active');
        console.log(`Active link set to: ${href}`);
      }
    });
  } catch (error) {
    console.error('Error setting active navigation link:', error);
  }
}

// Load components
loadComponent('header', 'header');
loadComponent('footer', 'footer');