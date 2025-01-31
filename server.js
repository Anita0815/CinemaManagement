const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Middleware: Body parser to handle form data
app.use(express.urlencoded({ extended: true }));

// Middleware: Serve static files (CSS, JS, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Sample in-memory database
let movies = [
  { id: 1, title: 'Movie 1', genre: 'Action' },
  { id: 2, title: 'Movie 2', genre: 'Comedy' },
];

// Homepage Route
app.get('/', (req, res) => {
  res.render('index', { title: 'Cinema Management' });
});

// View Movies Route
app.get('/movies', (req, res) => {
  res.render('movies', { movies });
});

// Add Movie Route (GET: Show form)
app.get('/movies/add', (req, res) => {
  res.render('add-movie');
});

// Add Movie Route (POST: Handle form submission)
app.post('/movies/add', (req, res) => {
  const { title, genre } = req.body;
  if (!title || !genre) {
    return res.status(400).send('Title and Genre are required.');
  }
  
  const newMovie = {
    id: movies.length + 1,
    title,
    genre,
  };

  movies.push(newMovie);
  res.redirect('/movies');
});

// Edit Movie Route (GET: Show form)
app.get('/movies/edit/:id', (req, res) => {
  const movie = movies.find(m => m.id === parseInt(req.params.id));
  if (!movie) return res.status(404).send('Movie not found');
  
  res.render('edit-movie', { movie });
});

// Edit Movie Route (POST: Handle update)
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
