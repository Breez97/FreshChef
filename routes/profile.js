const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded({ extended: false });

const connection = require('../database/database_connection.js');

router.get('/profile', (req, res) => {
	if (req.session.user) {
		const userId = req.session.user.id;

		const query = `
			SELECT orders.number_current_order, orders.id, orders.quantity, dishes.title, dishes.price, dishes.img
			FROM orders
			JOIN dishes ON orders.id_dish = dishes.id
			WHERE orders.id_user = ?
		`;

		connection.query(query, [userId], (err, results) => {
			if (err) {
				console.error('Error fetching orders: ', err);
				return res.status(500).send('Internal Server Error');
			}

			const groupedOrders = results.reduce((acc, order) => {
				const orderNumber = order.number_current_order;
				if (!acc[orderNumber]) {
					acc[orderNumber] = { items: [], total: 0 };
				}
				acc[orderNumber].items.push(order);
				acc[orderNumber].total += order.price * order.quantity;
				return acc;
			}, {});

			return res.status(200).contentType('text/html').render('profile', {
				user: req.session.user,
				orders: groupedOrders
			});
		});
	} else {
		return res.status(200).contentType('text/html').render('profile', { user: null, orders: {} });
	}
});

router.post('/save', urlParser, (req, res) => {
	let id = req.body.id;
	let name = req.body.name;
	let email = req.body.email;
	let password = req.body.password;

	const getOrderQuery = `
		SELECT orders.number_current_order, orders.id, orders.quantity, dishes.title, dishes.price, dishes.img
		FROM orders
		JOIN dishes ON orders.id_dish = dishes.id
		WHERE orders.id_user = ?
	`;

	connection.query(getOrderQuery, [id], (err, orderResults) => {
		if (err) {
			console.error('Error fetching orders: ', err);
			return res.status(500).send('Internal Server Error');
		}

		const groupedOrders = orderResults.reduce((acc, order) => {
			const orderNumber = order.number_current_order;
			if (!acc[orderNumber]) {
				acc[orderNumber] = { items: [], total: 0 };
			}
			acc[orderNumber].items.push(order);
			acc[orderNumber].total += order.price * order.quantity;
			return acc;
		}, {});

		connection.query(`SELECT * FROM users WHERE email=? AND id!=?`, [email, id], (error, result) => {
			if (error) {
				return res.status(500).redirect('/');
			}

			if (result.length > 0) {
				return res.status(301).render('profile', {
					user: req.session.user,
					message: 'Пользователь с такой почтой уже существует',
					orders: groupedOrders
				});
			}

			connection.query(`UPDATE users SET name=?, email=?, password=? WHERE id=?`, [name, email, password, id], (error, result) => {
				if (error) {
					return res.status(500).redirect('/');
				}

				connection.query(`SELECT * FROM users WHERE id=?`, [id], (error, userResult) => {
					if (error) {
						return res.status(500).redirect('/');
					}

					req.session.user = userResult[0];

					return res.status(200).contentType('text/html').render('profile', {
						user: req.session.user,
						currentUser: userResult[0],
						orders: groupedOrders
					});
				});
			});
		});
	});
});

module.exports = router;
