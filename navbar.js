/**
 * navbar.js
 * Handles navbar state, authentication checks, and dynamic profile icon updates.
 */

document.addEventListener("DOMContentLoaded", () => {
    initNavbar();
});

function initNavbar() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const role = localStorage.getItem("role");
    const avatar = localStorage.getItem("avatar");

    const authSection = document.getElementById("auth-section");
    const profileSection = document.getElementById("profile-section");
    const profileIconImg = document.getElementById("profile-icon-img");
    const profileLink = document.getElementById("profile-link");

    // Check if we are on the home page to set transparency
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        if (window.location.pathname.includes("home_page.html") || window.location.pathname === "/" || window.location.pathname.endsWith("CampusResolve/")) {
            navbar.classList.add("transparent");
        } else {
            navbar.classList.add("solid");
        }
    }

    // Update active link based on current page
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".nav-links a");
    navLinks.forEach(link => {
        if (currentPath.includes(link.getAttribute("href"))) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

    if (isLoggedIn) {
        if (authSection) authSection.style.display = "none";
        if (profileSection) {
            profileSection.style.display = "flex";
            if (profileIconImg && avatar) {
                // Ensure avatar path is correct (relative or absolute)
                profileIconImg.src = avatar.startsWith("http") ? avatar : `https://web-wizards-backend.onrender.com${avatar}`;
            }
            if (profileLink) {
                profileLink.href = role === "admin" ? "admin-profile.html" : "stud-profile.html";
            }
        }
    } else {
        if (authSection) authSection.style.display = "flex";
        if (profileSection) profileSection.style.display = "none";
    }
}

// Global logout function
window.logout = function() {
    localStorage.clear();
    window.location.href = "home_page.html";
};
