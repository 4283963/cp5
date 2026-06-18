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
        this.isReversed = false;
        this.outOfControlTimer = 0;
        this.reverseTimer = 0;
        this.outOfControlDuration = 120;
        this.reverseDuration = 120;
        this.wobble = 0;
        this.minX = 35;
        this.maxX = canvas.width - this.width - 35;
        this.trailParticles = [];
        this.maxTrailParticles = 15;
    }

    reset() {
        this.x = this.canvas.width / 2 - this.width / 2;
        this.speed = this.baseSpeed;
        this.isOutOfControl = false;
        this.isReversed = false;
        this.outOfControlTimer = 0;
        this.reverseTimer = 0;
        this.wobble = 0;
        this.trailParticles = [];
    }

    update(input) {
        if (this.isOutOfControl) {
            this.outOfControlTimer--;
            this.wobble += 0.4;
            this.speed = this.baseSpeed * 2;

            const wobbleDirection = Math.sin(this.wobble) * 2.5;
            this.x += wobbleDirection;

            this._addTrailParticle();

            if (this.outOfControlTimer <= 0) {
                this.isOutOfControl = false;
                this.speed = this.baseSpeed;
                this.wobble = 0;
            }
        }

        if (this.isReversed) {
            this.reverseTimer--;
            if (this.reverseTimer <= 0) {
                this.isReversed = false;
            }
        }

        let moveLeft = input.left;
        let moveRight = input.right;

        if (this.isReversed) {
            const temp = moveLeft;
            moveLeft = moveRight;
            moveRight = temp;
        }

        if (moveLeft) {
            this.x -= this.speed;
        }
        if (moveRight) {
            this.x += this.speed;
        }

        if (this.x < this.minX) this.x = this.minX;
        if (this.x > this.maxX) this.x = this.maxX;

        this._updateTrailParticles();
    }

    _addTrailParticle() {
        if (this.trailParticles.length >= this.maxTrailParticles) {
            this.trailParticles.shift();
        }

        this.trailParticles.push({
            x: this.x + this.width / 2,
            y: this.y + this.height - 5,
            vx: (Math.random() - 0.5) * 3,
            vy: Math.random() * 2 + 1,
            life: 1,
            size: Math.random() * 6 + 4,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.3
        });
    }

    _updateTrailParticles() {
        for (let i = this.trailParticles.length - 1; i >= 0; i--) {
            const p = this.trailParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.06;
            p.rotation += p.rotationSpeed;

            if (p.life <= 0) {
                this.trailParticles.splice(i, 1);
            }
        }
    }

    slipOnBanana() {
        if (!this.isOutOfControl) {
            this.isOutOfControl = true;
            this.outOfControlTimer = this.outOfControlDuration;
        }
        this.isReversed = true;
        this.reverseTimer = this.reverseDuration;

        for (let i = 0; i < 8; i++) {
            this._addTrailParticle();
        }
    }

    draw() {
        this._drawTrail();

        const ctx = this.ctx;
        const x = this.x;
        const y = this.y;
        const wobbleOffset = this.isOutOfControl ? Math.sin(this.wobble * 2) * 4 : 0;

        if (this.isReversed) {
            ctx.save();
            ctx.globalAlpha = 0.3 + Math.sin(Date.now() / 80) * 0.2;
            ctx.fillStyle = '#fbbf24';
            ctx.fillRect(x - 3, y - 3, this.width + 6, this.height + 6);
            ctx.restore();
        }

        ctx.save();
        ctx.translate(x + this.width / 2 + wobbleOffset, y + this.height / 2);
        if (this.isOutOfControl) {
            ctx.rotate(Math.sin(this.wobble * 1.5) * 0.15);
        }

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

        if (this.isOutOfControl || this.isReversed) {
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 16px Courier New';
            ctx.fillText('!', -4, -28);

            if (this.isReversed) {
                ctx.fillStyle = '#ef4444';
                ctx.font = 'bold 10px Courier New';
                ctx.fillText('⇄', -7, -40);
            }
        }

        ctx.restore();

        if (this.isReversed) {
            this._drawReverseIndicator();
        }
    }

    _drawTrail() {
        const ctx = this.ctx;

        for (const p of this.trailParticles) {
            ctx.save();
            ctx.globalAlpha = p.life * 0.8;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);

            const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size);
            gradient.addColorStop(0, `rgba(251, 191, 36, ${p.life})`);
            gradient.addColorStop(0.5, `rgba(234, 179, 8, ${p.life * 0.5})`);
            gradient.addColorStop(1, 'rgba(120, 53, 15, 0)');

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.ellipse(0, 0, p.size, p.size * 0.5, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.strokeStyle = `rgba(217, 119, 6, ${p.life * 0.6})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-p.size * 0.8, 0);
            ctx.lineTo(p.size * 0.8, 0);
            ctx.stroke();

            ctx.restore();
        }
    }

    _drawReverseIndicator() {
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;

        const flashAlpha = 0.5 + Math.sin(Date.now() / 100) * 0.3;

        ctx.save();
        ctx.globalAlpha = flashAlpha;
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 18px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('⚠ 方向反转 ⚠', centerX, 85);
        ctx.textAlign = 'left';
        ctx.restore();
    }

    getBounds() {
        return {
            x: this.x + 10,
            y: this.y + 8,
            width: this.width - 20,
            height: this.height - 16
        };
    }
}
