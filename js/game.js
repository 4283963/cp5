class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.restartBtn = document.getElementById('restartBtn');

        this.road = new Road(this.canvas);
        this.player = new Player(this.canvas);
        this.obstacleManager = new ObstacleManager(this.canvas);
        this.scoreBoard = new ScoreBoard(this.canvas);
        this.input = new InputHandler();

        this.isRunning = false;
        this.isGameOver = false;
        this.baseSpeed = 3;
        this.speedIncreaseTimer = 0;
        this.animationId = null;

        this._initRestartButton();
        this.start();
    }

    _initRestartButton() {
        this.restartBtn.addEventListener('click', () => {
            this.restart();
        });
    }

    start() {
        this.isRunning = true;
        this.isGameOver = false;
        this.restartBtn.style.display = 'none';
        this._gameLoop();
    }

    restart() {
        this.player.reset();
        this.obstacleManager.reset();
        this.scoreBoard.reset();
        this.input.reset();
        this.baseSpeed = 3;
        this.speedIncreaseTimer = 0;
        this.isGameOver = false;
        this.isRunning = true;
        this.restartBtn.style.display = 'none';

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this._gameLoop();
    }

    _gameLoop() {
        if (!this.isRunning) return;

        this._update();
        this._draw();

        this.animationId = requestAnimationFrame(() => {
            this._gameLoop();
        });
    }

    _update() {
        if (this.isGameOver) return;

        this.speedIncreaseTimer++;
        if (this.speedIncreaseTimer > 600) {
            this.speedIncreaseTimer = 0;
            this.baseSpeed = Math.min(this.baseSpeed + 0.5, 8);
        }

        this.road.update(this.baseSpeed);
        this.player.update(this.input);
        this.obstacleManager.update(this.baseSpeed);
        this.scoreBoard.update();

        this._checkCollisions();
    }

    _checkCollisions() {
        const hitObstacle = this.obstacleManager.checkCollision(this.player);

        if (hitObstacle) {
            if (hitObstacle.type === OBSTACLE_TYPES.BANANA) {
                this.player.slipOnBanana();
                this.obstacleManager.removeObstacle(hitObstacle);
            } else {
                this._gameOver();
            }
        }
    }

    _gameOver() {
        this.isGameOver = true;
        this.isRunning = false;
        this.scoreBoard.gameOver();
        this.restartBtn.style.display = 'inline-block';

        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        this._draw();
    }

    _draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.road.draw();
        this.obstacleManager.draw();
        this.player.draw();
        this.scoreBoard.draw();

        if (this.isGameOver) {
            this.scoreBoard.drawGameOver();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Game();
});
