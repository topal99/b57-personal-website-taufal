const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.urlencoded({ extended: false }));
app.get("/");
app.get("/project", project);
app.get("/add-project", addProjectView);
app.get("/delete-project/:id", deleteProject)
app.get("/edit-project/:id", editProject)
app.get("/contact", contact);
app.get("/project-detail/:id", projectDetail);
app.get("/testimonials", testimonials);
app.post("/edit-project/:id", editProjects)
app.post("/add-project", addProject);
app.post("/project-detail/:id", projectDetails)
// Routes untuk CRUD
app.get('/posts', getAllPosts);
app.get('/posts/:id', getPostById);
app.post('/posts', createPost);
app.put('/posts/:id', updatePost);

app.get('/edit-post/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM posts WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      res.render('edit-post', { post: result[0] });
    } else {
      res.send('Post not found');
    }
  });
});

app.post('/edit-post/:id', (req, res) => {
  const { id } = req.params;
  const { authorId, title, image, content } = req.body;
  db.query('UPDATE posts SET authorId = ?, title = ?, image = ?, content = ? WHERE id = ?', [authorId, title, image, content, id], (err, result) => {
    if (err) throw err;
    res.redirect('/posts');
  });
});

// Mendapatkan semua posts
function getAllPosts(req, res) {
  db.query('SELECT * FROM posts', (err, results) => {
    if (err) throw err;
    res.render('posts', { posts: results });
  });
}

// Mendapatkan post berdasarkan ID
function getPostById(req, res) {
  const { id } = req.params;
  db.query('SELECT * FROM posts WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    res.render('post-detail', { post: result[0] });
  });
}

// Membuat post baru
function createPost(req, res) {
  const { authorId, title, image, content } = req.body;
  db.query('INSERT INTO posts (authorId, title, image, content) VALUES (?, ?, ?, ?)', [authorId, title, image, content], (err, result) => {
    if (err) throw err;
    res.redirect('/posts');
  });
}

// Mengupdate post
function updatePost(req, res) {
  const { id } = req.params;
  const { authorId, title, image, content } = req.body;
  db.query('UPDATE posts SET authorId = ?, title = ?, image = ?, content = ? WHERE id = ?', [authorId, title, image, content, id], (err, result) => {
    if (err) throw err;
    res.redirect('/posts');
  });
}

app.get('/add-post', (req, res) => {
  res.render('add-post');
});


// Konfigurasi database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'b57-personal-website'
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

// Middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

// Middleware untuk autentikasi
function isAuthenticated(req, res, next) {
  if (req.session.loggedin) {
      return next();
  } else {
      res.redirect('/login');
  }
}

// Routes
app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.query('INSERT INTO tb_user (username, password) VALUES (?, ?)', [username, hashedPassword], (err, result) => {
      if (err) throw err;
      res.redirect('/login');
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM tb_user WHERE username = ?', [username], async (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
          const comparison = await bcrypt.compare(password, results[0].password);
          if (comparison) {
              req.session.loggedin = true;
              req.session.username = username;
              res.redirect('/');
          } else {
              res.send('Incorrect Username and/or Password!');
          }
      } else {
          res.send('Incorrect Username and/or Password!');
      }
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
      if (err) {
          return console.log(err);
      }
      res.redirect('/login');
  });
}); 

const projects = [
  {
    imageUrl: '/assets/img/brandlogo.webp',
    projectName: 'Paloma Perry',
    startDate: '2018-06-15',
    endDate: '1999-08-29',
    description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
  },

  {
    imageUrl: '/assets/img/brandlogo.webp',
    projectName: 'asas Perry',
    startDate: '2018-06-15',
    endDate: '1999-08-29',
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like",
  },

  {
    imageUrl: '/assets/img/brandlogo.webp',
    projectName: 'asas Perry',
    startDate: '2018-06-15',
    endDate: '1999-08-29',
    description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like",
  },
];

app.get('/', isAuthenticated, (req, res) => {
  res.render('index', { username: req.session.username });
});


function deleteProject(req, res) {
  const id = req.params.id
  
  projects.splice(id, 1);
  res.redirect("/project");
};

function editProject(req, res) {
  const id = req.params.id
  
  res.render("edit-project", {projects: projects[id] });
};

function editProjects(req, res) {
  const id = req.params.id
  const {imageUrl, projectName, startDate, endDate, description} = req.body;
  
  projects[id] = {
    imageUrl : "/assets/img/profile.jpg",
    projectName,
    startDate,
    endDate,
    description,
  };

  res.redirect("/project")
};

function project(req, res) {
  res.render("project", {projects})
};

function addProjectView (req, res) {
  res.render("add-project")
};

function addProject(req, res) {
  const {imageUrl, projectName, startDate, endDate, description} = req.body

  projects.push({
    imageUrl : "/assets/img/brandlogo.webp",
    projectName,
    startDate,
    endDate,
    description,
    // technologies,
  });

  res.redirect("project");
};

function contact(req, res) {
  res.render("contact")
};
function projectDetails(req, res) {
  const id = req.params.id
  const {imageUrl, projectName, startDate, endDate, description} = req.body;

  projects[id] = {
    imageUrl : "/assets/img/profile.jpg",
    projectName,
    startDate,
    endDate,
    description,
  };

  res.render("project-detail", {projects: projects[id] });
};

function projectDetail(req, res) {
  const id = req.params.id
  const {imageUrl, projectName, startDate, endDate, description} = req.body;

  res.render("project-detail", {projects: projects[id] });
}

function testimonials(req, res) {
  res.render("testimonials")
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});