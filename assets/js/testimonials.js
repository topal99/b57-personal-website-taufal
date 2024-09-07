// assets/js/testimonials.js

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
  
  // Dummy data
  const testimonialsData = [
    {
      "name": "John Doe",
      "profession": "Software Engineer",
      "rating": 4.5,
      "message": "Great service! The team was professional, and the project was delivered on time. I’m really happy with the results.",
      "imageUrl": "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      "name": "Jane Smith",
      "profession": "Product Manager",
      "rating": 5,
      "message": "I was impressed with the level of expertise and attention to detail. The communication was excellent throughout the project.",
      "imageUrl": "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      "name": "Michael Brown",
      "profession": "UX Designer",
      "rating": 3.5,
      "message": "Good experience overall, though there were some delays. The final product met my expectations, and I would work with them again.",
      "imageUrl": "https://randomuser.me/api/portraits/men/3.jpg"
    }
  ];
  
  // Function to render testimonials
  function renderTestimonials(data) {
    const container = document.querySelector('.testimonials-container');
    container.innerHTML = ''; // Clear existing testimonials
    data.forEach(item => {
      const testimonial = new Testimonial(item.name, item.profession, item.rating, item.message, item.imageUrl);
      container.appendChild(testimonial.createTestimonialElement());
    });
  }
  
  // Function to filter testimonials
  function filterTestimonials(testimonials, filterFn) {
    return testimonials.filter(filterFn);
  }
  
  // Event listener for filters
  document.addEventListener('DOMContentLoaded', () => {
    renderTestimonials(testimonialsData);
  
    const ratingFilter = document.getElementById('rating-filter');
    const professionFilter = document.getElementById('profession-filter');
  
    function applyFilters() {
      const ratingValue = parseFloat(ratingFilter.value);
      const professionValue = professionFilter.value.toLowerCase();
  
      const filteredData = filterTestimonials(testimonialsData, testimonial => {
        const matchesRating = isNaN(ratingValue) || testimonial.rating >= ratingValue;
        const matchesProfession = professionValue === '' || testimonial.profession.toLowerCase().includes(professionValue);
        return matchesRating && matchesProfession;
      });
  
      renderTestimonials(filteredData);
    }
  
    ratingFilter.addEventListener('change', applyFilters);
    professionFilter.addEventListener('input', applyFilters);
  });
  