const express = require('express');
const { Sequelize } = require('sequelize');  // Import Sequelize
const path = require('path');
const dbConfig = require('./app/config/db.config');  // Adjust the path to your db.config.js file
const app = express();
const port = 3000;

// Middleware to serve static files (like CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Body parser middleware to handle form data
app.use(express.urlencoded({ extended: true }));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initialize Sequelize connection
const sequelize = new Sequelize(
  dbConfig.DB, 
  dbConfig.USER, 
  dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.PORT
  }
);

// Test the database connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected!');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });

// Define a Movie model (you can later replace it with your actual database schema)
const Movie = sequelize.define('Movie', {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  genre: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

// Sync the model with the database
sequelize.sync()
  .then(() => {
    console.log('Movie table has been synchronized.');
  })
  .catch((error) => {
    console.error('Error syncing the Movie model:', error);
  });

// Homepage route (Cinema Management homepage)
app.get('/', (req, res) => {
  res.render('index', { title: 'Cinema Management' });
});

// View Movies Route
app.get('/movies', async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.render('movies', { movies });
  } catch (error) {
    res.status(500).send('Error retrieving movies: ' + error);
  }
});

// Add Movie Route (GET to show form)
app.get('/movies/add', (req, res) => {
  res.render('addMovie');
});

// Add Movie Route (POST to handle form submission)
app.post('/movies/add', async (req, res) => {
  const { title, genre } = req.body;
  try {
    const newMovie = await Movie.create({
      title: title,
      genre: genre
    });
    res.redirect('/movies');
  } catch (error) {
    res.status(500).send('Error adding movie: ' + error);
  }
});

// Edit Movie Route (GET to show form)
app.get('/movies/edit/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).send('Movie not found');
    res.render('editMovie', { movie });
  } catch (error) {
    res.status(500).send('Error fetching movie: ' + error);
  }
});

// Edit Movie Route (POST to handle form submission)
app.post('/movies/edit/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).send('Movie not found');

    movie.title = req.body.title;
    movie.genre = req.body.genre;
    await movie.save();

    res.redirect('/movies');
  } catch (error) {
    res.status(500).send('Error updating movie: ' + error);
  }
});

// Delete Movie Route
app.get('/movies/delete/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).send('Movie not found');
    
    await movie.destroy();
    res.redirect('/movies');
  } catch (error) {
    res.status(500).send('Error deleting movie: ' + error);
  }
});

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Start the server
app.listen(3000, '0.0.0.0', () => {
  console.log('Server is running at http://0.0.0.0:3000');
});
