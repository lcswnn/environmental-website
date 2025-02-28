// JavaScript for Hamburger Menu
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger-menu');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', function() {
    // Toggle the 'active' class for the hamburger icon
    this.classList.toggle('active');
    
    // Toggle the 'show' class for the navigation menu
    navLinks.classList.toggle('show');
  });
  
  // Close the menu when clicking outside
  document.addEventListener('click', function(event) {
    const isClickInside = hamburger.contains(event.target) || navLinks.contains(event.target);
    
    if (!isClickInside && navLinks.classList.contains('show')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('show');
    }
  });
});