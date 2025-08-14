document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("bookingForm");

    // Load saved data from localStorage
    const savedData = JSON.parse(localStorage.getItem("bookingData"));
    if (savedData) {
        document.getElementById("checkin").value = savedData.checkin;
        document.getElementById("checkout").value = savedData.checkout;
        document.getElementById("guests").value = savedData.guests;
        document.getElementById("accessible").checked = savedData.accessible;
    }

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const checkin = document.getElementById("checkin").value;
        const checkout = document.getElementById("checkout").value;
        const guests = parseInt(document.getElementById("guests").value);
        const accessibleOnly = document.getElementById("accessible").checked;

        // Save to localStorage
        localStorage.setItem("bookingData", JSON.stringify({
            checkin, checkout, guests, accessible: accessibleOnly
        }));

        // Validate form
        if (!checkin || !checkout) {
            alert("Please select both check-in and check-out dates.");
            return;
        }
        if (new Date(checkout) <= new Date(checkin)) {
            alert("Check-out date must be after check-in date.");
            return;
        }
        if (guests < 1 || guests > 6) {
            alert("Number of guests must be between 1 and 6.");
            return;
        }

        // Check each room's availability
        document.querySelectorAll(".room-card").forEach(card => {
            const isAccessible = card.dataset.accessible === "true";
            const statusEl = card.querySelector(".availability-status");

            if (accessibleOnly && !isAccessible) {
                statusEl.textContent = "Not wheelchair accessible ❌";
                statusEl.style.color = "red";
                return;
            }

            // Simulate availability (could be replaced with API)
            const available = Math.random() > 0.3;
            if (available) {
                statusEl.textContent = `Available ✅ for ${guests} guest(s)`;
                statusEl.style.color = "green";
            } else {
                statusEl.textContent = "Fully booked ❌";
                statusEl.style.color = "red";
            }
        });
    });
});
