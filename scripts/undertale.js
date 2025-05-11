document.addEventListener('DOMContentLoaded', function () {
    // Core game variables
    let lastTime = 0;
    const canvas = document.getElementById('gameCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Sound setup
    const collisionSound = new Audio('./media/snd_tempbell.wav');
    collisionSound.volume = 0.5;

    // Game objects
    const border = {
        x: 15,
        y: 15,
        width: 270,
        height: 270,
        thickness: 7,
    };

    const heart = {
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 15,
        normalSpeed: 3,
        slowSpeed: 1.5,
    };

    // Input tracking
    const keys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false,
        Shift: false, // Track only the "Shift" key
    };

    function drawHeart() {
        ctx.fillStyle = 'red';
        const pixelSize = 1;
        const heartPixels = [
            [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
        ];

        heartPixels.forEach((row, rowIndex) => {
            row.forEach((pixel, colIndex) => {
                if (pixel === 1) {
                    ctx.fillRect(
                        heart.x + (colIndex - heartPixels[0].length / 2),
                        heart.y + (rowIndex - heartPixels.length / 2),
                        pixelSize,
                        pixelSize
                    );
                }
            });
        });
    }

    function drawBorder() {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = border.thickness;
        ctx.strokeRect(border.x, border.y, border.width, border.height);
    }

    function checkBorderCollision() {
        const heartLeft = heart.x - heart.size / 2;
        const heartRight = heart.x + heart.size / 2;
        const heartTop = heart.y - heart.size / 2;
        const heartBottom = heart.y + heart.size / 2;

        if (
            heartLeft <= border.x ||
            heartRight >= border.x + border.width ||
            heartTop <= border.y ||
            heartBottom >= border.y + border.height
        ) {
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

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawBorder();

        let currentSpeed = keys.Shift ? heart.slowSpeed : heart.normalSpeed;

        if (keys.ArrowUp) heart.y -= currentSpeed * deltaTime * 60;
        if (keys.ArrowDown) heart.y += currentSpeed * deltaTime * 60;
        if (keys.ArrowLeft) heart.x -= currentSpeed * deltaTime * 60;
        if (keys.ArrowRight) heart.x += currentSpeed * deltaTime * 60;

        checkBorderCollision();
        drawHeart();

        requestAnimationFrame(gameLoop);
    }

    document.addEventListener(
        'keydown',
        function (event) {
            if (event.key in keys) {
                keys[event.key] = true;
                event.preventDefault();
            }
        },
        { passive: false }
    );

    document.addEventListener(
        'keyup',
        function (event) {
            if (event.key in keys) {
                keys[event.key] = false;
                event.preventDefault();
            }
        },
        { passive: false }
    );

    resetHeartPosition();
    requestAnimationFrame(gameLoop);
});