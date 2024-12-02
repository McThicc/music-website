//server.js

const express = require('express');
const connectDB = require('./database/db');
const postRoutes = require('./routes/postRoutes');

const app = express();

const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

const port = 3000;

// Connect to the database
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Routes
app.use('/', postRoutes);

// Start the server
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is started at port ${port}`);
  }
});