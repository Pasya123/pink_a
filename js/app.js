
document.body.classList.remove("nojs");


var mainNav = document.querySelector(".main-nav");

var mainNavOpen = mainNav.querySelector(".main-nav__btn--open");
var mainNavClose = mainNav.querySelector(".main-nav__btn--close");

function toggleMainNav() {
  mainNav.classList.toggle("main-nav--closed");
}

mainNavOpen.addEventListener("click", toggleMainNav);
mainNavClose.addEventListener("click", toggleMainNav);
