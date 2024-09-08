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
    const form = document.getElementById('projectForm');
    const projectCardsContainer = document.querySelector('.project-cards');
    let editIndex = null; // Track project being edited
  
    // Function to convert image to Base64 data URL
    const getImageBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };
  
    // Function to calculate duration between two dates
    const calculateDuration = (startDate, endDate) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const durationInMilliseconds = end - start;
      const durationInDays = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days
      return durationInDays;
    };
  
    // Load projects from local storage and display on page load
    const loadProjects = () => {
      const projects = JSON.parse(localStorage.getItem('projects')) || [];
      projectCardsContainer.innerHTML = ''; // Clear existing cards
      projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        
        // Calculate project duration
        const duration = calculateDuration(project.startDate, project.endDate);
  
        card.innerHTML = `
          <div class="card-content">
            <img src="${project.imageURL}" alt="Project Image" class="project-thumbnail">
            <br>
            <h4 class="mt-4">${project.name}</h4>
            <br>
            <p>Start Date: ${project.startDate}</p>
            <p>End Date: ${project.endDate}</p>
            <p>Duration: ${duration} days</p> <!-- Display duration -->
          </div>
          <div class="card-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
        `;
  
        // Event listener for card click to show details
        card.querySelector('.card-content').addEventListener('click', () => {
          window.location.href = `project-detail.html?id=${index}`;
        });
  
        
        // Prevent navigation when clicking Edit button
        card.querySelector('.edit-btn').addEventListener('click', (event) => {
          event.stopPropagation();
          editProject(index);
        });
  
        // Prevent navigation when clicking Delete button
        card.querySelector('.delete-btn').addEventListener('click', (event) => {
          event.stopPropagation();
          deleteProject(index);
        });
  
        projectCardsContainer.appendChild(card);
      });
    };
  
    // Save or update project to local storage
    form.addEventListener('submit', async function(event) {
      event.preventDefault();
  
      const name = document.getElementById('projectName').value;
      const startDate = document.getElementById('startDate').value;
      const endDate = document.getElementById('endDate').value;
      const description = document.getElementById('description').value;
      const technologies = Array.from(document.querySelectorAll('input[name="technologies"]:checked'))
                               .map(tech => tech.value);
      const imageFile = document.getElementById('uploadImage').files[0];
      
      // Convert the image to Base64 if a new image is selected
      const imageBase64 = imageFile ? await getImageBase64(imageFile) : null;
  
      let projects = JSON.parse(localStorage.getItem('projects')) || [];
  
      const newProject = {
        name,
        startDate,
        endDate,
        description,
        technologies,
        imageURL: imageBase64 || (editIndex !== null ? projects[editIndex].imageURL : null) // Keep existing image if not edited
      };
  
      if (editIndex !== null) {
        projects[editIndex] = newProject;
        editIndex = null;
      } else {
        projects.push(newProject);
      }
  
      localStorage.setItem('projects', JSON.stringify(projects));
      loadProjects();
      form.reset();
    });
  
    const editProject = (index) => {
      const projects = JSON.parse(localStorage.getItem('projects')) || [];
      const project = projects[index];
  
      document.getElementById('projectName').value = project.name;
      document.getElementById('startDate').value = project.startDate;
      document.getElementById('endDate').value = project.endDate;
      document.getElementById('description').value = project.description;
  
      document.querySelectorAll('input[name="technologies"]').forEach(checkbox => {
        checkbox.checked = project.technologies.includes(checkbox.value);
      });
      
      editIndex = index;
    };
  
    const deleteProject = (index) => {
      let projects = JSON.parse(localStorage.getItem('projects')) || [];
      projects.splice(index, 1);
      localStorage.setItem('projects', JSON.stringify(projects));
      loadProjects();
    };
  
    loadProjects();
  });
  