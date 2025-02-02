const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Middleware to handle form data
app.use(express.urlencoded({ extended: true }));

// MySQL Connection Setup
const db = mysql.createConnection({
  host: 'localhost', // Change this if using a remote DB
  user: 'admin',      // Your MySQL username
  password: 'admin123',      // Your MySQL password
  database: 'cinema'
});

// Connect to MySQL
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Homepage Route
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to My Cinema Management Website!</h1>
    <a href="/movies">View Movies</a><br>
    <a href="/movies/add">Add New Movie</a>
  `);
});

// View Movies Route
app.get('/movies', (req, res) => {
  db.query('SELECT * FROM movies', (err, results) => {
    if (err) return res.status(500).send('Database error');

    let movieList = results.map(movie => `
      <li>
        ${movie.title} (${movie.genre}) 
        - <a href="/movies/edit/${movie.id}">Edit</a> | 
        <a href="/movies/delete/${movie.id}">Delete</a>
      </li>
    `).join('');

    res.send(`
      <h2>Movies List</h2>
      <ul>${movieList}</ul>
      <a href="/">Back to Homepage</a>
    `);
  });
});

// Add Movie Route (GET)
app.get('/movies/add', (req, res) => {
  res.send(`
    <h2>Add New Movie</h2>
    <form action="/movies/add" method="POST">
      <label>Title: </label><input type="text" name="title" required><br>
      <label>Genre: </label><input type="text" name="genre" required><br>
      <button type="submit">Add Movie</button>
    </form>
    <a href="/movies">Back to Movies</a>
  `);
});

// Add Movie Route (POST)
app.post('/movies/add', (req, res) => {
  const { title, genre } = req.body;
  db.query('INSERT INTO movies (title, genre) VALUES (?, ?)', [title, genre], err => {
    if (err) return res.status(500).send('Database error');
    res.redirect('/movies');
  });
});

// Edit Movie Route (GET)
app.get('/movies/edit/:id', (req, res) => {
  db.query('SELECT * FROM movies WHERE id = ?', [req.params.id], (err, results) => {
    if (err || results.length === 0) return res.status(404).send('Movie not found');

    const movie = results[0];
    res.send(`
      <h2>Edit Movie</h2>
      <form action="/movies/edit/${movie.id}" method="POST">
        <label>Title: </label><input type="text" name="title" value="${movie.title}" required><br>
        <label>Genre: </label><input type="text" name="genre" value="${movie.genre}" required><br>
        <button type="submit">Save Changes</button>
      </form>
      <a href="/movies">Back to Movies</a>
    `);
  });
});

// Edit Movie Route (POST)
app.post('/movies/edit/:id', (req, res) => {
  const { title, genre } = req.body;
  db.query('UPDATE movies SET title = ?, genre = ? WHERE id = ?', [title, genre, req.params.id], err => {
    if (err) return res.status(500).send('Database error');
    res.redirect('/movies');
  });
});

// Delete Movie Route
app.get('/movies/delete/:id', (req, res) => {
  db.query('DELETE FROM movies WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).send('Database error');
    res.redirect('/movies');
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
