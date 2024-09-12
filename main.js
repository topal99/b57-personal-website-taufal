const express = require('express');
const app = express();
const port = 3000;
const path = require('path');

app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "views"));

app.use('/assets', express.static(path.join(__dirname, 'assets')));

app.get("/", (req, res) => {
  res.render("index")
});

app.get("/project", (req, res) => {
  res.render("project")
});

app.get("/project-detail", (req, res) => {
  res.render("project-detail")
});

app.get("/contact", (req, res) => {
  res.render("contact")
});

app.get("/testimonials", (req, res) => {
  res.render("testimonials")
});

app.get('/', (req, res) => {
  res.send("hello wewe")
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});