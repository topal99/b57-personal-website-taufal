document.addEventListener('DOMContentLoaded', function() {
  const menuToggleButton = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  menuToggleButton.addEventListener('click', function() {
    if (mobileMenu.classList.contains('mobile-menu-active')) {
      mobileMenu.classList.remove('mobile-menu-active');
    } else {
      mobileMenu.classList.add('mobile-menu-active');
    }
  });
});

class Testimonial {
  constructor(name, profession, rating, message, imageUrl) {
    this.name = name;
    this.profession = profession;
    this.rating = rating;
    this.message = message;
    this.imageUrl = imageUrl;
  }

  createTestimonialElement() {
    const container = document.createElement('div');
    container.className = 'testimonial';

    const image = document.createElement('img');
    image.src = this.imageUrl;
    image.alt = this.name;
    container.appendChild(image);

    const content = document.createElement('div');
    content.className = 'testimonial-content';

    const nameElement = document.createElement('h3');
    nameElement.textContent = this.name;
    content.appendChild(nameElement);

    const professionElement = document.createElement('p');
    professionElement.innerHTML = `<strong>${this.profession}</strong>`;
    content.appendChild(professionElement);

    const stars = document.createElement('div');
    stars.className = 'stars';
    for (let i = 0; i < 5; i++) {
      const star = document.createElement('i');
      star.className = i < Math.floor(this.rating) ? 'fa fa-star' : 'fa fa-star-o';
      stars.appendChild(star);
    }
    content.appendChild(stars);

    const messageElement = document.createElement('p');
    messageElement.textContent = this.message;
    content.appendChild(messageElement);

    container.appendChild(content);

    return container;
  }
}

// Function to fetch testimonials data from external API
async function fetchTestimonials() {
  try {
    const response = await fetch('https://api.npoint.io/abd2b6c91c59bc2964cc'); // Ganti dengan URL API npoint.io
    if (!response.ok) {
      throw new Error('Failed to fetch testimonials');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return []; // Return empty array if there's an error
  }
}

// Function to render testimonials (clear previous content first)
async function renderTestimonials() {
  const container = document.querySelector('.testimonials-container');
  container.innerHTML = '';  // Clear previous testimonials
  const testimonialsData = await fetchTestimonials(); // Fetch testimonials data from API

  testimonialsData.forEach(item => {
    const testimonial = new Testimonial(item.name, item.profession, item.rating, item.message, item.imageUrl);
    container.appendChild(testimonial.createTestimonialElement()); // Append new testimonials
  });
}

// Function to create rating filter stars with numbers
function createRatingFilterStars() {
  const starsFilter = document.getElementById('stars-filter');
  starsFilter.innerHTML = ''; // Clear existing stars
  
  // Add 'All' option to show all testimonials
  const allRating = document.createElement('span');
  allRating.textContent = 'All';
  allRating.className = 'all-rating';
  allRating.addEventListener('click', () => {
    renderTestimonials();  // Render all testimonials
  });
  starsFilter.appendChild(allRating);

  // Create filter stars from 1 to 5 with numbers on the left
  for (let i = 1; i <= 5; i++) {
    const filterItem = document.createElement('span'); // Wrapper for star and number
    filterItem.className = 'filter-item';

    const ratingNumber = document.createElement('span'); // Number on the left of star
    ratingNumber.textContent = i;
    ratingNumber.className = 'rating-number';

    const star = document.createElement('i');
    star.className = 'fa fa-star';
    star.dataset.rating = i;
    star.addEventListener('click', () => {
      applyFilters(i); // Call filter function on click
    });

    filterItem.appendChild(ratingNumber); // Append number first (left)
    filterItem.appendChild(star);        // Append star next (right)

    starsFilter.appendChild(filterItem); // Append the whole filter item (number + star)
  }
}

// Higher-Order Function for filtering testimonials
function filterTestimonials(testimonials, filterFn) {
  return testimonials.filter(filterFn); // `filterFn` is a callback passed in
}

// Callback function to filter by exact rating
function filterByRating(rating) {
  return function(testimonial) {
    return Math.floor(testimonial.rating) === rating; // Only show testimonials with exact rating
  };
}

// Function to apply filters by rating
async function applyFilters(ratingValue) {
  const testimonialsData = await fetchTestimonials(); // Fetch testimonials data from API
  const filteredData = filterTestimonials(testimonialsData, filterByRating(ratingValue));
  renderFilteredTestimonials(filteredData); // Render filtered testimonials
}

// Function to render filtered testimonials
function renderFilteredTestimonials(data) {
  const container = document.querySelector('.testimonials-container');
  container.innerHTML = '';  // Clear previous testimonials
  data.forEach(item => {
    const testimonial = new Testimonial(item.name, item.profession, item.rating, item.message, item.imageUrl);
    container.appendChild(testimonial.createTestimonialElement()); // Append new testimonials
  });
}

// Event listener to initialize the page
document.addEventListener('DOMContentLoaded', () => {
  renderTestimonials(); // Render all testimonials initially
  createRatingFilterStars(); // Create filter stars
});
