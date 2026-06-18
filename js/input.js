class InputHandler {
    constructor() {
        this.left = false;
        this.right = false;
        this._initListeners();
    }

    _initListeners() {
        document.addEventListener('keydown', (e) => {
            this._handleKeyDown(e);
        });

        document.addEventListener('keyup', (e) => {
            this._handleKeyUp(e);
        });
    }

    _handleKeyDown(e) {
        switch (e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.left = true;
                e.preventDefault();
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.right = true;
                e.preventDefault();
                break;
        }
    }

    _handleKeyUp(e) {
        switch (e.key) {
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.left = false;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.right = false;
                break;
        }
    }

    reset() {
        this.left = false;
        this.right = false;
    }
}
