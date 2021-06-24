function initMap() {
  const pink = {lat: 59.936062, lng: 30.321043};
  const center = {lat: 59.936379, lng: 30.321043};
  const map = new google.maps.Map(document.querySelector('.contacts__map-google'), {
    zoom: 16,
    center: center
  });
  const marker = new google.maps.Marker({
    position: pink,
    map: map,
    icon: 'img/icon-map-marker.svg'
  });
}
