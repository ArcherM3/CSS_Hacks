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
    let phone = document.getElementById("phone").value;
    let department = document.getElementById("department").value;
    let avatarFile = avatarInput.files[0];

    let message = document.getElementById("message");

    // Constraints
    const nameRegex = /^[A-Za-z ]+$/;
    const phoneRegex = /^\d{10}$/;

    if (!username || !email || !password || !admin_id || !phone || !department) {
        message.style.color = "red";
        message.innerText = "Please fill all fields!";
        return;
    }

    if (!nameRegex.test(username)) {
        message.style.color = "red";
        message.innerText = "Name should only contain letters!";
        return;
    }
});
