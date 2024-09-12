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

document.getElementById('projectForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get form data
  const projectName = document.getElementById('projectName').value;
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  const description = document.getElementById('description').value;
  const technologies = Array.from(document.querySelectorAll('input[name="technologies"]:checked')).map(checkbox => checkbox.value);

  // Create a project object
  const project = {
    projectName,
    startDate,
    endDate,
    description,
    technologies,
  };

  // Retrieve existing projects from local storage
  let projects = JSON.parse(localStorage.getItem('projects')) || [];

  // Add the new project to the array
  projects.push(project);

  // Store the updated projects array in local storage
  localStorage.setItem('projects', JSON.stringify(projects));

  // Redirect to home.html
  window.location.href = '/';
});