const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const parser = require('cookie-parser');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(parser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = "YOUR_MONGODB_ACCOUNT"
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
// Apply the checkUser middleware for all Routes.
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
// Authentication middleware added here.
app.get('/gamelist', requireAuth, (req, res) => res.render('gamelist'));
app.use(authRoutes);


// For JWT auth we will use cookies
// This cookies stored in session
// If browser is closed then cookies will be deleted.
// app.get('/set_cookies', (req, res) => {
	/**
	 * maxAge = 1 day
	 * secure = secure connection needs for this cookie set.
	 * httpOnly = we cannot access it from JavaScript
	 * res.cookie('newUser', false, { maxAge: 1000 * 60 * 60 * 24 , secure:true });
	 */
//	res.send('New cookies!');
//  });

/*
app.get('/read_cookies', (req, res) => {

});
*/
