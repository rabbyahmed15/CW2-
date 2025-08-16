// Room Data
const rooms = [
  { name: "Deluxe Room", price: 180, image: "images/deluxe-room.jpg" },
  { name: "Standard Room", price: 140, image: "images/standard-room.jpg" },
  { name: "Presidential Suite", price: 350, image: "images/presidential-suite.jpg" },
  { name: "Executive Suite", price: 280, image: "images/executive-suite.jpg" }
];

const roomList = document.getElementById("roomList");
const bookingList = document.getElementById("bookingList");

let bookings = JSON.parse(localStorage.getItem("bookings")) || [];

// Display Rooms
function displayRooms() {
  roomList.innerHTML = "";
  rooms.forEach((room, index) => {
    const card = document.createElement("div");
    card.className = "room-card";
    card.innerHTML = `
      <img src="${room.image}" alt="${room.name}">
      <div class="room-info">
        <h3>${room.name}</h3>
        <p class="price">$${room.price}/night</p>
        <button class="book-now" data-index="${index}">Book Now</button>
      </div>
    `;
    roomList.appendChild(card);
  });
}

// Display Bookings
function displayBookings() {
  bookingList.innerHTML = "";
  if (bookings.length === 0) {
    bookingList.innerHTML = "<li>No bookings yet.</li>";
    return;
  }
  bookings.forEach((booking, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${booking.room}</strong> - ${booking.name}, ${booking.checkin} to ${booking.checkout} (${booking.guests} guests)</span>
      <button class="cancel-btn" data-index="${i}">Cancel</button>
    `;
    bookingList.appendChild(li);
  });
}

// Handle Booking Modal
const modal = document.getElementById("bookingModal");
const closeBtn = document.querySelector(".close-btn");
const bookingForm = document.getElementById("bookingForm");
const selectedRoomInput = document.getElementById("selectedRoom");

function openBookingForm(room) {
  selectedRoomInput.value = room.name;
  modal.style.display = "flex";
}
closeBtn.onclick = () => (modal.style.display = "none");
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

// Handle Book Now Button
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("book-now")) {
    const roomIndex = e.target.getAttribute("data-index");
    openBookingForm(rooms[roomIndex]);
  }
});

// Handle Form Submit
bookingForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const booking = {
    room: selectedRoomInput.value,
    name: bookingForm.name.value,
    email: bookingForm.email.value,
    phone: bookingForm.phone.value,
    checkin: bookingForm.checkin.value,
    checkout: bookingForm.checkout.value,
    guests: bookingForm.guests.value
  };
  bookings.push(booking);
  localStorage.setItem("bookings", JSON.stringify(bookings));
  displayBookings();
  modal.style.display = "none";
  bookingForm.reset();
});

// Cancel Booking
bookingList.addEventListener("click", (e) => {
  if (e.target.classList.contains("cancel-btn")) {
    const i = e.target.getAttribute("data-index");
    bookings.splice(i, 1);
    localStorage.setItem("bookings", JSON.stringify(bookings));
    displayBookings();
  }
});

// Responsive Menu Toggle
document.querySelector(".menu-toggle").addEventListener("click", () => {
  document.querySelector("nav ul").classList.toggle("show");
});

// Initial Load
displayRooms();
displayBookings();

// Preselect room from URL
const params = new URLSearchParams(window.location.search);
const roomParam = params.get("room");
if (roomParam) {
  const matchedRoom = rooms.find(r => r.name.toLowerCase() === roomParam.toLowerCase());
  if (matchedRoom) openBookingForm(matchedRoom);
}
