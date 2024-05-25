const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded({ extended: false });

const connection = require('../database/database_connection.js');

router.get('/menu', (req, res) => {
	if (req.session.user) {
		connection.query(`SELECT * FROM users WHERE id=?`, [req.session.user.id], (error, result) => {
			if (error) {
				return res.status(500).redirect('/');
			}

			return res.status(200).contentType('text/html').render('profile', { 
				user: req.session.user,
				currentUser: result[0]
			});
		});
	} else {
		return res.status(200).contentType('text/html').render('profile', { user: null });
	}
});

module.exports = router;
