const OBSTACLE_TYPES = {
    TRUCK: 'truck',
    STONE: 'stone',
    BANANA: 'banana'
};

class Obstacle {
    constructor(canvas, type) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.type = type;
        this.active = true;
        this.minX = 35;
        this.maxX = canvas.width - 35;

        switch (type) {
            case OBSTACLE_TYPES.TRUCK:
                this._initTruck();
                break;
            case OBSTACLE_TYPES.STONE:
                this._initStone();
                break;
            case OBSTACLE_TYPES.BANANA:
                this._initBanana();
                break;
        }

        this.x = this.minX + Math.random() * (this.maxX - this.minX - this.width);
        this.y = -this.height;
    }

    _initTruck() {
        this.width = 60;
        this.height = 100;
        this.speed = 3 + Math.random() * 2;
        this.color = '#dc2626';
        this.damage = true;
    }

    _initStone() {
        this.width = 25;
        this.height = 25;
        this.speed = 5 + Math.random() * 3;
        this.color = '#6b7280';
        this.damage = true;
    }

    _initBanana() {
        this.width = 30;
        this.height = 20;
        this.speed = 4 + Math.random() * 2;
        this.color = '#fbbf24';
        this.damage = false;
        this.rotation = 0;
    }

    update(baseSpeed) {
        this.y += this.speed + baseSpeed * 0.5;

        if (this.type === OBSTACLE_TYPES.BANANA) {
            this.rotation += 0.05;
        }

        if (this.y > this.canvas.height + this.height) {
            this.active = false;
        }
    }

    draw() {
        switch (this.type) {
            case OBSTACLE_TYPES.TRUCK:
                this._drawTruck();
                break;
            case OBSTACLE_TYPES.STONE:
                this._drawStone();
                break;
            case OBSTACLE_TYPES.BANANA:
                this._drawBanana();
                break;
        }
    }

    _drawTruck() {
        const ctx = this.ctx;
        const x = this.x;
        const y = this.y;

        ctx.fillStyle = this.color;
        ctx.fillRect(x, y + 15, this.width, this.height - 15);

        ctx.fillStyle = '#991b1b';
        ctx.fillRect(x + 5, y, this.width - 10, 25);

        ctx.fillStyle = '#60a5fa';
        ctx.fillRect(x + 10, y + 5, this.width - 20, 15);

        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(x + 5, y + 25, 8, 12);
        ctx.fillRect(x + this.width - 13, y + 25, 8, 12);

        ctx.fillStyle = '#1f2937';
        ctx.fillRect(x - 3, y + this.height - 18, 12, 18);
        ctx.fillRect(x + this.width - 9, y + this.height - 18, 12, 18);

        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 10px Courier New';
        ctx.fillText('逆行', x + 15, y + 65);
    }

    _drawStone() {
        const ctx = this.ctx;
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;
        const r = this.width / 2;

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(cx, cy - r);
        ctx.lineTo(cx + r * 0.8, cy - r * 0.3);
        ctx.lineTo(cx + r, cy + r * 0.5);
        ctx.lineTo(cx + r * 0.3, cy + r);
        ctx.lineTo(cx - r * 0.6, cy + r * 0.7);
        ctx.lineTo(cx - r, cy);
        ctx.lineTo(cx - r * 0.5, cy - r * 0.8);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#9ca3af';
        ctx.beginPath();
        ctx.arc(cx - r * 0.3, cy - r * 0.2, r * 0.25, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#4b5563';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx - r * 0.2, cy + r * 0.1);
        ctx.lineTo(cx + r * 0.3, cy - r * 0.4);
        ctx.stroke();
    }

    _drawBanana() {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(-12, 5);
        ctx.quadraticCurveTo(-8, -10, 0, -8);
        ctx.quadraticCurveTo(8, -10, 12, 5);
        ctx.quadraticCurveTo(6, 3, 0, 5);
        ctx.quadraticCurveTo(-6, 3, -12, 5);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#92400e';
        ctx.fillRect(-13, 3, 3, 5);
        ctx.fillRect(10, 3, 3, 5);

        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-8, 0);
        ctx.quadraticCurveTo(0, -4, 8, 0);
        ctx.stroke();

        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}

class ObstacleManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.obstacles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 60;
        this.difficultyTimer = 0;
    }

    reset() {
        this.obstacles = [];
        this.spawnTimer = 0;
        this.spawnInterval = 60;
        this.difficultyTimer = 0;
    }

    update(baseSpeed) {
        this.spawnTimer++;
        this.difficultyTimer++;

        if (this.difficultyTimer > 600) {
            this.difficultyTimer = 0;
            if (this.spawnInterval > 25) {
                this.spawnInterval -= 5;
            }
        }

        if (this.spawnTimer >= this.spawnInterval) {
            this.spawnTimer = 0;
            this._spawnObstacle();
        }

        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].update(baseSpeed);
            if (!this.obstacles[i].active) {
                this.obstacles.splice(i, 1);
            }
        }
    }

    _spawnObstacle() {
        const rand = Math.random();
        let type;

        if (rand < 0.35) {
            type = OBSTACLE_TYPES.TRUCK;
        } else if (rand < 0.7) {
            type = OBSTACLE_TYPES.STONE;
        } else {
            type = OBSTACLE_TYPES.BANANA;
        }

        const newObstacle = new Obstacle(this.canvas, type);

        let overlapping = false;
        for (const obs of this.obstacles) {
            if (this._checkOverlap(newObstacle, obs)) {
                overlapping = true;
                break;
            }
        }

        if (!overlapping) {
            this.obstacles.push(newObstacle);
        }
    }

    _checkOverlap(a, b) {
        const boundsA = a.getBounds();
        const boundsB = b.getBounds();
        return (
            boundsA.x < boundsB.x + boundsB.width + 20 &&
            boundsA.x + boundsA.width + 20 > boundsB.x &&
            boundsA.y < boundsB.y + boundsB.height + 20 &&
            boundsA.y + boundsA.height + 20 > boundsB.y
        );
    }

    draw() {
        for (const obstacle of this.obstacles) {
            obstacle.draw();
        }
    }

    checkCollision(player) {
        const playerBounds = player.getBounds();

        for (const obstacle of this.obstacles) {
            const obsBounds = obstacle.getBounds();

            if (this._rectsCollide(playerBounds, obsBounds)) {
                return obstacle;
            }
        }
        return null;
    }

    _rectsCollide(a, b) {
        return (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
        );
    }

    removeObstacle(obstacle) {
        const index = this.obstacles.indexOf(obstacle);
        if (index > -1) {
            this.obstacles.splice(index, 1);
        }
    }
}
