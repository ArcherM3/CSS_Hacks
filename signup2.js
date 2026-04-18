// 1. Create the Hidden File Input
const fileInput = document.createElement("input");
fileInput.type = "file";
fileInput.accept = "image/*";
fileInput.style.display = "none";
document.body.appendChild(fileInput);

// 2. Select Buttons
const photoBtn = document.querySelector(".photo-btn");
const plusBtn = document.querySelector(".plus-btn");
const signUpBtn = document.querySelector(".signup-btn");

// 3. File Selection Logic
photoBtn.addEventListener("click", (e) => {
    e.preventDefault();
    fileInput.click();
});

plusBtn.addEventListener("click", (e) => {
    e.preventDefault();
    fileInput.click();
});

fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
        photoBtn.textContent = fileInput.files[0].name;
    }
});

// 4. Submit Logic
// 4. Submit Logic
signUpBtn.addEventListener("click", (e) => {
    e.preventDefault();

    // 1. Get values from HTML (Matches your name="username", etc.)
    const nameValue = document.querySelector('input[name="username"]').value;
    const emailValue = document.querySelector('input[name="college_email"]').value;
    const passValue = document.querySelector('input[name="password"]').value;
    const scholarValue = document.querySelector('input[name="sch_id"]').value;
    const file = fileInput.files[0];

    // 2. Validation: Backend REQUIRES an avatar
    if (!nameValue || !emailValue || !passValue || !scholarValue) {
        alert("Please fill in all text fields.");
        return;
    }

    if (!file) {
        alert("Please upload a photo. It is required for signup.");
        return;
    }

    // 3. Package data for FastAPI
    const formData = new FormData();
    formData.append("username", nameValue);
    formData.append("college_email", emailValue);
    formData.append("password", passValue);
    formData.append("sch_id", scholarValue);
    formData.append("avatar", file); // Must be 'avatar' to match Python

    // 4. Send to Server
    fetch("https://web-wizards-backend.onrender.com/auth/signup/student", {
        method: "POST",
        body: formData
    })
    .then(async response => {
        const data = await response.json();
        if (response.ok) {
            alert("Signup successful! Please login.");
            window.location.href = "login.html"; 
        } else {
            alert("Signup failed: " + (data.detail?.[0]?.msg || data.detail || "Unknown error"));
        }
    })
    .catch(error => {
        console.error("Fetch Error:", error);
        alert("Server error.");
    });
});