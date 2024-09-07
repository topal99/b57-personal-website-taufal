document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('projectForm');
    const projectCardsContainer = document.querySelector('.project-cards');
    let editIndex = null; // Keep track of the project being edited
  
    // Function to convert image to Base64 data URL
    const getImageBase64 = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };
  
    // Load projects from local storage and display on page load
    const loadProjects = () => {
      const projects = JSON.parse(localStorage.getItem('projects')) || [];
      projectCardsContainer.innerHTML = ''; // Clear existing cards
      projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
          <div class="card-content">
            <img src="${project.imageURL}" alt="Project Image" class="project-thumbnail">
            <br>
            <h3>${project.name}</h3>
            <br>
            <p>Start Date: ${project.startDate}</p>
            <p>End Date: ${project.endDate}</p>
            <p>${project.technologies}</p>
          </div>
          <br>
          <div class="card-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
          </div>
        `;
  
        // Event listener to view details when clicking on card (except Edit/Delete buttons)
        card.querySelector('.card-content').addEventListener('click', () => {
          window.location.href = `project-detail.html?id=${index}`;
        });
  
        // Prevent navigation when clicking Edit button
        card.querySelector('.edit-btn').addEventListener('click', (event) => {
          event.stopPropagation(); // Stop the event from triggering the card click event
          editProject(index); // Call the edit function
        });
  
        // Prevent navigation when clicking Delete button
        card.querySelector('.delete-btn').addEventListener('click', (event) => {
          event.stopPropagation(); // Stop the event from triggering the card click event
          deleteProject(index); // Call the delete function
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
  
      // Get existing projects from local storage
      let projects = JSON.parse(localStorage.getItem('projects')) || [];
  
      const newProject = {
        name,
        startDate,
        endDate,
        description,
        technologies,
        imageURL: imageBase64 || (editIndex !== null ? projects[editIndex].imageURL : null) // Use existing image if not edited
      };
  
      if (editIndex !== null) {
        // Update existing project
        projects[editIndex] = newProject;
        editIndex = null; // Reset edit mode
      } else {
        // Add new project
        projects.push(newProject);
      }
  
      localStorage.setItem('projects', JSON.stringify(projects)); // Save updated list
  
      // Reload the projects to display the new or updated card
      loadProjects();
      
      // Clear the form
      form.reset();
    });
  
    // Edit project function
    const editProject = (index) => {
      const projects = JSON.parse(localStorage.getItem('projects')) || [];
      const project = projects[index];
  
      // Populate form with project data
      document.getElementById('projectName').value = project.name;
      document.getElementById('startDate').value = project.startDate;
      document.getElementById('endDate').value = project.endDate;
      document.getElementById('description').value = project.description;
      // Check the appropriate technologies
      document.querySelectorAll('input[name="technologies"]').forEach(checkbox => {
        checkbox.checked = project.technologies.includes(checkbox.value);
      });
      
      editIndex = index; // Set the edit index
    };
  
    // Delete project function
    const deleteProject = (index) => {
      let projects = JSON.parse(localStorage.getItem('projects')) || [];
      projects.splice(index, 1); // Remove project at specified index
      localStorage.setItem('projects', JSON.stringify(projects)); // Save updated list
      loadProjects(); // Reload the project list
    };
  
    // Load projects on page load
    loadProjects();
  });
  