//constants
const mainNav = document.getElementById("mainNav")
const moveToTopBtn = document.getElementById("moveToTopBtn")

// events
window.onscroll = () => {
    y = window.scrollY
    fixNavOnScroll(y)
    fixFloatingButton(y)
}

moveToTopBtn.onclick = () => {
    document.body.scrollTop = 0
    document.documentElement.scrollTop = 0
}


//functions
const fixNavOnScroll = (sy) => {
    if(sy > mainNav.offsetTop)  {
        mainNav.classList.add("sticky-nav")
    } else {
        mainNav.classList.remove("sticky-nav")
    }
}

//functions
const fixFloatingButton= (sy) => {
    if(sy > mainNav.offsetTop)  {
        moveToTopBtn.classList.add("active-floating-btn")
    } else {
        moveToTopBtn.classList.remove("active-floating-btn")
    }
}