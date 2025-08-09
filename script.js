
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
