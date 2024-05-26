const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded({ extended: false });

const connection = require('../database/database_connection.js');

router.use(express.json());

router.get('/shopping_bag', (req, res) => {
	const userId = req.session.user.id;
	
	const query = `
		SELECT orders.*, dishes.title, dishes.short_description, dishes.price, dishes.img
		FROM orders
		JOIN dishes ON orders.id_dish = dishes.id
		WHERE orders.id_user = ? AND orders.is_finished = 0
	`;

	connection.query(query, [userId], (error, result) => {
		if (error) {
			return res.status(500).json({ error: 'Internal server error' });
		}
		return res.status(200).render('shopping_bag', {
			user: req.session.user,
			orders: result,
		});
	});
});

router.post('/submitOrder', urlParser, (req, res) => {
	const orderItems = req.body.orderItems;
	const userId = req.session.user.id;
	
	connection.query(`SELECT * FROM users WHERE id=?`, [userId], (error, result) => {
		if (error) {
			return res.status(500).redirect('/');
		}
		let numberCurrentOrder = result[0].number_current_order;
		orderItems.forEach(item => {
			connection.query(`UPDATE orders SET quantity=?, is_finished=1 WHERE id_user=? AND id_dish=? AND number_current_order=?`, [item.quantity, userId, item.id, numberCurrentOrder], (error, result) => {
				if (error) {
					return res.status(500).redirect('/');
				}
			});
			connection.query(`SELECT * FROM dishes WHERE id=?`, [item.id], (error, result) => {
				if (error) {
					return res.status(500).redirect('/');
				}
				let quantity = result[0].total_quantity + item.quantity;
				connection.query(`UPDATE dishes SET total_quantity=? WHERE id=?`, [quantity, item.id], (error, result) => {
					if (error) {
						return res.status(500).redirect('/');
					}
				});
			});
		});
		numberCurrentOrder += 1;
		connection.query(`UPDATE users SET number_current_order=? WHERE id=?`, [numberCurrentOrder, userId], (error, result) => {
			if (error) {
				return res.status(500).redirect('/');
			}
		});
	});

    res.sendStatus(200);
});

module.exports = router;
