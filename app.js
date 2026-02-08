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
function setupAddButton() {
  const btn = document.getElementById("addLandmark");

  btn.addEventListener("click", () => {
    setMsg("");

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const file = document.getElementById("photo").files[0];

    if (!title) return setMsg("Title is required.");
    if (!description) return setMsg("Description is required.");
    if (!file) return setMsg("Please upload a photo.");

    const imageUrl = URL.createObjectURL(file);

    const landmark = {
      id: Date.now(),
      title,
      description,
      imageUrl

    };

    landmarks.push(landmark);

    console.log("Saved landmark:", landmark);
    setMsg("Landmark saved (no marker yet).");


    document.getElementById("title").value = "";
    document.getElementById("description").value = "";
    document.getElementById("photo").value = "";
    const preview = document.getElementById("photoPreview");
    preview.style.display = "none";
    preview.src = "";
  });
}

setupAddButton();
setupPhotoPreview();
initMap();

