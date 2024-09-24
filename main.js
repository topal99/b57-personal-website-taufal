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

// Middleware
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true
}));

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

const db = mysql.createConnection({
  host: process.env.mysql-iowm.railway.internal,
  user: process.env.root,
  password: process.env.wMqQfYUXeyDElHTyAxdKmPteKHAoXETU,
  database: process.env.railway,
});

db.connect((err) => {
  if (err) throw err;
  console.log('Connected to database');
});

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

  db.query('SELECT * FROM tb_user WHERE email = ?', [email], async (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const comparison = await bcrypt.compare(password, results[0].password);
      if (comparison) {
        req.session.loggedin = true;
        req.session.userId = results[0].id;  // Simpan userId di session
        req.session.username = results[0].username;
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
  const image = req.file ? req.file.filename : null;
  const postTypes = Array.isArray(postType) ? postType.join(',') : postType;

  const authorId = req.session.userId;  // Pastikan ini ada

  if (!authorId) {
    return res.status(403).send('Unauthorized: No user logged in.');
  }

  db.query('INSERT INTO posts (title, image, content, post_type, authorId) VALUES (?, ?, ?, ?, ?)', 
    [title, image, content, postTypes, authorId], (err, result) => {
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
      res.redirect('/');
  });
});

app.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Deleting post with id: ${id}`);  // Logging untuk cek apakah route ini terpanggil
  db.query('DELETE FROM posts WHERE id = ?', [id], (err, result) => {
    if (err) throw err;
    console.log('Post deleted successfully');  // Logging untuk cek apakah query berhasil
    res.redirect('/');
  });
});

// Mendapatkan semua posts
function getAllPosts(req, res) {
  const userId = req.session.userId; // Ambil userId dari session

  const query = `
    SELECT posts.*, tb_user.username AS author 
    FROM posts
    JOIN tb_user ON posts.authorId = tb_user.id
    WHERE posts.authorId = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) throw err;

    // Memformat tanggal setiap post
    results.forEach(post => {
      post.post_date = new Date(post.post_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    });

    res.render('posts', { posts: results, username: req.session.username });
  });
};

// Mendapatkan post berdasarkan ID
function getPostById(req, res) {
  const { id } = req.params;
  
  // Query untuk mendapatkan detail post sekaligus dengan nama author
  const query = `
    SELECT posts.*, tb_user.username AS author FROM posts JOIN tb_user ON posts.authorId = tb_user.id 
    WHERE posts.id = ?
  `;
  db.query(query, [id], (err, result) => {

    // Memformat tanggal (misalnya dalam format '21 Sep 2024')
    if (result.length > 0) {
      result[0].post_date = new Date(result[0].post_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    }

    res.render('post-detail', { post: result[0], username: req.session.username });
  });
};

app.get('/', isAuthenticated, (req, res) => {
  const userId = req.session.userId; // Ambil userId dari session

  const query = `
    SELECT posts.*, tb_user.username AS author 
    FROM posts
    JOIN tb_user ON posts.authorId = tb_user.id
    WHERE posts.authorId = ?
  `;

  db.query(query, [userId], (err, results) => {
    if (err) throw err;

    // Memformat tanggal setiap post
    results.forEach(post => {
      post.post_date = new Date(post.post_date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    });

    res.render('index', { posts: results, username: req.session.username });
  });
});

app.get('/posts', isAuthenticated, getAllPosts, (req, res) => {
  res.render('posts', { username: req.session.username });
});

app.get('/post-detail/:id', isAuthenticated, getPostById, (req, res) => {
  res.render('posts', { username: req.session.username });
});

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