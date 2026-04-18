// Select elements
const photoBtn = document.querySelector(".photo-btn");
const plusBtn = document.querySelector(".plus-btn");

// Create hidden file input
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "image/*";
fileInput.style.display = "none";
document.body.appendChild(fileInput);

// When Photo or + is clicked → open file picker
photoBtn.addEventListener("click", () => {
    fileInput.click();
});

plusBtn.addEventListener("click", () => {
    fileInput.click();
});

// Handle file selection
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];

    if (file) {
        // Show selected file name (or you can preview image)
        photoBtn.textContent = file.name;

        // Optional: preview image
        const reader = new FileReader();
        reader.onload = function (e) {
            photoBtn.style.backgroundImage = `url(${e.target.result})`;
            photoBtn.style.backgroundSize = "cover";
            photoBtn.style.backgroundPosition = "center";
            photoBtn.textContent = "";
        };
        reader.readAsDataURL(file);
    }
});


const adminLink = document.querySelector(".admin-link");

adminLink.addEventListener("click", () => {
    window.location.href = "admin-signup.html";
});
const signupBtn = document.querySelector(".signup-btn");

signupBtn.addEventListener("click", function() {
    localStorage.setItem("loggedIn", "true");
    window.location.href = "home_page.html";
});