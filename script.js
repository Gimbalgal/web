
// Scroll Animation
const animatedElements = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, {
  threshold: 0.1
});

animatedElements.forEach(el => observer.observe(el));

// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.createElement('button');
  toggle.classList.add('menu-toggle');
  toggle.innerHTML = '&#9776;';
  document.querySelector('.navbar').prepend(toggle);

  const navLinks = document.querySelector('.nav-links');
  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('show');
  });
});

const newsletterForm = document.querySelector('.newsletter-form');

newsletterForm.addEventListener('submit', async (e) => {
  e.preventDefault(); // prevent page reload

  const email = newsletterForm.email.value;

  // Example first & last name placeholders
  const fName = "Subscriber";
  const lName = "";

  try {
    const response = await fetch('http://localhost:5000/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fName, lName, email })
    });

    const data = await response.json();
    alert(data.message); // success/failure message
    newsletterForm.reset(); // clear the input
  } catch (error) {
    alert("Something went wrong. Please try again.");
    console.error(error);
  }
});

