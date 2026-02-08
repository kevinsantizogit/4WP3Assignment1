let map;
const landmarks = [];

function setMsg(text) {
	document.getElementById("msg").textContent = text;
}

function initMap() {
  const defaultCenter = [43.2557, -79.8711];

  map = L.map("map").setView(defaultCenter, 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);
}

initMap();
