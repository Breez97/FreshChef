const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded({ extended: false });

const connection = require('../database/database_connection.js');

router.get('/profile', (req, res) => {
	if (req.session.user) {
		connection.query(`SELECT * FROM users WHERE id=?`, [req.session.user.id], (error, result) => {
			if (error) {
				return res.status(500).redirect('/');
			}

			res.status(200).contentType('text/html').render('profile', { 
				user: req.session.user,
				currentUser: result[0]
			});
		});
	} else {
		res.status(200).contentType('text/html').render('profile', { user: null });
	}
});

router.post('/save', urlParser, (req, res) => {
	let id = req.body.id;
	let name = req.body.name;
	let email = req.body.email;
	let password = req.body.password;
	
	connection.query(`SELECT * FROM users WHERE email=? AND id!=?`, [email, id], (error, result) => {
		if (error) {
			return res.status(500).redirect('/');
		}
		
		if (result.length > 0) {
			return res.status(301).render('profile', {
				user: req.session.user,
				message: 'Пользователь с такой почтой уже существует'
			});
		}

		connection.query(`UPDATE users SET name=?, email=?, password=? WHERE id=?`, [name, email, password, id], (error, result) => {
			if (error) {
				return res.status(500).redirect('/');
			}

			connection.query(`SELECT * FROM users WHERE id=?`, [id], (error, result) => {
				if (error) {
					return res.status(500).redirect('/');
				}

				req.session.user = result[0];

				return res.status(200).contentType('text/html').render('profile', { 
					user: req.session.user,
					currentUser: result[0]
				});
			});
		});
	});
});

module.exports = router;
