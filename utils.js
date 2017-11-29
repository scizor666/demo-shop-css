var toggleDisplay = function (id) {
    var element = document.getElementById(id);
    if (element.style.display === "none") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
};

var togglePopup = function (id) {
    toggleDisplay(id);
    toggleBlur()
};

var toggleBlur = function () {
    var blurClass = "App-blur";
    var app = document.querySelector(".App");
    if (app.classList.contains(blurClass)) {
        app.classList.remove(blurClass);
    } else {
        app.className += " " + blurClass;
    }
};