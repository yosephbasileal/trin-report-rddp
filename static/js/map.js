function initMap() {
  var trinity = {lat: 41.7470945, lng: -72.6905035};
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: trinity
  });
  var marker = new google.maps.Marker({
    position: trinity,
    map: map
  });
}