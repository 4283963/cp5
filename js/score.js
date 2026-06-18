class ScoreBoard {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.score = 0;
        this.highScore = 0;
        this.timer = 0;
        this.x = 10;
        this.y = 25;
        this._loadHighScore();
    }

    _loadHighScore() {
        try {
            const saved = localStorage.getItem('bikeGameHighScore');
            if (saved) {
                this.highScore = parseInt(saved, 10) || 0;
            }
        } catch (e) {
            this.highScore = 0;
        }
    }

    _saveHighScore() {
        try {
            localStorage.setItem('bikeGameHighScore', this.highScore.toString());
        } catch (e) {
        }
    }

    reset() {
        this.score = 0;
        this.timer = 0;
    }

    update() {
        this.timer++;
        if (this.timer >= 60) {
            this.timer = 0;
            this.score++;
        }
    }

    gameOver() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            this._saveHighScore();
        }
    }

    draw() {
        const ctx = this.ctx;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(5, 5, 150, 50);

        ctx.strokeStyle = '#e94560';
        ctx.lineWidth = 2;
        ctx.strokeRect(5, 5, 150, 50);

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 16px Courier New';
        ctx.fillText(`分数: ${this.score}`, this.x, this.y);

        ctx.fillStyle = '#4ade80';
        ctx.font = '12px Courier New';
        ctx.fillText(`最高: ${this.highScore}`, this.x, this.y + 20);
    }

    drawGameOver() {
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.fillStyle = '#e94560';
        ctx.font = 'bold 40px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('游戏结束', centerX, centerY - 60);

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 24px Courier New';
        ctx.fillText(`得分: ${this.score}`, centerX, centerY);

        if (this.score >= this.highScore && this.score > 0) {
            ctx.fillStyle = '#4ade80';
            ctx.font = 'bold 18px Courier New';
            ctx.fillText('🎉 新纪录! 🎉', centerX, centerY + 35);
        }

        ctx.fillStyle = '#eaeaea';
        ctx.font = '16px Courier New';
        ctx.fillText(`最高分: ${this.highScore}`, centerX, centerY + 65);

        ctx.fillStyle = '#a8a8b3';
        ctx.font = '14px Courier New';
        ctx.fillText('点击「重新开始」按钮再来一局', centerX, centerY + 100);

        ctx.textAlign = 'left';
    }
}
