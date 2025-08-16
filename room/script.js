document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bookingForm");
  const grid = document.getElementById("cardGrid");
  const sortSelect = document.getElementById("sortPrice");

  // Tag original order for "Default" restore
  Array.from(grid.children).forEach((card, i) => card.dataset.index = i);

  // Fallback images if your files are missing
  const placeholderSVG = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'>
      <defs><linearGradient id='g' x1='0' x2='1'><stop stop-color='#e9ecef'/><stop offset='1' stop-color='#dee2e6'/></linearGradient></defs>
      <rect width='100%' height='100%' fill='url(#g)'/>
      <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
        font-family='Montserrat,Arial' font-size='24' fill='#6c757d'>Image coming soon</text>
    </svg>`
  );
  document.querySelectorAll(".room-img").forEach(img => {
    img.addEventListener("error", () => {
      img.src = `data:image/svg+xml;charset=utf-8,${placeholderSVG}`;
    }, { once: true });
  });

  // Load saved booking data
  const savedData = JSON.parse(localStorage.getItem("bookingData"));
  if (savedData) {
    document.getElementById("checkin").value = savedData.checkin || "";
    document.getElementById("checkout").value = savedData.checkout || "";
    document.getElementById("guests").value = savedData.guests || 1;
    document.getElementById("accessible").checked = !!savedData.accessible;
  }

  // Cookie consent slide-in
  const cookieBanner = document.getElementById("cookieConsent");
  if (!localStorage.getItem("cookiesAccepted")) {
    setTimeout(() => cookieBanner.classList.add("show"), 700);
  }
  document.getElementById("acceptCookies").addEventListener("click", () => {
    localStorage.setItem("cookiesAccepted", "true");
    cookieBanner.classList.remove("show");
  });

  // Helpers
  const nightsBetween = (inStr, outStr) => {
    const inDate = new Date(inStr), outDate = new Date(outStr);
    const ms = outDate - inDate;
    return Math.round(ms / (1000 * 60 * 60 * 24));
  };
  const money = (n) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  // Booking form logic
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const guests = parseInt(document.getElementById("guests").value, 10);
    const accessibleOnly = document.getElementById("accessible").checked;

    // Save preferences
    localStorage.setItem("bookingData", JSON.stringify({ checkin, checkout, guests, accessible: accessibleOnly }));

    // Validation
    if (!checkin || !checkout) return alert("Please select both check-in and check-out dates.");
    if (new Date(checkout) <= new Date(checkin)) return alert("Check-out date must be after check-in date.");
    if (guests < 1 || guests > 6) return alert("Guests must be between 1 and 6.");

    const nights = nightsBetween(checkin, checkout);
    if (nights < 1) return alert("Stay must be at least 1 night.");

    // Check availability + show estimated total
    document.querySelectorAll(".room-card").forEach(card => {
      const isAccessible = card.dataset.accessible === "true";
      const statusEl = card.querySelector(".availability-status");
      const price = parseFloat(card.dataset.price || "0");
      const title = card.dataset.title || "Room";

      if (accessibleOnly && !isAccessible) {
        statusEl.textContent = "Not wheelchair accessible ❌";
        statusEl.style.color = "red";
        return;
      }

      const available = Math.random() > 0.3; // simulate 70% availability
      if (available) {
        const total = price * nights;
        statusEl.textContent = `${title} available ✅ for ${guests} guest(s) • ${nights} night(s) • Est. total ${money(total)}`;
        statusEl.style.color = "green";
      } else {
        statusEl.textContent = "Fully booked ❌";
        statusEl.style.color = "red";
      }
    });
  });

  // Sort (with persistence)
  const applySort = (value) => {
    const cards = Array.from(grid.querySelectorAll(".room-card"));
    let sorted = [...cards];

    if (value === "low-high") {
      sorted.sort((a, b) => (+a.dataset.price) - (+b.dataset.price));
    } else if (value === "high-low") {
      sorted.sort((a, b) => (+b.dataset.price) - (+a.dataset.price));
    } else {
      // default (original DOM order)
      sorted.sort((a, b) => (+a.dataset.index) - (+b.dataset.index));
    }
    sorted.forEach(card => grid.appendChild(card));
  };

  // Load saved sort
  const savedSort = localStorage.getItem("sortPreference");
  if (savedSort) {
    sortSelect.value = savedSort;
    applySort(savedSort);
  }

  sortSelect.addEventListener("change", () => {
    const val = sortSelect.value;
    localStorage.setItem("sortPreference", val);
    applySort(val);
  });
});
