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
			console.error('Database error:', error);
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
		return res.status(200).contentType('text/html').render('info', { 
			user: req.session.user,
			info: info,
		});
	} else {
		return res.status(200).contentType('text/html').render('info', { 
			user: null,
			info: info,
		});
	}
});

module.exports = router;
