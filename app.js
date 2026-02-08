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

function setupPhotoPreview() {
  const photoInput = document.getElementById("photo");
  const preview = document.getElementById("photoPreview");

  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];

    if (!file) {
      preview.style.display = "none";
      preview.src = "";
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMsg("Please choose an image file.");
      photoInput.value = "";
      preview.style.display = "none";
      preview.src = "";
      return;
    }

    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
    setMsg("");
  });
}
setupPhotoPreview();

initMap();
