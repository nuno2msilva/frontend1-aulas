document.addEventListener('DOMContentLoaded', function() {

    // Add at the top of your script
    let lastTime = 0;

    // Create audio element for collision sound
    const collisionSound = new Audio();
    collisionSound.src = "./media/snd_tempbell.wav";  // Path to your sound file
    collisionSound.volume = 0.3;  // Adjust volume (0.0 to 1.0)

    // Get canvas element
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Border properties
    const border = {
        x: 10,          
        y: 10,
        width: 280,
        height: 280,
        thickness: 5
    };
    
    // Heart position and properties
    const heart = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 15,
        speed: 3,      // Reduced default speed
        normalSpeed: 3, // Reduced normal speed
        slowSpeed: 1.5    // Reduced slow speed
    };
    
    // Track which keys are currently pressed
    const keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        Shift: false
    };
    
    // Draw a soul - fixed heart drawing function
    function drawHeart() {
        ctx.fillStyle = 'red';
        const pixelSize = 1; // Smaller pixel size for the larger heart array
        const heartPixels = [
            [0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0],
            [0,1,1,1,1,1,0,0,0,0,1,1,1,1,1,0],
            [1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
            [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
        ];
        
        // Draw heart pixels on canvas - properly centered
        for (let row = 0; row < heartPixels.length; row++) {
            for (let col = 0; col < heartPixels[row].length; col++) {
                if (heartPixels[row][col] === 1) {
                    ctx.fillRect(
                        heart.x + (col - heartPixels[0].length / 2) * pixelSize, 
                        heart.y + (row - heartPixels.length / 2) * pixelSize,
                        pixelSize,
                        pixelSize
                    );
                }
            }
        }
    }
    
    // Draw white border
    function drawBorder() {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = border.thickness;
        ctx.strokeRect(border.x, border.y, border.width, border.height);
    }
    
    // Check if heart touches border - fixed to match actual heart dimensions
    function checkBorderCollision() {
        // Get heart dimensions based on pixel array
        const pixelSize = 1;
        const heartWidth = 16 * pixelSize;  // 16 pixels wide
        const heartHeight = 15 * pixelSize; // 15 pixels tall
        
        // Calculate heart boundaries
        const heartLeft = heart.x - heartWidth / 2;
        const heartRight = heart.x + heartWidth / 2;
        const heartTop = heart.y - heartHeight / 2;
        const heartBottom = heart.y + heartHeight / 2;
        
        // Check for collision with border
        if (heartLeft <= border.x || 
            heartRight >= border.x + border.width || 
            heartTop <= border.y || 
            heartBottom >= border.y + border.height) {
            
            // Play collision sound
            collisionSound.currentTime = 0;  // Reset sound to beginning
            collisionSound.play();
            
            // Reset to center of border
            resetHeartPosition();
        }
    }

    // Reset heart to center of border
    function resetHeartPosition() {
        heart.x = border.x + border.width / 2;
        heart.y = border.y + border.height / 2;
    }

    // Game loop
    function gameLoop(currentTime) {
        // Calculate time elapsed since last frame
        const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
        lastTime = currentTime;
        
        // Clear canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw border
        drawBorder();
        
        // Set speed based on shift key
        const currentSpeed = keys.Shift ? heart.slowSpeed : heart.normalSpeed;
        
        // Update position based on deltaTime (for consistent movement speed)
        if (keys.ArrowUp) heart.y -= currentSpeed * deltaTime * 60;
        if (keys.ArrowDown) heart.y += currentSpeed * deltaTime * 60;
        if (keys.ArrowLeft) heart.x -= currentSpeed * deltaTime * 60;
        if (keys.ArrowRight) heart.x += currentSpeed * deltaTime * 60;
        
        // Check for collisions
        checkBorderCollision();
        
        // Draw heart
        drawHeart();
        
        // Continue game loop
        requestAnimationFrame(gameLoop);
    }
    
    // Track keydown events
    document.addEventListener('keydown', function(event) {
        if (keys.hasOwnProperty(event.key)) {
            keys[event.key] = true;
            event.preventDefault(); // Prevent scrolling with arrow keys
        }
    });
    
    // Track keyup events
    document.addEventListener('keyup', function(event) {
        if (keys.hasOwnProperty(event.key)) {
            keys[event.key] = false;
        }
    });
    
    // Start the game loop with timestamp
    requestAnimationFrame(gameLoop);
});