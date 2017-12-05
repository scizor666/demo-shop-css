class ReviewAdder extends HTMLElement {

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
            
            #preview-signature {
                margin-bottom: 20px;
            }
            
            #preview-avatar {
                width: 75px;
                display: inline-block;
                margin-right: 20px;
                vertical-align: top;
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
            
            #review-mainWrapper {
                width: 100%; 
                display: flex;
                flex-flow: column;
                justify-content: space-between;
            }
            
            textarea {
                border: 5px solid transparent;
                border-radius: 5px;	
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
                font-style: italic;	
                line-height: 19px;
                outline: none;
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
                        <div id="preview-signature">By <span id="preview-name">Your name</span><span id="preview-date"></span></div>
                        <div>
                            <img id="preview-avatar" src="images/blank-image.png"/>
                            <div id="preview-text">Start typing and your review text will appear here...</div>
                        </div>
                        <div id="review-pane">EDIT YOUR REVIEW</div>
                    </div>
                    <div id="review-wrapper">
                        <div id="review-personalWrapper">
                            <label>Enter your name:</label>
                            <input id="review-name"/>
                            <label>Choose your avatar:</label>
                            <input type="file"/>
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
                                <textarea></textarea>
                            </div>
                            <div id="review-buttons">
                                <div>
                                    <button class="secondary">Bold</button>
                                    <button class="secondary">Emphasize</button>
                                    <button class="secondary">Quote</button>
                                </div>
                                <div id="review-confirmButtons">
                                    <button class="secondary">Cancel</button>
                                    <button>Add review</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`
    }

}
customElements.define('review-adder', ReviewAdder);