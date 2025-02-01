const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');  
const path = require('path');
const dbConfig = require('./app/config/db.config');  

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
    port: dbConfig.PORT,
    logging: false // Disable logging for cleaner output
  }
);

// Test the database connection
sequelize.authenticate()
  .then(() => console.log('✅ Database connected!'))
  .catch((error) => console.error('❌ Unable to connect to the database:', error));

// Define a Movie model
const Movie = sequelize.define('Movie', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: false
});

// Sync the model with the database
sequelize.sync()
  .then(() => console.log('✅ Movie table synchronized.'))
  .catch((error) => console.error('❌ Error syncing the Movie model:', error));

// Homepage route
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

// Add Movie Route (GET)
app.get('/movies/add', (req, res) => {
  res.render('addMovie');
});

// Add Movie Route (POST)
app.post('/movies/add', async (req, res) => {
  try {
    await Movie.create({ title: req.body.title, genre: req.body.genre });
    res.redirect('/movies');
  } catch (error) {
    res.status(500).send('Error adding movie: ' + error);
  }
});

// Edit Movie Route (GET)
app.get('/movies/edit/:id', async (req, res) => {
  try {
    const movie = await Movie.findByPk(req.params.id);
    if (!movie) return res.status(404).send('Movie not found');
    res.render('editMovie', { movie });
  } catch (error) {
    res.status(500).send('Error fetching movie: ' + error);
  }
});

// Edit Movie Route (POST)
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
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server is running at http://0.0.0.0:${port}`);
});
