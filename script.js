// Save user's name in a cookie and personalize greeting
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  document.cookie = `username=${encodeURIComponent(name)}; path=/; max-age=604800`; // 7 days

  alert(`Thank you, ${name}. Your request has been received. Our concierge will be in touch shortly.`);
  this.reset();
});

// Display personalized greeting if cookie exists
window.addEventListener('DOMContentLoaded', () => {
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = decodeURIComponent(value);
    return acc;
  }, {});

  if (cookies.username) {
    const welcome = document.createElement('p');
    welcome.textContent = `Welcome back, ${cookies.username}. We're delighted to assist you again.`;
    welcome.style.fontStyle = 'italic';
    welcome.style.marginBottom = '20px';
    document.querySelector('.contact-section').prepend(welcome);
  }
});
