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
        cb(null, 'public/img/dishes');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
	const allowedTypes = /jpeg|jpg|png|gif/;
	const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
	const mimetype = allowedTypes.test(file.mimetype);
	if (extname && mimetype) {
		return cb(null, true);
	} else {
		cb(new Error('Error: Images Only!'));
	}
};

const upload = multer({
	storage: storage,
	fileFilter: fileFilter
});

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

router.post('/updateDish', upload.single('update-image'), (req, res) => {
	const {
		'dish-id': dishId,
		'update-title': title,
		'update-short-description': shortDescription,
		'update-amount': amount,
		'update-price': price,
		'update-description': description,
		'update-calories': calories,
		'update-fat': fat,
		'update-carbohydrates': carbohydrates,
		'update-protein': protein,
		'old-image-path': oldImgPath
	} = req.body;

	let imgPath = oldImgPath;

	if (req.file) {
		imgPath = `/img/dishes/${req.file.filename}`;
	}

	connection.query(`SELECT * FROM dishes WHERE title=? AND id!=?`, [title, dishId], (error, result) => {
		if (error) {
			return res.status(500).send({
				success: false,
				message: 'DatabaseError'
			});
		}
		if(result.length > 0) {
			return res.status(200).send({
				success: false,
				message: 'Такое блюдо уже есть в базе данных'
			});
		}
		connection.query(`UPDATE dishes SET title=?, short_description=?, img=?, amount=?, price=? WHERE id=?`, 
		[title, shortDescription, imgPath, amount, price, dishId], (error, result) => {
		if (error) {
			return res.status(500).send({
				success: false,
				message: 'DatabaseError'
			});
		}
		connection.query(`UPDATE dish_info SET description=?, calories=?, fat=?, carbohydrates=?, protein=? WHERE id_dish=?`, 
			[description, calories, fat, carbohydrates, protein, dishId], (error, result) => {
			if (error) {
				return res.status(500).send({
					success: false,
					message: 'DatabaseError'
				});
			}
			return res.status(200).send({
				success: true,
				message: `Блюдо ${title} было успешно обновлено`,
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
				},
				isImageChanged: !!req.file
			});
		});
	});
	})
});

router.post('/admin/delete/:id', (req, res) => {
	const dishId = req.params.id;

	connection.query(`DELETE FROM dishes WHERE id = ?`, [dishId], (error, result) => {
		if (error) {
			return res.status(500).send({
				success: false,
				message: 'DatabaseError'
			});
		}

		return res.status(200).send({
			success: true,
			message: 'Блюдо успешно удалено'
		});
	});
});

module.exports = router;
