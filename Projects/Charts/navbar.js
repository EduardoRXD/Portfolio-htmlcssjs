let prevScrollPos = window.pageYOffset;

window.onscroll = function () {
    const currentScrollPos = window.pageYOffset;
    const navbar = document.querySelector("header .navbar");
    if (navbar.style.top == "") {navbar.style.top = 0}

    if (currentScrollPos < prevScrollPos) {
        navbar.style.top = `${Math.min(0, parseInt(navbar.style.top) + (prevScrollPos - currentScrollPos) / 3)}px`
    } else {
        navbar.style.top = `${Math.max(-80, parseInt(navbar.style.top) - (currentScrollPos - prevScrollPos) / 3)}px`
    }
    prevScrollPos = currentScrollPos;
};