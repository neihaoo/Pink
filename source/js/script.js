// Menu
var navJs = document.querySelector('.nav');
var navToggle = document.querySelector('.nav__toggle');

navJs.classList.remove('nojs');
navJs.classList.replace('nav--opened', 'nav--closed');

navToggle.addEventListener('click', function() {
  if (nav.classList.contains('nav--closed')) {
    nav.classList.remove('nav--closed');
    nav.classList.add('nav--opened');
  } else {
    nav.classList.add('nav--closed');
    nav.classList.remove('nav--opened');
  }
});

// Tabs
// Reviews slider
// Price slider
// Map
