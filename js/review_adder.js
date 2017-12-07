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
            submit: "Your review has been added!"
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
            }
            
            button.secondary {
                background: linear-gradient(180deg, #B1B1B1 0%, #777777 100%);
            }
            
            button:active {
                background: linear-gradient(0deg, #2BBCC2 100%, #1B745F 0%);
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
            
            i {
                font-style: italic;
                color: #FFCC00;
            }
            
            #preview-avatar {
                width: 75px;
                height: 75px;
                display: inline-block;
                margin-right: 20px;
                vertical-align: top;
                border: 1px solid #FFCC00;
            }
            
            #preview-text {
                display: inline-block;
                
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
                height: 180px;
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
            }
            
            .review-star.full {
              background-image: url("images/star-active.svg");
            }
            
            .review-star.blank {
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
                            <span hidden>
                                <i class="review-star blank"></i>
                                <i class="review-star blank"></i>
                                <i class="review-star blank"></i>
                                <i class="review-star blank"></i>
                                <i class="review-star blank"></i>
                            </span>
                        </div>
                        <div id="preview-main">
                            <img id="preview-avatar" src="images/blank-image.png"/>
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
                                    <img src="images/upload-icon.png"/>
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
                                        <span>
                                            <i class="review-star blank"></i>
                                            <i class="review-star blank"></i>
                                            <i class="review-star blank"></i>
                                            <i class="review-star blank"></i>
                                            <i class="review-star blank"></i>
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
                                    <button id="review-submit" type="submit">Add review</button>
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
        this.addTextFormatHandlers();
        this.addConfirmButtonsHandlers();
    }

    addDate() {
        const today = new Date();
        this.shadow.getElementById('preview-date').textContent =
            `${this.placeholders.months[today.getMonth()]} ${today.getDay()}, ${today.getFullYear()}`
    }

    addReviewChangeHandler() {
        this.shadow.getElementById('review-text')
            .addEventListener('keyup', e => this.forcePreviewTextUpdate(e.target.value));
    }

    forcePreviewTextUpdate(value) {
        this.shadow.getElementById('preview-text').innerHTML = value ? value : this.placeholders.preview;
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
        this.shadow.getElementById('review-submit').addEventListener('click', e => alert(this.placeholders.submit));
        // #todo handle cancel
    }
}

customElements.define('review-adder', ReviewAdder);