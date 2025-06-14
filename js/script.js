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

function openModal(img) {
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const modalTitle = document.getElementById("modalTitle");
  const modalDescription = document.getElementById("modalDescription");
  const modalCredit = document.getElementById("modalCredit");

  modal.style.display = "block";
  modalImg.src = img.src;
  modalImg.alt = img.alt;
  modalTitle.textContent = img.getAttribute("data-title");
  modalDescription.textContent = img.getAttribute("data-description");
  modalCredit.innerHTML = img.getAttribute("data-credit");

  document.body.style.overflow = "hidden";
}

function closeModal(event) {
  if (
    !event ||
    event.target.classList.contains("modal") ||
    event.target.classList.contains("close")
  ) {
    const modal = document.getElementById("imageModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeModal();
  }
});

// maps api
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 4,
    center: { lat: 40.12150192260742, lng: -100.45039367675781 },
  });
  
  new google.maps.Marker({
    position: { lat: 40.12150192260742, lng: -100.45039367675781 },
    map: map,
    title: "My location"
  });
}

// Initialize map when page loads
window.onload = function() {
  if (typeof google !== 'undefined' && google.maps) {
    initMap();
  }
};
