const toggleDisplay = id => {
    const element = document.getElementById(id);
    if (element.style.display === "none") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
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