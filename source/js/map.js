function initMap() {
  var pink = {lat: 59.936062, lng: 30.321043};
  var center = {lat: 59.936379, lng: 30.321043};
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
