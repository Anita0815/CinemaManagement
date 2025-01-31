const express = require('express');
const app = express();
const port = 3000;

// Middleware to serve static files
app.use(express.static('public'));

// Body parser middleware to handle form data
app.use(express.urlencoded({ extended: true }));

// In-memory database (just an array for simplicity)
let movies = [
  { id: 1, title: 'Movie 1', genre: 'Action' },
  { id: 2, title: 'Movie 2', genre: 'Comedy' },
];

// Homepage route (Cinema Management homepage)
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// View Movies Route
app.get('/movies', (req, res) => {
  let movieList = movies.map(movie => `
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
    <a href="/movies/add">Add New Movie</a>
  `);
});

// Add Movie Route (GET to show form)
app.get('/movies/add', (req, res) => {
  res.sendFile(__dirname + '/public/add_movie.html');
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
  
  res.send(`
    <h2>Edit Movie</h2>
    <form action="/movies/edit/${movie.id}" method="POST">
      <label for="title">Title: </label>
      <input type="text" name="title" id="title" value="${movie.title}" required><br>
      <label for="genre">Genre: </label>
      <input type="text" name="genre" id="genre" value="${movie.genre}" required><br><br>
      <button type="submit">Save Changes</button>
    </form>
    <a href="/movies">Back to Movies</a>
  `);
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
