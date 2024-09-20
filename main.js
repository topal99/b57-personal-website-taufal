const express = require('express');
const app = express();
const port = 3000;
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session');
const methodOverride = require('method-override');
const multer = require('multer');

// Konfigurasi storage untuk multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Pastikan folder ini ada
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Menggunakan timestamp sebagai nama file
  }
});

const upload = multer({ storage: storage });

// Set up view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Tambahkan ini

// Routes
app.get("/");
app.get("/contact", contact);
app.get("/testimonials", testimonials);

// Gunakan middleware upload dalam route
app.post('/posts', upload.single('image'), createPost);

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

// Routes login
app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Adjust query to search by email instead of username
  db.query('SELECT * FROM tb_user WHERE email = ?', [email], async (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
          const comparison = await bcrypt.compare(password, results[0].password);
          if (comparison) {
              req.session.loggedin = true;
              req.session.username = results[0].username;  // Store username in session
              res.redirect('/');
          } else {
              res.send('Incorrect Email and/or Password!');
          }
      } else {
          res.send('Incorrect Email and/or Password!');
      }
  });
});

app.get('/register', (req, res) => {
  res.render('register', { username: req.session.username });
});

app.post('/register', async (req, res) => {
  const { email, username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insert the new user into the database, including email
  db.query('INSERT INTO tb_user (email, username, password) VALUES (?, ?, ?)', 
  [email, username, hashedPassword], (err, result) => {
      if (err) throw err;
      res.redirect('/login');
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

app.use('/uploads', express.static('uploads'));

function createPost(req, res) {
  const { title, content, postType } = req.body;
  const image = req.file ? req.file.filename : null; // Mengambil nama file yang di-upload
  const postTypes = Array.isArray(postType) ? postType.join(',') : postType;

  db.query('INSERT INTO posts (title, image, content, post_type) VALUES (?, ?, ?, ?, ?)', 
    [title, image, content, postTypes], (err, result) => {
      if (err) throw err;
      res.redirect('/posts');
  });
}

app.get('/edit-post/:id', (req, res) => {
  const { id } = req.params;

  db.query('SELECT * FROM posts WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    if (result.length > 0) {
      const post = result[0];

      // Tentukan apakah setiap jenis pos tercentang
      post.isArticle = post.post_type.includes('Article');
      post.isNews = post.post_type.includes('News');
      post.isTutorial = post.post_type.includes('Tutorial');

      res.render('edit-post', { post });
    } else {
      res.send('Post not found');
    }
  });
});

app.post('/edit-post/:id', upload.single('image'), (req, res) => {
  const { title, content, postType } = req.body;
  const postTypes = Array.isArray(postType) ? postType.join(',') : postType || '';

  // Cek jika ada gambar baru yang di-upload
  const image = req.file ? req.file.filename : null;

  // Update post di database
  db.query('UPDATE posts SET title = ?, image = ?, content = ?, post_type = ? WHERE id = ?', 
    [title, image, content, postTypes, req.params.id], (err, result) => {
      if (err) {
          console.error(err);
          return res.status(500).send('Error updating post');
      }
      res.redirect('/posts');
  });
});

app.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Deleting post with id: ${id}`);  // Logging untuk cek apakah route ini terpanggil
  db.query('DELETE FROM posts WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    console.log('Post deleted successfully');  // Logging untuk cek apakah query berhasil
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
    res.render('post-detail', { post: result[0]});
  });
}

app.get('/', isAuthenticated, (req, res) => {
  res.render('index', { username: req.session.username });
});

app.get('/posts', isAuthenticated, getAllPosts, (req, res) => {
  res.render('posts', { username: req.session.username });
});;

app.get('/posts/:id', isAuthenticated, getPostById, (req, res) => {
  res.render('posts', { username: req.session.username });
});;;

app.get('/add-post', isAuthenticated, (req, res) => {
  res.render('add-post', { username: req.session.username });
});

function contact(req, res) {
  res.render("contact")
};

function testimonials(req, res) {
  res.render("testimonials")
};

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});