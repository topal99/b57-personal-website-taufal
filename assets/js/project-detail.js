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
  // Get the project ID from the URL
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');

  // Retrieve the projects from local storage
  const projects = JSON.parse(localStorage.getItem('projects')) || [];

  // Get the project details
  const project = projects[projectId];

  if (project) {
    // Create the project detail content
    const projectDetail = `
      <div class="card-body">
        <h5 class="card-title">${project.projectName}</h5>
        <p class="card-text"><strong>Start Date:</strong> ${project.startDate}</p>
        <p class="card-text"><strong>End Date:</strong> ${project.endDate}</p>
        <p class="card-text"><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
          <div class="card mt-3">
            <p class="card-text text-justify">${project.description}</p>
          </div>
      </div>
    `;

    // Insert the project detail content into the projectDetail div
    document.getElementById('projectDetail').innerHTML = projectDetail;
  }
});