document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');
    
    // Get projects from local storage
    const projects = JSON.parse(localStorage.getItem('projects')) || [];

    if (projectId !== null && projects[projectId]) {
      const project = projects[projectId];
      
      document.getElementById('projectName').textContent = project.name;
      document.getElementById('projectDate').textContent = `From: ${project.startDate} To: ${project.endDate}`;
      document.getElementById('projectTechnologies').textContent = `Technologies: ${project.technologies.join(', ')}`;
      document.getElementById('projectImage').src = project.imageURL;
      document.getElementById('projectDescription').textContent = project.description;
    } else {
      document.body.innerHTML = '<p>Project not found</p>';
    }
  });