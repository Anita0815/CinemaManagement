--CREATE DATABASE IF NOT EXISTS cinema;


USE cinema;

-- Create the movies table
CREATE TABLE IF NOT EXISTS movies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(255) NOT NULL
);

-- Insert sample data
INSERT INTO movies (title, genre) VALUES 
('Movie 1', 'Action'),
('Movie 2', 'Comedy');