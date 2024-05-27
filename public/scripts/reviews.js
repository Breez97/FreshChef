$(document).ready(function() {
	function validateForm() {
		if ($('input[name=phone]').val().trim() === "" || $('textarea[name=message]').val().trim() === "") {
			$('.submit-button').prop('disabled', true);
		} else {
			$('.submit-button').prop('disabled', false);
		}
	}

	$('button.go-to-auth').on('click', function(event) {
		event.preventDefault();
		window.location.href = '/auth';
	});

	$('.close').on('click', function() {
		$('#successModal').css('display', 'none');
	});

	$(window).on('click', function(event) {
		if ($(event.target).is('#successModal')) {
			$('#successModal').css('display', 'none');
		}
	});

	$('input[name=phone]').on('input', validateForm);
	$('textarea[name=message]').on('input', validateForm);

	validateForm();

	$('button.submit-button:not(.go-to-auth)').on('click', function(event) {
		event.preventDefault();
	
		let phoneNumber = $('.feedback-form').find('input[name=phone]').val();
		let choosedTheme = $('.feedback-form').find('select[name=subject]').val();
		let comment = $('.feedback-form').find('textarea[name=message]').val();
	
		let phonePattern = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
		if (!phonePattern.test(phoneNumber)) {
			$('#successModal').css('display', 'flex');
			$('#successModal').find('p').text('Неверный формат номера телефона. Пожалуйста, используйте формат +7(000)000-00-00');
			return;
		}
	
		let theme = 'Отзыв';
		switch (choosedTheme) {
			case 'question':
				theme = 'Вопрос';
				break;
			case 'proposal':
				theme = 'Предложение';
				break;
			case 'complaint':
				theme = 'Жалоба';
				break;
			default:
				break;
		}
	
		$.ajax({
			type: 'POST',
			url: '/submitReview',
			data: {
				phone: phoneNumber,
				theme: theme,
				comment: comment
			},
			success: function(data) {
				let userName = data.name;
	
				$('input[name="phone"]').val('');
				$('select[name="subject"]').val('review');
				$('textarea[name="message"]').val('');
	
				$('#successModal').css('display', 'flex');
				let infoText = 'Ваш отзыв размещен. Спасибо!';
				if (theme === 'Вопрос') {
					infoText = 'Ваш вопрос размещен. Спасибо!';
				} else if (theme === 'Предложение') {
					infoText = 'Ваше предложение размещено. Спасибо!';
				} else if (theme === 'Жалоба') {
					infoText = 'Ваша жалоба размещена. Спасибо!';
				}
				$('#successModal').find('p').text(infoText);
	
				let newReview = $('<div class="review"></div>');
				let newReviewHeader = $('<div class="review-header"></div>');
				newReviewHeader.append($(`<div class="review-header-text">${theme}</div>`));
				newReviewHeader.append($(`<div class="review-header-text">${userName}</div>`));
				newReviewHeader.append($(`<div class="review-main-text">${phoneNumber}</div>`));
				newReview.append(newReviewHeader);
				newReview.append($(`<div class="review-message">${comment}</div>`));
				$('.reviews-container').append(newReview);
			},
			error: function(xhr, status, error) {
				console.error('Ошибка при отправке формы:', error);
			}
		});
	});
});
