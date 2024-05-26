const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded({ extended: false });

const connection = require('../database/database_connection.js');

router.get('/menu', (req, res) => {
	connection.query(`SELECT * FROM dishes`, (error, result) => {
		if (error) {
			return res.status(500).redirect('/');
		}

		if (req.session.user) {
			return res.status(200).contentType('text/html').render('menu', { 
				user: req.session.user,
				dishes: result,
			});
		} else {
			return res.status(200).contentType('text/html').render('menu', { 
				user: null,
				dishes: result,
			});
		}
	});
});

module.exports = router;
