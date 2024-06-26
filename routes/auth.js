const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded({ extended: false });

const connection = require('../database/database_connection.js');

router.get('/auth', (req, res) => {
	res.status(200).contentType('text/html').render('authentification', {
		user: null
	});
});

router.post('/login', urlParser, (req, res) => {
	let email = req.body.email;
	let password = req.body.password;

	connection.query(`SELECT * FROM users WHERE email=?`, [email], (error, result) => {
		if (error) {
			return res.status(500).send({
				success: false,
				message: 'DatabaseError'
			});
		}
		if (result.length === 0) {
			return res.status(200).send({
				success: false,
				message: 'Пользователь с такой почтой не зарегистрирован'
			});
		}
		connection.query(`SELECT * FROM users WHERE email=? AND password=?`, [email, password], (error, result) => {
			if (error) {
				return res.status(500).send({
					success: false,
					message: 'DatabaseError'
				});
			}
			if (result.length === 0) {
				return res.status(200).send({
					success: false,
					message: 'Неверный пароль'
				});
			}
			req.session.user = result[0];
			return res.status(200).send({
				success: true,
				message: 'Успешный вход'
			});
		});
	});
});

router.post('/reg', urlParser, (req, res) => {
	let name = req.body.name;
	let email = req.body.email;
	let password = req.body.password;

	connection.query(`SELECT * FROM users WHERE email=?`, [email], (error, result) => {
		if (error) {
			return res.status(500).send({
				success: false,
				message: 'DatabaseError'
			});
		}

		if (result.length > 0) {
			return res.status(200).send({
				success: false,
				message: 'Пользователь с такой почтой уже существует'
			});
		}

		connection.query(`INSERT INTO users (id, is_admin, name, email, password, number_current_order) VALUES(NULL, 0, ?, ?, ?, 1)`, [name, email, password], (error, result) => {
			if (error) {
				return res.status(500).send({
					success: false,
					message: 'DatabaseError'
				});
			}

			connection.query(`SELECT * FROM users WHERE name=? AND email=? AND password=?`, [name, email, password], (error, result) => {
				if (error) {
					return res.status(500).send({
						success: false,
						message: 'DatabaseError'
					});
				}

				req.session.user = result[0];
				return res.status(200).send({
					success: true,
					message: 'Успешная регистрация'
				});
			});
		});
	});
});

module.exports = router;
