class GridDrawer {
    constructor() {
        this.canvas = document.querySelector('#grid');
        this.ctx = this.canvas.getContext('2d');
        this.breakpoints = [1200, 960, 640, 480];
        this.steps = [
            { v: 200, h: 193 },
            { v: 162.5, h: 156.8 },
            { v: 106.7, h: 103 },
            { v: 118.9, h: 114.7 },
            { v: 154.72, h: 149.31 },
        ];

        this.resizeCanvas = this.resizeCanvas.bind(this);
        this.getCurrentSteps = this.getCurrentSteps.bind(this);
        this.getFirstverticalX = this.getFirstverticalX.bind(this);
        this.drawHorizontalLine = this.drawHorizontalLine.bind(this);
        this.drawHorizontalLines = this.drawHorizontalLines.bind(this);
        this.redraw = this.redraw.bind(this);

        this.resizeCanvas();
        window.addEventListener('resize', this.resizeCanvas);
    }

    resizeCanvas() {
        this.canvas.height = document.documentElement.offsetHeight;
        this.canvas.width = document.documentElement.offsetWidth;
        this.redraw();
    }

    getCurrentSteps() {
        for (let i = 0; i < this.breakpoints.length; i++) {
            if (this.canvas.width > this.breakpoints[i]) {
                return this.steps[i];
            }
        }
        return this.steps[this.steps.length - 1];
    }

    getFirstverticalX(h) {
        const halfWidth = this.canvas.width / 2;
        return halfWidth % h;
    }

    drawHorizontalLine(level) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, level);
        this.ctx.lineTo(this.canvas.width, level);
        this.ctx.stroke();
    }

    drawHorizontalLines() {
        const { v } = this.getCurrentSteps();
        let y = 0;
        do {
            this.drawHorizontalLine(y)
            y += v;
        } while (y < this.canvas.height);
    }

    drawVerticalLine(shift) {
        this.ctx.beginPath();
        this.ctx.moveTo(shift, 0);
        this.ctx.lineTo(shift, this.canvas.height);
        this.ctx.stroke();
    }

    drawVerticalLines() {
        const { h } = this.getCurrentSteps();
        let x = this.getFirstverticalX(h);
        do {
            this.drawVerticalLine(x)
            x += h;
        } while (x < this.canvas.width);
    }

    redraw() {
        this.ctx.globalAlpha = 0.25;
        this.ctx.strokeStyle = '#F0EFEC';
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawHorizontalLines();
        this.drawVerticalLines();
    }
}