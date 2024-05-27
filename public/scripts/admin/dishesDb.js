$(document).ready(function() {
	$('a[name=add-button]').on('click', function() {
		$('#addDishModal').css('display', 'flex');
	});

	$('.close').on('click', function() {
		$(this).closest('.modal').css('display', 'none');
	});

	function checkFormFields() {
		let isFormValid = true;

		$('.add-form input[type="text"], .add-form textarea').each(function() {
			if ($(this).val().trim() === '') {
				isFormValid = false;
			}
		});
		$('.add-form input[type="number"]').each(function() {
			if ($(this).val().trim() === '' || parseFloat($(this).val()) <= 0) {
				isFormValid = false;
			}
		});
		if ($('.add-form input[type="file"]').val().trim() === '') {
			isFormValid = false;
		}
		return isFormValid;
	}

	$('.add-form input, .add-form textarea, .add-form input[type="file"]').on('input change', function() {
		if (checkFormFields()) {
			$('.form-button-add').prop('disabled', false);
		} else {
			$('.form-button-add').prop('disabled', true);
		}
	});

	$('.add-form').on('submit', function(e) {
		e.preventDefault();

		let formData = new FormData(this);

		console.log('1');

		$.ajax({
			url: '/addDish',
			type: 'POST',
			data: formData,
			contentType: false,
			processData: false,
			success: function(response) {
				$('#addDishModal').css('display', 'none');
				$('#messageContent').text(response.message);
				$('#messageModal').css('display', 'flex');

				$('.add-form')[0].reset();
				$('.form-button-add').prop('disabled', true);

				if (response.dish) {
					const dish = response.dish;
					const dishHtml = `
						<div class="dish-info-container">
							<input type="hidden" name="dishId" value="${dish.id}">
							<div class="button-container">
								<a name="update-button" class="dish-button">Изменить</a>
								<form action="/admin/delete/${dish.id}" method="POST" class="delete-form">
									<button type="submit" class="dish-button remove-button">Удалить</button>
								</form>
							</div>
							<div class="header-title-text">${dish.title}</div>
							<div class="image-container">
								<img src="${dish.img}" class="dish-image">
							</div>
							<div class="text-container">
								<div class="card-text-info-description">${dish.description}</div>
								<div class="nutrition-table">
									<div class="nutrition-row">
										<div class="card-text-info">Калории:</div>
										<div class="card-text-info">${dish.calories}</div>
									</div>
									<div class="nutrition-row">
										<div class="card-text-info">Белки:</div>
										<div class="card-text-info">${dish.protein}g</div>
									</div>
									<div class="nutrition-row">
										<div class="card-text-info">Жиры:</div>
										<div class="card-text-info">${dish.fat}g</div>
									</div>
									<div class="nutrition-row">
										<div class="card-text-info">Углеводы:</div>
										<div class="card-text-info">${dish.carbohydrates}g</div>
									</div>
								</div>
								<div class="additional-info">
									<div class="card-text-info">Количество: ${dish.amount}g</div>
									<div class="card-text-info">Цена: ${dish.price} ₽</div>
								</div>
							</div>
						</div>
					`;
					$('.content-container').append(dishHtml);
				}
			},
			error: function(response) {
				alert('Ошибка');
                $('#messageContent').text('Произошла ошибка. Попробуйте снова.');
                $('#messageModal').css('display', 'flex');
            }
		});
	});
});
