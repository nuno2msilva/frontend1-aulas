document.addEventListener('DOMContentLoaded', function() {
    // Core game variables
    let lastTime = 0;
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Sound setup
    const collisionSound = new Audio();
    collisionSound.src = "./media/snd_tempbell.wav";
    collisionSound.volume = 0.5;
    
    // Game objects
    const border = {
        x: 15,
        y: 15,
        width: 270,
        height: 270,
        thickness: 7
    };
    
    const heart = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 15,
        normalSpeed: 3,
        slowSpeed: 1.5
    };
    
    // Input tracking
    const keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        Shift: false
    };
    
    function drawHeart() {
        ctx.fillStyle = 'red';
        const pixelSize = 1;
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
            [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0]
        ];
        
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
    
    function drawBorder() {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = border.thickness;
        ctx.strokeRect(border.x, border.y, border.width, border.height);
    }
    
    function checkBorderCollision() {
        const pixelSize = 1;
        const heartWidth = 16 * pixelSize;
        const heartHeight = 15 * pixelSize;
        const heartLeft = heart.x - heartWidth / 2;
        const heartRight = heart.x + heartWidth / 2;
        const heartTop = heart.y - heartHeight / 2;
        const heartBottom = heart.y + heartHeight / 2;
        
        if (heartLeft <= border.x || 
            heartRight >= border.x + border.width || 
            heartTop <= border.y || 
            heartBottom >= border.y + border.height) {
            
            collisionSound.currentTime = 0;
            collisionSound.play();
            resetHeartPosition();
        }
    }

    function resetHeartPosition() {
        heart.x = border.x + border.width / 2;
        heart.y = border.y + border.height / 2;
    }

    function gameLoop(currentTime) {
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;
        
        // Render
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawBorder();
        
        // Update
        let currentSpeed = heart.normalSpeed;
        if (keys.Shift) {
            currentSpeed = heart.slowSpeed;
        }
        
        if (keys.ArrowUp) heart.y -= currentSpeed * deltaTime * 60;
        if (keys.ArrowDown) heart.y += currentSpeed * deltaTime * 60;
        if (keys.ArrowLeft) heart.x -= currentSpeed * deltaTime * 60;
        if (keys.ArrowRight) heart.x += currentSpeed * deltaTime * 60;
        
        checkBorderCollision();
        drawHeart();
        
        requestAnimationFrame(gameLoop);
    }
    
    // Event handlers
    document.addEventListener('keydown', function(event) {
        if (keys.hasOwnProperty(event.key)) {
            keys[event.key] = true;
            event.preventDefault();
        }
    }, {passive: false});
    
    document.addEventListener('keyup', function(event) {
        if (keys.hasOwnProperty(event.key)) {
            keys[event.key] = false;
            event.preventDefault();
        }
    }, {passive: false});
    
    // Initialize and start game
    resetHeartPosition();
    requestAnimationFrame(gameLoop);
});