const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');

const connection = require('./database/database_connection');
const urlParser = bodyParser.urlencoded({ extended: false });
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
	secret: 'secret_key',
	resave: false,
	saveUninitialized: true
}));

app.get('/', (req, res) => {
	if (req.session.user) {
		res.status(200).contentType('text/html').render('index', { user: req.session.user });
	} else {
		res.status(200).contentType('text/html').render('index', { user: null });
	}
});

const authRoutes = require('./routes/auth.js');
app.use(authRoutes);

const profileRoutes = require('./routes/profile.js')
app.use(profileRoutes);

app.get('/*', function(req, res) {
	if (req.session.user) {
		res.status(404).render('404', { user: req.session.user });
	} else {
		res.status(404).render('404', { user: null });
	}
});

app.listen(3000);
