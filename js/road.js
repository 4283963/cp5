class Road {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.gridSize = 40;
        this.scrollOffset = 0;
        this.scrollSpeed = 3;
        this.roadColor = '#3d3d5c';
        this.gridColor = '#5a5a7a';
        this.sidewalkColor = '#4a4a6a';
        this.lineColor = '#ffd700';
    }

    update(baseSpeed) {
        this.scrollOffset = (this.scrollOffset + baseSpeed) % this.gridSize;
    }

    draw() {
        const ctx = this.ctx;

        ctx.fillStyle = this.roadColor;
        ctx.fillRect(0, 0, this.width, this.height);

        ctx.fillStyle = this.sidewalkColor;
        ctx.fillRect(0, 0, 30, this.height);
        ctx.fillRect(this.width - 30, 0, 30, this.height);

        ctx.strokeStyle = this.gridColor;
        ctx.lineWidth = 1;

        for (let y = -this.gridSize + this.scrollOffset; y < this.height; y += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(30, y);
            ctx.lineTo(this.width - 30, y);
            ctx.stroke();
        }

        for (let x = 30; x <= this.width - 30; x += this.gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.height);
            ctx.stroke();
        }

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(30, 0);
        ctx.lineTo(30, this.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.width - 30, 0);
        ctx.lineTo(this.width - 30, this.height);
        ctx.stroke();

        ctx.strokeStyle = this.lineColor;
        ctx.lineWidth = 3;
        ctx.setLineDash([20, 20]);
        const dashOffset = this.scrollOffset % 40;

        ctx.beginPath();
        ctx.moveTo(this.width / 2, -dashOffset);
        ctx.lineTo(this.width / 2, this.height);
        ctx.stroke();

        ctx.setLineDash([]);

        this._drawSidewalkPattern();
    }

    _drawSidewalkPattern() {
        const ctx = this.ctx;
        ctx.fillStyle = '#6a6a8a';

        for (let y = -this.gridSize + this.scrollOffset; y < this.height; y += this.gridSize) {
            for (let x = 5; x < 30; x += 15) {
                ctx.fillRect(x, y + 5, 8, 8);
            }
            for (let x = this.width - 25; x < this.width - 5; x += 15) {
                ctx.fillRect(x, y + 5, 8, 8);
            }
        }
    }
}
