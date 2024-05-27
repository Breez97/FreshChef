const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const urlParser = bodyParser.urlencoded({ extended: false });

const connection = require('../database/database_connection.js');

router.get('/reviews', (req, res) => {
    const reviewsQuery = `
        SELECT reviews.id_user, reviews.review, reviews.theme, reviews.phone, users.name
        FROM reviews
        JOIN users ON reviews.id_user = users.id
    `;

    connection.query(reviewsQuery, (error, result) => {
        if (error) {
            return res.status(500).redirect('/');
        }
        return res.status(200).contentType('text/html').render('reviews', { 
            user: req.session.user || null,
            reviews: result
        });
    });
});

router.post('/submitReview', urlParser, (req, res) => {
	const userId = req.session.user.id;
	const phone = req.body.phone;
	const theme = req.body.theme;
	const comment = req.body.comment;

	connection.query(`SELECT name FROM users WHERE id=?`, [userId], (error, userResult) => {
		if (error) {
			return res.status(500);
		}

		const userName = userResult[0].name;

		connection.query(`INSERT INTO reviews (id, id_user, review, theme, phone) VALUES (NULL, ?, ?, ?, ?)`, [userId, comment, theme, phone], (error, result) => {
			if (error) {
				return res.status(500);
			}

			res.status(200).json({
				name: userName,
				message: 'Отзыв успешно добавлен'
			});
		});
	});
});


module.exports = router;
