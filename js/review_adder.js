class ReviewAdder extends HTMLElement {

    constructor() {
        super();
        this.placeholders = {
            months: ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'],
            imageNotSelected: 'Image not selected',
            imageSelected: 'Image selected',
            name: 'Your name',
            preview: 'Start typing and your review text will appear here...',
            submit: "Your review has been added!",
            uploadImage: 'images/upload-icon.png',
            emptyAvatar: 'images/blank-image.png',

        };
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML += this.style();
        this.shadow.innerHTML += this.html();
    };

    style() {
        return `<style>
            h1 {
                font-size: 24px;
                text-align: left;
                line-height: 32px;
                margin: 0;
            }
            
            button {
                height: 35px;
                border-radius: 5px;
                border-width: 0;
                background: linear-gradient(180deg, #2BBCC2 0%, #1B745F 100%);
                color: #ffffff;
                font-size: 14px;
                line-height: 19px;
                text-align: center;
                outline: none;
                padding: 0 15px;
                cursor: pointer;
            }
            
            button.secondary {
                background: linear-gradient(180deg, #B1B1B1 0%, #777777 100%);
            }
            
            button:active {
                background: linear-gradient(0deg, #2BBCC2, #1B745F);
                box-shadow: inset 2px 2px 4px 0 rgba(0,0,0,0.3);
            }

            button.secondary:active {
                background: linear-gradient(0deg, #B1B1B1 0%, #777777 100%);
                box-shadow: inset 2px 2px 4px 0 rgba(0,0,0,0.5);
            }
            
            #review-confirmButtons button {
                width: 120px;
            }
            
            button[disabled] {
                opacity: .5;
                cursor: default;
            }
            
            #wrapper * {
                box-sizing: border-box;
                font-family: "PT Sans",sans-serif;
            }
            
            #preview-wrapper {
                background-color: rgba(0,0,0,0.7);
                min-height: 155px;
                width: 100%;
                padding: 15px;
                position: relative;
                font-size: 14px;
            }
            
            #preview-head {
                display: flex;
                justify-content: space-between;
            }
            
            #preview-signature {
                margin-bottom: 20px;
            }
            
            b, i {
                color: #FFCC00;
            }
            
            q {
                color: #FFFFFF;	
                font-size: 24px;	
                font-style: italic;	
                line-height: 32px;
                quotes: "\\201C\\A0" "\\A0\\201e";
            }
            
            q:before, q:after {
                font-weight: bold;
                font-style: normal;
                color: #FFCC00;
                font-size: 40px;
            }
            
            q:before {
                content: open-quote;
                vertical-align: middle;
            }

            q:after {
                content: close-quote;
            }
            
            #preview-avatar {
                width: 75px;
                height: 75px;
                display: inline-block;
                margin-right: 20px;
                vertical-align: top;
                border: 1px solid #FFCC00;
            }
            
            #preview-main {
                display: flex;
            }
            
            #preview-text {
                display: inline-block;
                white-space: pre-wrap;
                padding-bottom: 20px;
                width: 100%;
            }
            
            #review-pane {
                position: absolute;
                height: 40px;	
                width: 180px;	
                border: 3px solid #3FC5CB;	border-radius: 15px;	
                background-color: #FFFFFF;
                font-size: 14px;	
                font-weight: bold;	
                color: black;
                line-height: 35px;	
                text-align: center;
                vertical-align: middle;
                left: calc(50% - 90px);
                top: calc(100% - 20px);
            }
            
            #review-wrapper {
                border: 3px solid #3FC5CB;
                background: url('images/modal-bg.png');
                height: 300px;
                display: flex;
                flex-flow: row;
                padding: 30px;
            }
            
            #review-wrapper label {
                	height: 18px;	
                	color: #000000;	
                	font-size: 16px;
                	line-height: 20px;
                	margin-bottom: 5px;
            }
            
            #review-personalWrapper {
                width: 285px;
                display: flex;
                flex-flow: column;
                margin-right: 20px;
            }
            
            #review-upload {
                background: #ffffff;
                display: flex;
                justify-content: flex-end;
                height: 100%;
                padding: 10px 10px 10px 0;
                max-height: 95px;
                border-radius: 15px;
            }
            
            #review-uploadText {
                color: #000000;
                font-size: 14px;
                font-style: italic;
                opacity: 0.5;
                margin: auto auto;
            }
            
            #review-uploadText.uploaded {
                opacity: 1;
            }
            
            #review-upload img {
                width: 75px;
                height: 75px;
                border-radius: 15px;
                cursor: pointer;
            }   
            
            #review-mainWrapper {
                width: 100%; 
                display: flex;
                flex-flow: column;
                justify-content: space-between;
            }
            
            textarea {
                border: 5px solid transparent;
                border-radius: 5px;
                padding: 10px;
                margin-bottom: 5px;	
                height: 178px;
                width: 100%;     
                color: #000000;
                font-size: 16px;
                line-height: 20px;
                outline: none;
                resize: none;
            }
            
            textarea:focus {
                border-color: rgba(40, 133, 117, 0.3);
            }
            
            #review-textTop {
                display: flex;
                justify-content: space-between;
            }
            
            #review-name {
                height: 35px;
                width: 235px;	
                border-radius: 5px;	
                border: 5px solid transparent;
                margin-bottom: 20px;
                font-size: 14px;		
                line-height: 19px;
                outline: none;
                padding: 0 10px; 
            }
            
            #review-name:focus {
                border-color: rgba(40, 133, 117, 0.3);
            }
            
            #review-buttons {
                display: flex;
                justify-content: space-between;
            }
            
            .review-star {
                margin-right: 3px;
                width: 18px;
                height: 18px;
                background-size: contain;
                display: inline-block;
                background-image: url("images/star-active.svg");
            }
            
            .review-star.review-star_blank {
                background-image: url("images/star-gray.svg");
            }
            
            .review-star.preview-star_blank {
              background-image: url("images/star-inactive.svg");
            }
        </style>`;
    }

    html() {
        return `<div id="wrapper">
                    <h1>Add review</h1>
                    <div id="preview-wrapper">
                        <div id="preview-head">
                            <span id="preview-signature">
                                By <i id="preview-name">${this.placeholders.name}</i> <span id="preview-date"></span>
                            </span>
                            <span id="preview-rating" hidden>
                                <i class="review-star"></i>
                                <i class="review-star"></i>
                                <i class="review-star"></i>
                                <i class="review-star"></i>
                                <i class="review-star"></i>
                            </span>
                        </div>
                        <div id="preview-main">
                            <img id="preview-avatar" src="${this.placeholders.emptyAvatar}"/>
                            <div id="preview-text">${this.placeholders.preview}</div>
                        </div>
                        <div id="review-pane">EDIT YOUR REVIEW</div>
                    </div>
                    <div id="review-wrapper">
                        <div id="review-personalWrapper">
                            <label>Enter your name:</label>
                            <input maxlength="100" id="review-name"/>
                            <label>Choose your avatar:</label>
                            <div id="review-upload">
                                <span id="review-uploadText">${this.placeholders.imageNotSelected}</span>
                                <label for="review-uploadImage">
                                    <img src="${this.placeholders.uploadImage}"/>
                                </label>
                                <input id="review-uploadImage" hidden type="file" accept="image/*"/>
                            </div>
                        </div>
                        <div id="review-mainWrapper">
                            <div>
                                <div id="review-textTop">
                                    <label>Write your review:</label>
                                    <div>
                                        <label>Rate product: </label>
                                        <span id="review-rating">
                                            <i class="review-star review-star_blank"></i>
                                            <i class="review-star review-star_blank"></i>
                                            <i class="review-star review-star_blank"></i>
                                            <i class="review-star review-star_blank"></i>
                                            <i class="review-star review-star_blank"></i>
                                        </span>
                                    </div>
                                </div>
                                <textarea id="review-text""></textarea>
                            </div>
                            <div id="review-buttons">
                                <div>
                                    <button id="review-bold" class="secondary">Bold</button>
                                    <button id="review-emphasize" class="secondary">Emphasize</button>
                                    <button id="review-quote" class="secondary">Quote</button>
                                </div>
                                <div id="review-confirmButtons">
                                    <button id="review-cancel" class="secondary">Cancel</button>
                                    <button id="review-submit" disabled type="submit">Add review</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
    }

    connectedCallback() {
        this.addDate();
        this.addReviewChangeHandler();
        this.addImageChangeHandler();
        this.addNameChangeHandler();
        this.addRateHandler();
        this.addTextFormatHandlers();
        this.addConfirmButtonsHandlers();
    }

    static get observedAttributes() {
        return ['hidden'];
    }

    attributeChangedCallback() {
        this.setComponentHidden(this.shadow.host.hasAttribute('hidden'))
    }

    setComponentHidden(hidden) {
        const wrapper = this.shadow.getElementById('wrapper');
        hidden ? wrapper.setAttribute('hidden', '') : wrapper.removeAttribute('hidden');
    }

    addDate() {
        const today = new Date();
        this.shadow.getElementById('preview-date').textContent =
            `${this.placeholders.months[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`
    }

    addReviewChangeHandler() {
        this.shadow.getElementById('review-text').addEventListener('keyup', e => {
            this.forcePreviewTextUpdate(e.target.value);
            this.setSubmitButtonEnabled(e.target.value.trim().length > 0);
        });
    }

    setSubmitButtonEnabled(enabled) {
        const button = this.shadow.getElementById('review-submit');
        enabled ? button.removeAttribute('disabled') : button.setAttribute('disabled', '');
    }

    forcePreviewTextUpdate(value) {
        const sanitize = text => text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const htmlize = text =>
            ['b', 'i', 'q'].reduce((text, modifier) =>
                text.replace(new RegExp(`\\[${modifier}]`, 'g'), `<${modifier}>`)
                    .replace(new RegExp(`\\[\\/${modifier}]`, 'g'), `</${modifier}>`), text);

        const preview = this.shadow.getElementById('preview-text');
        preview.innerHTML = value ? htmlize(sanitize(value)) : this.placeholders.preview;
    }

    addImageChangeHandler() {
        this.shadow.getElementById('review-uploadImage').addEventListener('change', e => {
            if (!e.target.files[0]) return;
            const reader = new FileReader();
            reader.onloadend = () => {
                this.shadow.querySelector('#review-upload img').src = reader.result;
                this.shadow.getElementById("preview-avatar").src = reader.result;
            };
            reader.readAsDataURL(e.target.files[0]);
            const imageUploadedText = this.shadow.getElementById('review-uploadText');
            imageUploadedText.className += ' uploaded';
            imageUploadedText.textContent = this.placeholders.imageSelected;
        });
    };

    addNameChangeHandler() {
        this.shadow.getElementById('review-name').addEventListener('keyup', e =>
            this.shadow.getElementById('preview-name').textContent =
                e.target.value ? e.target.value : this.placeholders.name)
    }

    addRateHandler() {
        const reviewRating = this.shadow.getElementById('review-rating');
        reviewRating.addEventListener('click', e => {
            const newRate = Array.prototype.indexOf.call(reviewRating.children, e.target) + 1;
            if (newRate <= 0) return;
            this.setNewRate(newRate);
        });
    }

    setNewRate(rate) {
        const reviewRating = this.shadow.getElementById('review-rating');
        const previewRating = this.shadow.getElementById('preview-rating');
        const reviewBlankClass = 'review-star_blank';
        const previewBlankClass = 'preview-star_blank';
        Array.prototype.forEach.call(reviewRating.children, (e, i) => {
            const previewStar = previewRating.children[i];
            if (rate <= i) {
                if (!e.classList.contains(reviewBlankClass)) e.className += ` ${reviewBlankClass}`;
                if (!previewStar.classList.contains(previewBlankClass)) {
                    previewStar.className += ` ${previewBlankClass}`;
                }
            } else {
                e.classList.remove(reviewBlankClass);
                previewStar.classList.remove(previewBlankClass);
            }
            if (previewRating.hasAttribute('hidden')) previewRating.removeAttribute('hidden');
        });
    }

    addTextFormatHandlers() {
        const modifier = escaper => {
            return () => {
                const textarea = this.shadow.getElementById('review-text');
                const original = textarea.value;
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                const selection = original.substring(start, end);
                if (!selection) return;
                const beforeSelection = original.substring(0, start);
                const afterSelection = original.substring(end, original.length);
                textarea.value = `${beforeSelection}[${escaper}]${selection}[/${escaper}]${afterSelection}`;
                this.forcePreviewTextUpdate(textarea.value);
            }
        };
        this.shadow.getElementById('review-bold').addEventListener('click', modifier('b'));
        this.shadow.getElementById('review-emphasize').addEventListener('click', modifier('i'));
        this.shadow.getElementById('review-quote').addEventListener('click', modifier('q'));
    }

    addConfirmButtonsHandlers() {
        this.shadow.getElementById('review-submit').addEventListener('click', () => alert(this.placeholders.submit));
        this.shadow.getElementById('review-cancel').addEventListener('click', () => {
            this.setComponentHidden(true);
            this.resetData();
        })
    }

    resetData() {
        this.shadow.getElementById('review-text').value = '';
        this.forcePreviewTextUpdate('');
        this.shadow.querySelector('#review-upload img').src = this.placeholders.uploadImage;
        this.shadow.getElementById('preview-avatar').src = this.placeholders.emptyAvatar;
        const imageUploadedText = this.shadow.getElementById('review-uploadText');
        imageUploadedText.classList.remove('uploaded');
        imageUploadedText.textContent = this.placeholders.imageNotSelected;
        this.shadow.getElementById('review-name').value = '';
        this.shadow.getElementById('preview-name').textContent = this.placeholders.name;
        this.setNewRate(0);
        this.shadow.getElementById('preview-rating').setAttribute('hidden', '');
        this.shadow.getElementById('review-submit').setAttribute('disabled', '');
    }
}

customElements.define('review-adder', ReviewAdder);