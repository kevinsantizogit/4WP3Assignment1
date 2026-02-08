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

function setupLocationModeToggle() {
  const manualBox = document.getElementById("manualCoords");

  document.querySelectorAll('input[name="locMode"]').forEach((r) => {
    r.addEventListener("change", () => {
      const mode = getLocMode();
      manualBox.classList.toggle("hidden", mode !== "manual");
      setMsg("");
    });
  });
}

function getLocMode() {
  return document.querySelector('input[name="locMode"]:checked')?.value || "geo";
}

function getCoordsFromUserChoice()
{
  const mode = getLocMode();
  
  if (mode == "manual")
  {
    const lat = parseFloat(document.getElementById("lat").value);
    const lng = parseFloat(document.getElementById("lng").value);
    
    if (isNaN(lat) || isNaN(lng))
    {
      alert("Please enter valid latitude and longitude");
      return null;
    }
    
    if (lat < -90 || lat > 90)
    {
      alert("Latitude must be between -90 and 90");
      return null;
    }
    
    if (lng < -180 || lng > 180)
    {
      alert("Longitude must be between -180 and 180");
      return null;
    }
    
    return {lat: lat, lng: lng};
  }
  else
  {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const coords = {
          lat: position.coords.latitude, 
          lng: position.coords.longitude
        };
        saveLandmark(title, description, photoFile, coords.lat, coords.lng);
      },
      function(error) {
        alert("Could not get your location. Please use manual coordinates");
      }
    );
  }
}

setupAddButton();
setupPhotoPreview();
setupLocationModeToggle();
initMap();


