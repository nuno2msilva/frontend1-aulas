document.addEventListener('DOMContentLoaded', function () {
    // Initialize Splide carousel
    new Splide('#image-carousel', {
        type: 'loop',       // Enables infinite looping
        perPage: 1,         // Display one image at a time
        perMove: 1,         // Move one image per navigation
        gap: '10px',        // Space between slides
        autoplay: true,     // Automatically play the carousel
        interval: 3000,     // Interval for autoplay (in milliseconds)
        pagination: false,  // Disable pagination dots
        arrows: true,       // Keep navigation arrows enabled
    }).mount();
});