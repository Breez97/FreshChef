const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded({ extended: false });

const connection = require('../database/database_connection.js');

router.get('/auth', (req, res) => {
	res.status(200).contentType('text/html').render('authentification');
});

router.post('/login', urlParser, (req, res) => {
	let email = req.body.email;
	let password = req.body.password;

	connection.query(`SELECT * FROM users WHERE email=?`, [email], (error, result) => {
		if (error) {
			return res.status(500).redirect('/');
		}

		if (result.length === 0) {
			return res.status(301).render('authentification', {
				form: 'auth',
				email: email,
				message: 'Пользователь с такой почтой не зарегистрирован'
			});
		}
		
		connection.query(`SELECT * FROM users WHERE email=? AND password=?`, [email, password], (error, result) => {
			if (error) {
				return res.status(301).redirect('/');
			}

			if (result.length === 0) {
				return res.status(301).render('authentification', {
					form: 'auth',
					email: email,
					message: 'Неверный пароль'
				});
			}
			
			req.session.user = result[0];
			return res.status(200).contentType('text/html').redirect('/');
		});
	});
});

router.post('/reg', urlParser, (req, res) => {
	let name = req.body.name;
	let email = req.body.email;
	let password = req.body.password;

	connection.query(`SELECT * FROM users WHERE email=?`, [email], (error, result) => {
		if (error) {
			return res.status(500).redirect('/');
		}

		if (result.length > 0) {
			return res.status(301).render('authentification', {
				form: 'reg',
				email: email,
				message: 'Пользователь с такой почтой уже существует'
			});
		}

		connection.query(`INSERT INTO users (id, is_admin, name, email, password) VALUES(NULL, 0, ?, ?, ?)`, [name, email, password], (error, result) => {
			if (error) {
				return res.status(500).redirect('/');
			}

			connection.query(`SELECT * FROM users WHERE name=? AND email=? AND password=?`, [name, email, password], (error, result) => {
				if (error) {
					return res.status(301).redirect('/');
				}

				req.session.user = result[0];
				return res.status(200).contentType('text/html').redirect('/');
			})
		})
	});
});

module.exports = router;
