const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const multer = require('multer');
const urlParser = bodyParser.urlencoded({ extended: false });
const path = require('path');

const connection = require('../database/database_connection.js');
const { error } = require('console');

router.get('/admin', (req, res) => {
	if (req.session.user && req.session.user.is_admin == 1) {
		return res.status(200).render('admin/admin', {
			user: req.session.user,
		})
	} else {
		return res.status(200).redirect('/logout');
	}
});

router.get('/dishesDb', (req, res) => {
	if (req.session.user) {
		const query = `
			SELECT *
			FROM dishes
			JOIN dish_info ON dishes.id = dish_info.id_dish
		`;
		connection.query(query, (error, result) => {
			if (error) {
				return res.status(500).redirect('/');
			}
			return res.status(200).render('admin/dishesDatabase', {
				user: req.session.user,
				dishes: result,
			})
		});
	} else {
		return res.status(200).redirect('/logout');
	}
});

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '..', 'public', 'img', 'dishes'));
	},
	filename: function (req, file, cb) {
		cb(null, Date.now() + '-' + file.originalname);
	}
});

const upload = multer({ storage: storage });

router.post('/addDish', upload.single('new-image'), (req, res) => {
	const {
		'new-title': title,
		'new-short-description': shortDescription,
		'new-amount': amount,
		'new-price': price,
		'new-description': description,
		'new-calories': calories,
		'new-fat': fat,
		'new-carbohydrates': carbohydrates,
		'new-protein': protein
	} = req.body;

	const imgPath = `/img/dishes/${req.file.filename}`;

	connection.query(`SELECT * FROM dishes WHERE title=?`, [title], (error, result) => {
		if (error) {
			return res.status(500).send({
				message: 'DatabaseError'
			});
		}
		if (result.length > 0) {
			return res.status(200).send({
				message: 'Такое блюдо уже есть в базе данных',
			});
		} else {
			connection.query(`INSERT INTO dishes (id, title, short_description, img, amount, price, total_quantity) VALUES (NULL, ?, ?, ?, ?, ?, 0)`, [title, shortDescription, imgPath, amount, price], (error, result) => {
				if (error) {
					return res.status(500).send({
						message: 'DatabaseError'
					});
				}
				connection.query(`SELECT * FROM dishes WHERE title=?`, [title], (error, result) => {
					if (error) {
						return res.status(500).send({
							message: 'DatabaseError'
						});
					}
					let dishId = result[0].id;
					connection.query(`INSERT INTO dish_info (id, id_dish, description, calories, fat, carbohydrates, protein) VALUES (NULL, ?, ?, ?, ?, ?, ?)`, [dishId, description, calories, fat, carbohydrates, protein], (error, result) => {
						if (error) {
							return res.status(500).send({
								message: 'DatabaseError'
							});
						}
						return res.status(200).send({
							message: `Блюдо ${title} было успешно добавлено`,
							dish: {
                                id: dishId,
                                title,
                                shortDescription,
                                img: imgPath,
                                amount,
                                price,
                                description,
                                calories,
                                fat,
                                carbohydrates,
                                protein
                            }
						});
					});
				})
			})
		}
	});
});

module.exports = router;
