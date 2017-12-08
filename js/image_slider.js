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
                background: url('images/arrow.svg') no-repeat 100% transparent; }
            #left-arrow[disabled], #right-arrow[disabled] {
                opacity: .5;
                cursor: default;
            }
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
                border: 3px solid #FFCC00;
                box-sizing: border-box;
                -webkit-transition: all 100ms linear;
                transition: all 100ms linear;}
            #zoom-wrapper {
                position: absolute;               
                box-sizing: border-box;
                border: 3px solid #FFCC00;
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
                <span id="left-arrow" disabled></span>
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
        const leftArrow = this.shadow.getElementById('left-arrow');
        const rightArrow = this.shadow.getElementById('right-arrow');
        if (imagesCount < 2) rightArrow.setAttribute('disabled', '');
        leftArrow.addEventListener("click", _.throttle(() => {

            if (this.state.currentIndex === 0) return;
            this.renderImage(this.state.images[--this.state.currentIndex]);
            if (this.state.currentIndex === 0) leftArrow.setAttribute('disabled', '');
            rightArrow.removeAttribute('disabled');

        }, 300));
        rightArrow.addEventListener("click", _.throttle(() => {

            if (this.state.currentIndex === imagesCount - 1) return;
            this.renderImage(this.state.images[++this.state.currentIndex]);
            if (this.state.currentIndex === imagesCount - 1) rightArrow.setAttribute('disabled', '');
            leftArrow.removeAttribute('disabled');

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