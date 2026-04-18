// Photo upload logic
const avatarInput = document.getElementById("avatarInput");
const photoBtn = document.getElementById("photoBtn");
const plusBtn = document.getElementById("plusBtn");

photoBtn.addEventListener("click", () => avatarInput.click());
plusBtn.addEventListener("click", () => avatarInput.click());

avatarInput.addEventListener("change", () => {
    if (avatarInput.files.length > 0) {
        photoBtn.textContent = avatarInput.files[0].name;
    }
});

document.getElementById("adminForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    let username = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let admin_id = document.getElementById("admin_id").value;
    let department = document.getElementById("department").value;
    let avatarFile = avatarInput.files[0];

    let message = document.getElementById("message");

    if (username && email && password && admin_id && department && avatarFile) {
        try {
            message.style.color = "blue";
            message.innerText = "Signing up...";

            const formData = new FormData();
            formData.append("username", username);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("id", admin_id); 
            formData.append("department", department);
            formData.append("avatar", avatarFile); 

            let response = await fetch("https://web-wizards-backend.onrender.com/auth/signup/admin", {
                method: "POST",
                body: formData 
            });

            let data = await response.json();

            if (response.ok) {
                message.style.color = "green";
                message.innerText = data.message || "Success!";
                alert("Admin registration successful! Redirecting to login...");
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1500);
            } else {
                message.style.color = "red";
                message.innerText = data.detail?.[0]?.msg || data.detail || "Submission failed";
                console.error("Signup failed:", data);
            }

        } catch (error) {
            message.style.color = "red";
            message.innerText = "Server error!";
            console.error(error);
        }
    } else {
        message.style.color = "red";
        message.innerText = !avatarFile ? "Please upload a photo!" : "Please fill all fields!";
    }
});