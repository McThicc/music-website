const express = require('express');
const session = require('express-session');

const MongoStore = require('connect-mongo');
const connectDB = require('./database/db');

const postRoutes = require('./routes/postRoutes');
const loginRoutes = require('./routes/loginRoutes'); 
const signUpRoutes = require('./routes/signUpRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const logoutRoutes = require('./routes/logoutRoutes');
const User = require('./model/user');

require('dotenv').config();

const app = express();

// The Middleware that parses JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Allow access to static files like images
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to EJS (makes the html pages work)
app.set('view engine', 'ejs');
app.set('views', './views');

// Session configuration
app.use(session({
  secret: 'secret-secret',
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions',
  }),
}));

// Connect to the database
connectDB();

// Middleware to pass the session user data to all views
app.use((req, res, next) => {
  // Pass the session user data to the views, only if they are logged in
  // Make userId available to all views
  res.locals.user = req.session.userId || null;
  next();
});

// The Different .ejs/html Routes
app.use('/', postRoutes);
app.use('/login', loginRoutes);
app.use('/signup', signUpRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/logout', logoutRoutes);
app.use('/posts', postRoutes);

// Starts the server
const port = process.env.PORT || 3000;
app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`Server is started at port ${port}`);
  }
});
