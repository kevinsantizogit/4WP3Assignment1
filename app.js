let map;
const landmarks = [];

function setMsg(text) {
  document.getElementById("msg").textContent = text;
}

function initMap() {
  const defaultCenter = [43.6426, -79.3871];

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

function addLandmarkToMap(landmark) {
  const marker = L.marker([landmark.lat, landmark.lng]).addTo(map);

  marker.on("click", () => {
    highlightInList(landmark.id);

    marker
      .bindPopup(`
        <strong>${escapeHtml(landmark.title)}</strong><br>
        ${escapeHtml(landmark.description)}<br>
        <img src="${landmark.imageUrl}" style="width:100%;margin-top:6px;border-radius:8px;">
      `)
      .openPopup();
  });

  landmark.marker = marker;
}

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[c]));
}

function setupAddButton() {
  const btn = document.getElementById("addLandmark");

  btn.addEventListener("click", async () => {
    setMsg("");

    const titleInput = document.getElementById("title");
    const descInput = document.getElementById("description");
    const photoInput = document.getElementById("photo");
    const preview = document.getElementById("photoPreview");

    const title = titleInput.value.trim();
    const description = descInput.value.trim();
    const file = photoInput.files[0];

    if (!title) return setMsg("Title is required.");
    if (!description) return setMsg("Description is required.");
    if (!file) return setMsg("Please upload a photo.");
    if (!file.type.startsWith("image/")) return setMsg("Photo must be an image file.");

    const imageUrl = URL.createObjectURL(file);

    let coords;
    try {
      coords = await getCoordsFromUserChoice();
    } catch (err) {
      return setMsg(err.message || "Could not get location.");
    }

    const landmark = {
      id: Date.now(),
      title,
      description,
      imageUrl,
      lat: coords.lat,
      lng: coords.lng,
      marker: null,
      hidden: false
    };

    addLandmarkToMap(landmark);
    landmarks.push(landmark);
    renderList();

    setMsg("Landmark added to map.");

    titleInput.value = "";
    descInput.value = "";
    photoInput.value = "";
    preview.style.display = "none";
    preview.src = "";
    document.getElementById("manualCoords").classList.add("hidden");
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

function getCoordsFromUserChoice() {
  const mode = document.querySelector('input[name="locMode"]:checked')?.value || "geo";

  if (mode === "manual") {
    const lat = Number(document.getElementById("lat").value);
    const lng = Number(document.getElementById("lng").value);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new Error("Enter valid latitude and longitude.");
    }
    if (lat < -90 || lat > 90) throw new Error("Latitude must be between -90 and 90.");
    if (lng < -180 || lng > 180) throw new Error("Longitude must be between -180 and 180.");

    return Promise.resolve({ lat, lng });
  }

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error("Geolocation not supported."));

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => reject(new Error("Geolocation denied or unavailable.")),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });
}

function renderList() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  for (const lm of landmarks) {
    const item = document.createElement("div");
    item.className = "item";
    item.dataset.id = lm.id;

    item.innerHTML = `
      <strong>${escapeHtml(lm.title)}</strong>
      <div>${escapeHtml(lm.description)}</div>
      <img class="thumb" src="${lm.imageUrl}" alt="thumbnail">
      <div class="row">
        <button type="button" data-action="focus">Focus</button>
        <button type="button" data-action="toggle">${lm.hidden ? "Show" : "Hide"}</button>
        <button type="button" data-action="delete">Delete</button>
      </div>
    `;

    item.addEventListener("click", (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;

      const action = btn.dataset.action;

      if (action === "focus") {
        map.setView([lm.lat, lm.lng], 16);
        lm.marker.openPopup();
        highlightInList(lm.id);
      }

      if (action === "toggle") {
        lm.hidden = !lm.hidden;
        if (lm.hidden) {
          map.removeLayer(lm.marker);
        } else {
          lm.marker.addTo(map);
        }
        renderList();
        highlightInList(lm.id);
      }

      if (action === "delete") {
        deleteLandmark(lm.id);
      }
    });

    list.appendChild(item);
  }
}

function deleteLandmark(id) {
  const idx = landmarks.findIndex(x => x.id === id);
  if (idx === -1) return;

  const lm = landmarks[idx];
  if (lm.marker) map.removeLayer(lm.marker);

}

function highlightInList(id) {
  document.querySelectorAll(".item").forEach(el => {
    el.classList.toggle("active", Number(el.dataset.id) === id);
  });
}

setupAddButton();
setupPhotoPreview();
setupLocationModeToggle();
initMap();
