document.addEventListener("DOMContentLoaded", () => {
    console.log("Home page loaded");
});

 const cookieConsent = document.getElementById('cookie-consent');
    const acceptBtn = document.getElementById('accept-cookie');
    const rejectBtn = document.getElementById('reject-cookie');

     // Check if user already made a choice
    if (localStorage.getItem('cookieConsent')) {
        cookieConsent.style.display = 'none';
    } else {
        cookieConsent.style.display = 'flex'; // Or 'block'
    }

    // Accept cookies
    acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookieConsent', 'accepted');
        cookieConsent.style.display = 'none';
    });

    // Reject cookies
rejectBtn.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'rejected');
    cookieConsent.style.display = 'none';
});
