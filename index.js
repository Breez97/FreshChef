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
app.use(express.json());

app.use(session({
	secret: 'secret_key',
	resave: false,
	saveUninitialized: true
}));

app.get('/', (req, res) => {
	connection.query(`SELECT * FROM dishes ORDER BY amount_of_time_ordered LIMIT 3`, (error, result) => {
		if (error) {
			return res.status(500).redirect('/');
		}

		if (req.session.user) {
			return res.status(200).contentType('text/html').render('index', { 
				user: req.session.user,
				dishes: result,
			});
		} else {
			return res.status(200).contentType('text/html').render('index', { 
				user: null,
				dishes: result,
			});
		}
	});
});

const authRoutes = require('./routes/auth.js');
app.use(authRoutes);

const profileRoutes = require('./routes/profile.js')
app.use(profileRoutes);

const menuRoutes = require('./routes/menu.js');
app.use(menuRoutes);

app.get('/*', function(req, res) {
	if (req.session.user) {
		return res.status(404).render('404', { user: req.session.user });
	} else {
		return res.status(404).render('404', { user: null });
	}
});

app.listen(3000);
