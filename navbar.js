function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
}

function getCookie(name) {
    const cname = name + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(cname) === 0) {
            return cookie.substring(cname.length);
        }
    }
    return "";
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Rooms & Suites page loaded");

    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (menuToggle && navLinks) {
        // ✅ Restore menu state from cookie
        if (getCookie("menuState") === "open") {
            navLinks.classList.add("show"); // ← This was missing!
        }

        // ✅ Toggle menu and save state
        menuToggle.addEventListener("click", () => {
            navLinks.classList.toggle("show");
            const state = navLinks.classList.contains("show") ? "open" : "closed";
            setCookie("menuState", state, 7);
        });
    }
});