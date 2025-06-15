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

// Find opportunites near by
let currentPage = 1;
let totalResults = 0;
let currentLocation = "";

async function findOpportunities(pageUrl = null) {
  const location = document.getElementById("location-input").value;

  if (!pageUrl) {
    currentLocation = location;
    currentPage = 1;
  }

  try {
    const url =
      pageUrl ||
      `https://www.volunteerconnector.org/api/search/?pc=${location}&md=&so=Proximity&se=`;

    const response = await fetch(url, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const resultsContainer = document.getElementById("results");

    totalResults = data.count;

    if (data.results.length === 0) {
      resultsContainer.innerHTML = "<p>No opportunities found.</p>";
      return;
    }

    // Display results count
    displayResultsInfo(data);

    // Display opportunities
    displayOpportunities(data.results);

    // Display pagination controls
    displayPaginationControls(data);
  } catch (error) {
    console.error("Error fetching opportunities:", error);
    const resultsContainer = document.getElementById("results");
    resultsContainer.innerHTML =
      "<p>Error fetching opportunities. Please try again later.</p>";
  }
}

function displayResultsInfo(data) {
  const resultsContainer = document.getElementById("results");

  // Remove existing results info if it exists
  const existingInfo = document.getElementById("results-info");
  if (existingInfo) {
    existingInfo.remove();
  }

  const resultsInfo = document.createElement("div");
  resultsInfo.id = "results-info";
  resultsInfo.className = "results-info";
  resultsInfo.innerHTML = `
    <p><strong>Found ${data.count} opportunities for "${currentLocation}"</strong></p>
  `;

  resultsContainer.appendChild(resultsInfo);
}

function displayOpportunities(opportunities) {
  const resultsContainer = document.getElementById("results");
  const existingOpportunities = document.querySelectorAll(".opportunity");

  existingOpportunities.forEach((opp) => opp.remove());
  opportunities.forEach((opportunity) => {
    const opportunityElement = document.createElement("div");
    opportunityElement.className = "opportunity";
    opportunityElement.innerHTML = `
      <h3>${opportunity.title}</h3>
      <p><strong>Organization:</strong> ${opportunity.organization.name}</p>
      <p><strong>Duration:</strong> ${
        opportunity.duration || "Not specified"
      }</p>
      <p><strong>Dates:</strong> ${opportunity.dates || "Not specified"}</p>
      <a href="${opportunity.url}" target="_blank">Learn More</a>
    `;
    resultsContainer.appendChild(opportunityElement);
  });
}

function displayPaginationControls(data) {
  const resultsContainer = document.getElementById("results");

  const existingPagination = document.getElementById("pagination");
  if (existingPagination) {
    existingPagination.remove();
  }

  if (!data.next && !data.previous) {
    return;
  }

  const paginationContainer = document.createElement("div");
  paginationContainer.id = "pagination";
  paginationContainer.className = "pagination";

  let paginationHTML = '<div class="pagination-controls">';

  if (data.previous) {
    paginationHTML += `<button class="pagination-btn" onclick="loadPage('${
      data.previous
    }', ${currentPage - 1})">Previous</button>`;
  } else {
    paginationHTML += `<button class="pagination-btn disabled" disabled>Previous</button>`;
  }
  paginationHTML += `<span class="page-info">Page ${currentPage}</span>`;
  if (data.next) {
    paginationHTML += `<button class="pagination-btn" onclick="loadPage('${
      data.next
    }', ${currentPage + 1})">Next</button>`;
  } else {
    paginationHTML += `<button class="pagination-btn disabled" disabled>Next</button>`;
  }

  paginationHTML += "</div>";
  paginationContainer.innerHTML = paginationHTML;
  resultsContainer.appendChild(paginationContainer);
}

function loadPage(pageUrl, pageNumber) {
  currentPage = pageNumber;
  findOpportunities(pageUrl);
  document.getElementById("results").scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

document
  .getElementById("search-button")
  .addEventListener("click", () => findOpportunities());

document
  .getElementById("location-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      findOpportunities();
    }
  });
