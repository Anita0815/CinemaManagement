const express = require('express');
const app = express();
const path = require('path');
const port = 3000;

// Middleware to serve static files (like CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware to handle form data
app.use(express.urlencoded({ extended: true }));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// In-memory database (just an array for simplicity)
let movies = [
  { id: 1, title: 'Movie 1', genre: 'Action' },
  { id: 2, title: 'Movie 2', genre: 'Comedy' },
];

// Homepage route (Cinema Management homepage)
app.get('/', (req, res) => {
  res.render('index', { title: 'Cinema Management' });
});

// View Movies Route
app.get('/movies', (req, res) => {
  res.render('movies', { movies });
});

// Add Movie Route (GET to show form)
app.get('/movies/add', (req, res) => {
  res.render('addMovie');
});

// Add Movie Route (POST to handle form submission)
app.post('/movies/add', (req, res) => {
  const { title, genre } = req.body;
  const newMovie = {
    id: movies.length + 1,
    title: title,
    genre: genre
  };
  movies.push(newMovie);
  res.redirect('/movies');
});

// Edit Movie Route (GET to show form)
app.get('/movies/edit/:id', (req, res) => {
  const movie = movies.find(m => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send('Movie not found');
  res.render('editMovie', { movie });
});

// Edit Movie Route (POST to handle form submission)
app.post('/movies/edit/:id', (req, res) => {
  const movie = movies.find(m => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send('Movie not found');

  movie.title = req.body.title;
  movie.genre = req.body.genre;

  res.redirect('/movies');
});

// Delete Movie Route
app.get('/movies/delete/:id', (req, res) => {
  const movieIndex = movies.findIndex(m => m.id === parseInt(req.params.id));
  if (movieIndex === -1) return res.status(404).send('Movie not found');

  movies.splice(movieIndex, 1);
  res.redirect('/movies');
});

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${port}`);
});


