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
        return `<style>
            #wrapper {
                position: relative;}
            #image-canvas { 
                width: 100%; 
                display: block;} 
            #left-arrow, #right-arrow {
                position: absolute; 
                height: 50px; 
                width: 40px;
                top: calc(50% - 25px); 
                cursor: pointer;
                background: url(${this.arrow()}) no-repeat 100% transparent; }
            #left-arrow { 
                left: 0; 
                padding-left: 15px;}
            #right-arrow { 
                transform: scaleX(-1);  
                right: 0; 
                padding-right: 15px;}
            #hover-area {
                visibility: hidden;
                position: absolute;
                width: 22%;
                height: 40%;
                background: #ffffff;
                opacity: .5;
                left: 0;
                top: 0;
                border: 3px solid rgba(255,255,0,0.97);
                box-sizing: border-box;
                -webkit-transition: all 100ms linear;
                transition: all 100ms linear;}
            #zoom-wrapper {
                position: absolute;               
                box-sizing: border-box;
                border: 3px solid rgba(255,255,0,0.97);
                visibility: hidden;
                left: calc(100% + 6px);
                top: 0;
                background: black;
                height: 90%;
                width: 50%;
                z-index: 1;
                }
            #zoom-canvas {
                width: 100%;
                height: 100%;
                display: block;
            }
        </style>`;
    }

    html() {
        return `<div id="wrapper">
                    <canvas id="image-canvas"></canvas>
                    <div id="hover-area"></div>                 
                </div>
                <span id="left-arrow"></span>
                <span id="right-arrow"></span>
                <div id="zoom-wrapper">
                    <canvas id="zoom-canvas"></canvas>
                </div>`;
    }

    connectedCallback() {
        this.state.images = JSON.parse(this.getAttribute('images'));
        this.state.canvas = this.shadow.getElementById('image-canvas');

        this.registerCanvasHoverCallbacks();

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

    registerCanvasHoverCallbacks() {
        const hoverArea = this.shadow.getElementById('hover-area');

        this.state.canvas.addEventListener('mousemove', e => {
            const newOffsetX = e.offsetX - hoverArea.offsetWidth / 2;
            const newOffsetY = e.offsetY - hoverArea.offsetHeight / 2;
            this.adjustHoverDisplay(newOffsetX, newOffsetY);
            this.adjustZoomDisplay(newOffsetX, newOffsetY, hoverArea.offsetWidth, hoverArea.offsetHeight);
        });

        hoverArea.addEventListener('mousemove', e => {
            const newOffsetX = parseInt(hoverArea.style.left) + e.movementX;
            const newOffsetY = parseInt(hoverArea.style.top) + e.movementY;
            this.adjustHoverDisplay(newOffsetX, newOffsetY);
            this.adjustZoomDisplay(newOffsetX, newOffsetY, hoverArea.offsetWidth, hoverArea.offsetHeight);
        });

        this.shadow.getElementById('wrapper').addEventListener('mouseleave', () => {
                setVisibility(hoverArea, false);
                setVisibility(this.shadow.getElementById('zoom-wrapper'), false);
            })
    }

    adjustHoverDisplay(newOffsetX, newOffsetY) {
        const hoverArea = this.shadow.getElementById('hover-area');
        if (newOffsetX < 0 || newOffsetY < 0
            || (this.state.canvas.offsetWidth - newOffsetX - hoverArea.offsetWidth) < 0
            || (this.state.canvas.offsetHeight - newOffsetY - hoverArea.offsetHeight) < 0) {
            setVisibility(hoverArea, false);
        } else {
            hoverArea.style.left = newOffsetX + 'px';
            hoverArea.style.top = newOffsetY + 'px';
            setVisibility(hoverArea, true);
        }
    }

    adjustZoomDisplay(sx, sy, sw, sh) {
        const zoomArea = this.shadow.getElementById('zoom-wrapper');
        if (this.shadow.getElementById('hover-area').style.visibility === 'visible') {
            const zoomCanvas = zoomArea.firstElementChild;
            const scaleX = this.state.canvas.width / this.state.canvas.offsetWidth;
            const scaleY = this.state.canvas.width / this.state.canvas.offsetWidth;
            zoomCanvas.width = sw * scaleX;
            zoomCanvas.height = sh * scaleY;
            zoomCanvas.getContext('2d').drawImage(this.state.canvas,
                sx * scaleX, sy * scaleY, zoomCanvas.width, zoomCanvas.height,
                0, 0, zoomCanvas.width, zoomCanvas.height);
            setVisibility(zoomArea, true);
        } else {
            setVisibility(zoomArea, false);
        }
    }

    renderImage(imgSource, opacity = .5, delay = 100) {
        const canvas = this.state.canvas;
        const img = new Image();
        img.onload = () => {
            if (canvas.width !== img.width) {
                canvas.width = img.width;
                canvas.height = img.height;
            }
            this.drawImageWithAnimation(img, opacity, delay);
        };
        img.src = imgSource;
    }

    drawImageWithAnimation(image, opacity, delay) {
        const context = this.state.canvas.getContext('2d');
        setTimeout(() => {
            context.globalAlpha = opacity;

            context.drawImage(image, 0, 0);
            if (opacity < 1) {
                this.drawImageWithAnimation(image, Math.min(1, opacity + .3), delay);
            }
            context.globalAlpha = .5;
            context.fillStyle = 'white';
            context.font = '30px "PT Sans", sans-serif';
            const waterMark = 'DEMO SHOP';
            const offsetY = 50;
            const offsetX = this.state.canvas.width - context.measureText(waterMark).width - offsetY;
            context.fillText(waterMark, offsetX, offsetY);
        }, delay);

    }
}

customElements.define('image-slider', ImageSlider);