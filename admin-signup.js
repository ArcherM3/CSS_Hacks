document.getElementById("adminForm").addEventListener("submit", async function(e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let department = document.getElementById("department").value;
    let idVal = document.getElementById("id").value;
    let avatar = document.getElementById("avatar").files[0];

    let message = document.getElementById("message");

    if (name && email && password && department && idVal && avatar) {
        const fd = new FormData();
        fd.append("username", name);
        fd.append("email", email);
        fd.append("password", password);
        fd.append("department", department);
        fd.append("id", idVal);
        fd.append("avatar", avatar);

        try {
            const res = await fetch("https://web-wizards-backend.onrender.com/auth/signup/admin", {
                method: "POST",
                body: fd
            });
            if(res.ok) {
                message.style.color = "green";
                message.innerText = "Admin registered successfully!";
                setTimeout(() => {
                    window.location.href = "index.html?role=admin";
                }, 1000);
            } else {
                const data = await res.json();
                message.style.color = "red";
                message.innerText = data.detail || "Signup failed";
            }
        } catch (err) {
            message.style.color = "red";
            message.innerText = "Server error";
        }
    } else {
        message.style.color = "red";
        message.innerText = "Please fill all fields!";
    }
});
