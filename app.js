let map;

window.initMap = function initMap() {
  const defaultCenter = { lat: 43.2557, lng: -79.8711 };

  map = new google.maps.Map(document.getElementById("map"), {
    center: defaultCenter,
    zoom: 13,
  });
};
