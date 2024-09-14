const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.urlencoded({ extended: true }));
app.get("/", home);
app.get("/project", project);
app.get("/add-project", addProjectView);
app.get("/contact", contact);
app.post("/add-project", addProject);
app.get("/project-detail", projectDetail);
app.get("/testimonials", testimonials);

const projects = [];

function home(req, res) {
  res.render("index")
};

function project(req, res) {
  res.render("project", {projects})
};

function addProjectView (req, res) {
  res.render("add-project")
};

function addProject(req, res) {
  const {projectName, startDate, endDate, description, technologies} = req.body

  const data = {
    projectName,
    startDate,
    endDate,
    description,
    technologies
  };

  projects.unshift(data);
};

function projectDetail(req, res) {
  res.render("project-detail")
};

function contact(req, res) {
  res.render("contact")
};

function testimonials(req, res) {
  res.render("testimonials")
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});