const toggleDisplay = id => {
    const element = document.getElementById(id);
    const activeClass = 'active';
    const inactiveClass = 'inactive';
    if (element.classList.contains(activeClass)) {
        element.classList.remove(activeClass);
        element.className += ' ' + inactiveClass;
    } else {
        element.classList.remove(inactiveClass);
        element.className += ' ' + activeClass;
    }
};

const togglePopup = id => {
    toggleDisplay(id);
    toggleBlur()
};

const toggleBlur = () => {
    const blurClass = "App-blur";
    const app = document.querySelector(".App");
    if (app.classList.contains(blurClass)) {
        app.classList.remove(blurClass);
    } else {
        app.className += " " + blurClass;
    }
};

const toggleFilter = () => {
    toggleDisplay('filter');
    let button = document.querySelector('.Filter-wrapper > .DemoShop-button');
    button.hasAttribute('pressed') ? button.removeAttribute('pressed') : button.setAttribute('pressed', '');
};