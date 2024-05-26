const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded({ extended: false });

const connection = require('../database/database_connection.js');

router.post('/getInfo', urlParser, (req, res) => {
	const id = req.body.id;

	connection.query(`
		SELECT dishes.*, dish_info.* 
		FROM dishes 
		INNER JOIN dish_info ON dishes.id = dish_info.id_dish 
		WHERE dishes.id = ?
	`, [id], (error, result) => {
		if (error) {
			return res.status(500).json({ error: 'Internal server error' });
		}

		if (req.session) {
			req.session.info = result;
		}

		res.status(200).json({ message: 'Data fetched successfully' });
	});
});

router.get('/info', (req, res) => {
	const info = req.session.info || [];

	if (req.session.user) {
		const userId = req.session.user.id;
		const dishId = info[0].id;

		connection.query(`SELECT * FROM orders WHERE id_user=? AND id_dish=? AND is_finished=0`, [userId, dishId], (error, result) => {
			if (error) {
				return res.status(500).json({ error: 'Internal server error' });
			}

			let isAdded = false;
			if (result.length !== 0) {
				isAdded = true;
			}
			return res.status(200).contentType('text/html').render('info', { 
				user: req.session.user,
				info: info,
				isAdded: isAdded
			});
		});
	} else {
		return res.status(200).contentType('text/html').render('info', { 
			user: null,
			info: info,
			isAdded: false,
		});
	}
});

router.post('/addToBag', urlParser, (req, res) => {
	const userId = req.session.user.id;
	const dishId = req.body.dishId;

	connection.query(`SELECT * FROM users WHERE id=?`, [userId], (error, result) => {
		if (error) {
			return res.status(500).json({ error: 'Internal server error' });
		}
		
		let numberCurrentOrder = result[0].number_current_order;
		connection.query(`INSERT INTO orders (id, id_user, id_dish, quantity, number_current_order, is_finished) VALUES (NULL, ?, ?, 1, ?, 0)`, [userId, dishId, numberCurrentOrder], (error, result) => {
			if (error) {
				return res.status(500).json({ error: 'Internal server error' });
			}
	
			return res.status(200).json({ success: true });
		});
	});
});

router.post('/removeFromBag', urlParser, (req, res) => {
	const userId = req.session.user.id;
	const dishId = req.body.dishId;

	connection.query(`DELETE FROM orders WHERE id_user=? AND id_dish=?`, [userId, dishId], (error, result) => {
		if (error) {
			return res.status(500).json({ error: 'Internal server error' });
		}

		return res.status(200).json({ success: true });
	});
});

module.exports = router;
