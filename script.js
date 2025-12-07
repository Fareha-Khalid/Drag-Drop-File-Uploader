const dropArea = document.getElementById("drop-area");
const fileInput = document.getElementById("file-input");
const preview = document.getElementById("preview");
const progressBox = document.querySelector(".progress-box");
const progressBar = document.getElementById("progress-bar");
const errorMsg = document.getElementById("error-msg");

// ----------------- DRAG EVENTS -----------------
dropArea.addEventListener("dragover", (event) => {
  event.preventDefault();
  dropArea.style.backgroundColor = "#e8e8ff";
});

dropArea.addEventListener("dragleave", () => {
  dropArea.style.backgroundColor = "white";
});

dropArea.addEventListener("drop", (event) => {
  event.preventDefault();
  dropArea.style.backgroundColor = "white";
  const file = event.dataTransfer.files[0];
  handleFile(file);
});

// ------------- MANUAL SELECT ---------------
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  handleFile(file);
});

// ------------- HANDLE FILE ------------------
function handleFile(file) {
  errorMsg.textContent = "";

  if (!file || !file.type.startsWith("image/")) {
    errorMsg.textContent = "❌ Only image files allowed (JPG, PNG, GIF)";
    return;
  }

  dropArea.classList.add("hidden");  // FIXED

  const reader = new FileReader();
  reader.onload = function (e) {
    preview.src = e.target.result;
    preview.style.display = "block";

    updateBackgroundGradient(preview);
  };
  reader.readAsDataURL(file);

  simulateUpload();
}

// ------------- SIMULATE UPLOAD --------------
function simulateUpload() {
  progressBox.style.display = "block";

  let width = 0;
  let interval = setInterval(() => {
    width += 10;
    progressBar.style.width = width + "%";

    if (width >= 100) {
      clearInterval(interval);
    }
  }, 200);
}

// ------------- DYNAMIC BACKGROUND COLOR --------------
function updateBackgroundGradient(imageElement) {
  const colorThief = new ColorThief();

  if (imageElement.complete) {
    applyGradient();
  } else {
    imageElement.addEventListener("load", applyGradient);
  }

  function applyGradient() {
    const colors = colorThief.getPalette(imageElement, 2);
    const color1 = `rgb(${colors[0][0]}, ${colors[0][1]}, ${colors[0][2]})`;
    const color2 = `rgb(${colors[1][0]}, ${colors[1][1]}, ${colors[1][2]})`;

    document.body.style.background =
      `linear-gradient(135deg, ${color1}, ${color2})`;
  }
}
