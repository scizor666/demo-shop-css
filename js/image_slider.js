class ImageSlider extends HTMLElement {

    constructor() {
        super();
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML += this.style();
        this.shadow.innerHTML += this.html();
        this.state = {
            currentIndex: 0
        };
    };

    arrow() {
        return 'data:image/svg+xml;base64,PHN2ZyBpZD0iTGF5ZXJfMSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDggNDg7IiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA0OCA0OCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+PGcgZmlsbD0iI2ZmY2MwMCI+PHBvbHlnb24gcG9pbnRzPSIzMC44LDQ1LjcgOS4xLDI0IDMwLjgsMi4zIDMyLjIsMy43IDExLjksMjQgMzIuMiw0NC4zICAiLz48L2c+PC9zdmc+';
    }

    style() {
        return '<style>#shadowroot {position: relative} ' +
            '#canvas { width: 100%; display: block;} ' +
            `#left-arrow, #right-arrow {
                position: absolute; 
                height: 100%; 
                width: 40px;
                top: 0; 
                background: url(${this.arrow()}) no-repeat 100% transparent; }` +
            `#left-arrow { 
                left: 0; 
                padding-left: 15px;}` +
            `#right-arrow { 
                transform: scaleX(-1);  
                right: 0; 
                padding-right: 15px;}` +
            '</style>';
    }

    html() {
        return '<span id="left-arrow"></span><canvas id="canvas"></canvas><span id="right-arrow"></span>';
    }

    connectedCallback() {
        this.state.images = JSON.parse(this.getAttribute('images'));
        this.state.canvas = this.shadow.getElementById('canvas');

        this.renderImage(this.state.images[this.state.currentIndex], 1, 0);

        const imagesCount = this.state.images.length;
        this.shadow.getElementById('left-arrow').addEventListener("click", _.throttle(() => {
            const nextIndex =
                this.state.currentIndex > 0 ? --this.state.currentIndex : this.state.currentIndex = imagesCount - 1;
            this.renderImage(this.state.images[nextIndex])
        }, 300));
        this.shadow.getElementById('right-arrow').addEventListener("click", _.throttle(() => {
            const nextIndex =
                this.state.currentIndex < imagesCount - 1 ? ++this.state.currentIndex : this.state.currentIndex = 0;
            this.renderImage(this.state.images[nextIndex])
        }, 300));

    }

    renderImage(imgSource, opacity = .5, delay = 100) {
        const canvas = this.state.canvas;
        const img = new Image();
        img.onload = () => {
            if (canvas.width !== img.width) {
                canvas.width = img.width;
                canvas.height = img.height;
            }
            this.drawImageWithAnimation(canvas, img, opacity, delay);
        };
        img.src = imgSource;
        return canvas
    }

    drawImageWithAnimation(canvas, image, opacity, delay) {
        const context = canvas.getContext('2d');
        const offset = 50;
        const waterMark = "DEMO SHOP";
        setTimeout(() => {
            context.globalAlpha = opacity;

            context.drawImage(image, 0, 0);
            if (opacity < 1) {
                this.drawImageWithAnimation(canvas, image, Math.min(1, opacity + .3), delay);
            }
            context.globalAlpha = .5;
            context.fillStyle = 'white';
            context.font = "30px \"PT Sans\", sans-serif";
            context.fillText(waterMark, canvas.width - context.measureText(waterMark).width - offset, offset);
        }, delay);

    }
}

customElements.define('image-slider', ImageSlider);