// Menu
var navJs = document.querySelector('.nav');
var navToggle = document.querySelector('.nav__toggle');

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

// Tabs
// Reviews slider
// Price slider
// Map
function initMap() {
  var pink = {lat: 59.936162, lng: 30.321043};
  var center = {lat: 59.936162, lng: 30.321043};
  var map = new google.maps.Map(document.querySelector('.contacts__map-google'), {
    zoom: 16,
    center: center
  });
  var marker = new google.maps.Marker({
    position: pink,
    map: map,
    icon: 'img/icon-map-marker.svg'
  });
}