
document.body.classList.remove("nojs");

/* Меню навигации */

var mainNav = document.querySelector(".main-nav");

var mainNavOpen = mainNav.querySelector(".main-nav__btn--open");
var mainNavClose = mainNav.querySelector(".main-nav__btn--close");

function toggleMainNav() {
  mainNav.classList.toggle("main-nav--closed");
}

mainNavOpen.addEventListener("click", toggleMainNav);
mainNavClose.addEventListener("click", toggleMainNav);


/* Диалоговые окна */
var successDialog = document.querySelector(".modal-dialog--success");
var failureDialog = document.querySelector(".modal-dialog--failure");

function closeBtnOnClick(evt) {

  if (evt.target.classList.contains("modal-dialog__close-btn")) {
    evt.currentTarget.classList.remove("modal-dialog--show");
  }
}

if (successDialog) {
  successDialog.addEventListener("click", closeBtnOnClick);
}

if (failureDialog) {
  failureDialog.addEventListener("click", closeBtnOnClick);
}


/* Форма */
var contestForm = document.querySelector(".contest-form");


if (contestForm) {

  var contestFormSubmitBtn = contestForm.querySelector("input[type=submit]");

  contestFormSubmitBtn.addEventListener("click", function(evt) {
    evt.preventDefault();

    if (successDialog && contestForm.checkValidity()) {
      successDialog.classList.add("modal-dialog--show");
    }

    if (failureDialog && !contestForm.checkValidity()) {
      failureDialog.classList.add("modal-dialog--show");
    }
  });
}
