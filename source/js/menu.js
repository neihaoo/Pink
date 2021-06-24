const navJs = document.querySelector('.nav');
const navToggle = document.querySelector('.nav__toggle');

navJs.classList.remove('nojs');
navJs.classList.replace('nav--opened', 'nav--closed');

navToggle.addEventListener('click', function() {
  if (navJs.classList.contains('nav--closed')) {
    navJs.classList.remove('nav--closed');
    navJs.classList.add('nav--opened');
  } else {
    navJs.classList.add('nav--closed');
    navJs.classList.remove('nav--opened');
  }
});
