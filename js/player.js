class Player {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = 40;
        this.height = 60;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 30;
        this.baseSpeed = 6;
        this.speed = this.baseSpeed;
        this.color = '#4ade80';
        this.acceleration = 0;
        this.isOutOfControl = false;
        this.outOfControlTimer = 0;
        this.outOfControlDuration = 180;
        this.wobble = 0;
        this.minX = 35;
        this.maxX = canvas.width - this.width - 35;
    }

    reset() {
        this.x = this.canvas.width / 2 - this.width / 2;
        this.speed = this.baseSpeed;
        this.isOutOfControl = false;
        this.outOfControlTimer = 0;
        this.wobble = 0;
    }

    update(input) {
        if (this.isOutOfControl) {
            this.outOfControlTimer--;
            this.wobble += 0.3;
            this.speed = this.baseSpeed * 1.8;

            const wobbleDirection = Math.sin(this.wobble) * 2;
            this.x += wobbleDirection;

            if (this.outOfControlTimer <= 0) {
                this.isOutOfControl = false;
                this.speed = this.baseSpeed;
                this.wobble = 0;
            }
        }

        if (input.left) {
            this.x -= this.speed;
        }
        if (input.right) {
            this.x += this.speed;
        }

        if (this.x < this.minX) this.x = this.minX;
        if (this.x > this.maxX) this.x = this.maxX;
    }

    slipOnBanana() {
        if (!this.isOutOfControl) {
            this.isOutOfControl = true;
            this.outOfControlTimer = this.outOfControlDuration;
        }
    }

    draw() {
        const ctx = this.ctx;
        const x = this.x;
        const y = this.y;
        const wobbleOffset = this.isOutOfControl ? Math.sin(this.wobble * 2) * 3 : 0;

        ctx.save();
        ctx.translate(x + this.width / 2 + wobbleOffset, y + this.height / 2);

        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.fillStyle = this.color;

        const wheelRadius = 10;
        ctx.beginPath();
        ctx.arc(-10, 20, wheelRadius, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(10, 20, wheelRadius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#22c55e';
        ctx.beginPath();
        ctx.moveTo(-10, 20);
        ctx.lineTo(0, -5);
        ctx.lineTo(10, 20);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(0, -5);
        ctx.lineTo(5, -20);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-5, -15);
        ctx.lineTo(10, -15);
        ctx.stroke();

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(3, -8, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#166534';
        ctx.fillRect(-8, -12, 16, 4);

        if (this.isOutOfControl) {
            ctx.fillStyle = '#fbbf24';
            ctx.font = '14px Courier New';
            ctx.fillText('!', -3, -28);
        }

        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x + 5,
            y: this.y + 5,
            width: this.width - 10,
            height: this.height - 10
        };
    }
}
