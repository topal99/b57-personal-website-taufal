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

  document.addEventListener('DOMContentLoaded', function() {
    // Retrieve the projects from local storage
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
  
    // Create cards for each project
    const projectCards = projects.map((project, index) => `
        <div class="card">
          <a href="project-detail?id=${index}" class="card-link m-auto">
            <div class="card-body">
              <h5 class="card-title">${project.projectName}</h5>
              <p class="card-text"><strong>Start Date:</strong> ${project.startDate}</p>
              <p class="card-text"><strong>End Date:</strong> ${project.endDate}</p>
              <p class="card-text"><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
              <br>
            </div>
          </a>
          <div>
            <button class="delete-button" data-index="${index}">Delete</button>
          </div>  
        </div>
    `).join('');
  
    // Append the cards to the project-cards container
    document.querySelector('.project-cards').innerHTML = projectCards;
  
    // Add event listener for delete buttons
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', function() {
        const index = this.getAttribute('data-index');
        projects.splice(index, 1);
        localStorage.setItem('projects', JSON.stringify(projects));
        location.reload(); // Reload the page to reflect changes
      });
    });
});
