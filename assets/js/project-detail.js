document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    // Function to calculate duration between two dates
        const calculateDuration = (startDate, endDate) => {
            const start = new Date(startDate);
            const end = new Date(endDate);
            const durationInMilliseconds = end - start;
            const durationInDays = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24)); // Convert to days
            return durationInDays;
        };

        // Function to get query parameter from URL
        const getQueryParameter = (param) => {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        };

    // Get projects from local storage
    const projects = JSON.parse(localStorage.getItem('projects')) || [];

    if (projectId !== null && projects[projectId]) {
      const project = projects[projectId];

      // Calculate and display the project duration
      const duration = calculateDuration(project.startDate, project.endDate);
      document.getElementById('duration').textContent = `Duration: ${duration} days`;

      document.getElementById('projectName').textContent = project.name;
      document.getElementById('projectDate').textContent = `From: ${project.startDate} To: ${project.endDate}`;
      document.getElementById('projectTechnologies').textContent = `${project.technologies.join(', ')}`;
      document.getElementById('projectImage').src = project.imageURL;
      document.getElementById('projectDescription').textContent = project.description;
    } else {
      document.body.innerHTML = '<p>Project not found</p>';
    }
  });