const faders = document.querySelectorAll(".fade-in");

// JavaScript for Hamburger Menu
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.querySelector(".hamburger-menu");
  const navMenu = document.querySelector("#nav-menu");

  hamburger.addEventListener("click", function () {
    // Toggle the 'active' class for the hamburger icon
    this.classList.toggle("active");

    // Toggle the 'show' class for the navigation menu
    navMenu.classList.toggle("show");
  });

  // Close the menu when clicking outside
  document.addEventListener("click", function (event) {
    const isClickInside =
      hamburger.contains(event.target) || navMenu.contains(event.target);

    if (!isClickInside && navMenu.classList.contains("show")) {
      hamburger.classList.remove("active");
      navMenu.classList.remove("show");
    }
  });

  // Fix for fade-in effect
  const appearOptions = {
    threshold: 0.1,
  };

  const appearOnScroll = new IntersectionObserver(function (
    entries,
    appearOnScroll
  ) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      } else {
        entry.target.classList.add("appear");
        appearOnScroll.unobserve(entry.target);
      }
    });
  },
  appearOptions);

  faders.forEach((fader) => {
    appearOnScroll.observe(fader);
  });
});
