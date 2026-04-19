// Select elements
const photoBtn = document.getElementById("photoBtn");
const plusBtn = document.getElementById("plusBtn");

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

const adminLink = document.getElementById("adminLink");
adminLink.addEventListener("click", () => {
    window.location.href = "admin-signup.html";
});
const signupBtn = document.querySelector(".signup-btn");

signupBtn.addEventListener("click", async function() {

const signupBtn = document.getElementById("signupBtn");
signupBtn.addEventListener("click", async function(e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const college_email = document.getElementById("college_email").value;
    const password = document.getElementById("password").value;
    const sch_id = document.getElementById("sch_id").value;
    const file = fileInput.files[0];

    if (!username || !college_email || !password || !sch_id || !file) {
        alert("Please fill all fields and attach an avatar");
        return;
    }

    const fd = new FormData();
    fd.append("username", username);
    fd.append("college_email", college_email);
    fd.append("password", password);
    fd.append("sch_id", sch_id);
    fd.append("avatar", file);

    try {
        const res = await fetch("https://web-wizards-backend.onrender.com/auth/signup/student", {
            method: "POST",
            body: fd
        });
        if (res.ok) {
            alert("Signup successful! Please login.");
            window.location.href = "index.html?role=student";
        } else {
            const data = await res.json();
            alert(data.detail || "Signup failed");
        }
    } catch(e) {
        alert("Error connecting to server");
        console.error(e);
    }
});
    const message = document.getElementById("message");

    // Ensure all required fields are filled
    if (!username || !college_email || !password || !sch_id) {
        message.style.color = "red";
        message.innerText = "Please fill all fields!";
        return;
    }

    try {
        // Construct FormData for multipart/form-data as expected by the backend
        const formData = new FormData();
        formData.append("username", username);
        formData.append("college_email", college_email);
        formData.append("password", password);
        formData.append("sch_id", sch_id);
        
        // Append selected file or a dummy file if not selected
        if (fileInput.files[0]) {
            formData.append("avatar", fileInput.files[0]);
        } else {
            formData.append("avatar", new Blob([]), "placeholder.png");
        }

        // Send POST request to backend
        const response = await fetch("https://web-wizards-backend.onrender.com/auth/signup/student", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            message.style.color = "green";
            message.innerText = data.message || "Registration successful!";
            // Redirect to login page
            setTimeout(() => {
                window.location.href = "login.html";
            }, 1000);
        } else {
            message.style.color = "red";
            message.innerText = data.detail || "Registration failed";
        }
    } catch (error) {
        console.error(error);
        message.style.color = "red";
        message.innerText = "Server error!";
    }
});
