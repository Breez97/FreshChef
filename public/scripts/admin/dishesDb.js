$(document).ready(function() {
	$('a[name=add-button]').on('click', function() {
		$('#addDishModal').css('display', 'flex');
	});

	$('.close').on('click', function() {
		$(this).closest('.modal').css('display', 'none');
	});

	function checkFormFieldsAdd() {
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

	function checkFormFieldsUpdate() {
		let isFormValid = true;

		$('.update-form input[type="text"], .update-form textarea').each(function() {
			if ($(this).val().trim() === '') {
				isFormValid = false;
			}
		});
		$('.update-form input[type="number"]').each(function() {
			if ($(this).val().trim() === '' || parseFloat($(this).val()) <= 0) {
				isFormValid = false;
			}
		});
		return isFormValid;
	}

	$('.add-form input, .add-form textarea, .add-form input[type="file"]').on('input change', function() {
		if (checkFormFieldsAdd()) {
			$('.form-button-add').prop('disabled', false);
		} else {
			$('.form-button-add').prop('disabled', true);
		}
	});

	$('.update-form input, .update-form textarea').on('input change', function() {
		if (checkFormFieldsUpdate()) {
			$('.form-button-update').prop('disabled', false);
		} else {
			$('.form-button-update').prop('disabled', true);
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
                $('#messageContent').text('Произошла ошибка. Попробуйте снова.');
                $('#messageModal').css('display', 'flex');
            }
		});
	});

	$('.content-container').on('click', 'a[name="update-button"]', function() {
		const dishContainer = $(this).closest('.dish-info-container');
		const dishId = dishContainer.find('input[name="dishId"]').val();
		const dishTitle = dishContainer.find('.header-title-text').text();
		const shortDescription = dishContainer.find('.card-text-info-description').text();
		const imgSrc = dishContainer.find('.image-container img').attr('src');
		const calories = dishContainer.find('.card-text-info:eq(1)').text().replace('g', '');
		const protein = dishContainer.find('.card-text-info:eq(3)').text().replace('g', '');
		const fat = dishContainer.find('.card-text-info:eq(5)').text().replace('g', '');
		const carbohydrates = dishContainer.find('.card-text-info:eq(7)').text().replace('g', '');
		const amount = dishContainer.find('.additional-info .card-text-info:eq(0)').text().replace('Количество: ', '').replace('g', '');
		const price = dishContainer.find('.additional-info .card-text-info:eq(1)').text().replace('Цена: ', '').replace(' ₽', '');

		$('#updateDishModal input[name="dish-id"]').val(dishId);
		$('#updateDishModal input[name="update-title"]').val(dishTitle);
		$('#updateDishModal input[name="update-short-description"]').val(shortDescription);
		$('#updateDishModal input[name="update-amount"]').val(amount);
		$('#updateDishModal input[name="update-price"]').val(price);
		$('#updateDishModal textarea[name="update-description"]').val(shortDescription);
		$('#updateDishModal input[name="update-calories"]').val(calories);
		$('#updateDishModal input[name="update-fat"]').val(fat);
		$('#updateDishModal input[name="update-carbohydrates"]').val(carbohydrates);
		$('#updateDishModal input[name="update-protein"]').val(protein);
		$('#updateDishModal input[name="old-image"]').val(imgSrc);

		$('#updateDishModal').css('display', 'flex');
    });

	$('.update-form').on('submit', function(e) {
		e.preventDefault();
		
		let formData = new FormData(this);
	
		const newImgFile = $('#updateDishModal input[name="update-image"]')[0].files[0];
		const oldImgPath = $('#updateDishModal input[name="old-image"]').val();
	
		formData.append('old-image-path', oldImgPath);
	
		$.ajax({
			url: '/updateDish',
			type: 'POST',
			data: formData,
			contentType: false,
			processData: false,
			success: function(response) {
				if (response.success) {
					$('#updateDishModal').css('display', 'none');
					$('#messageContent').text(response.message);
					$('#messageModal').css('display', 'flex');
					const updatedDish = response.dish;
					const dishContainer = $(`input[name="dishId"][value="${updatedDish.id}"]`).closest('.dish-info-container');
					dishContainer.find('.header-title-text').text(updatedDish.title);
					dishContainer.find('.card-text-info-description').text(updatedDish.description);
					if (response.isImageChanged) {
						dishContainer.find('.image-container img').attr('src', updatedDish.img);
					}
					dishContainer.find('.card-text-info:eq(1)').text(`${updatedDish.calories}g`);
					dishContainer.find('.card-text-info:eq(3)').text(`${updatedDish.protein}g`);
					dishContainer.find('.card-text-info:eq(5)').text(`${updatedDish.fat}g`);
					dishContainer.find('.card-text-info:eq(7)').text(`${updatedDish.carbohydrates}g`);
					dishContainer.find('.additional-info .card-text-info:eq(0)').text(`Количество: ${updatedDish.amount}g`);
					dishContainer.find('.additional-info .card-text-info:eq(1)').text(`Цена: ${updatedDish.price} ₽`);
				} else {
					$('#messageContent').text(response.message);
					$('#messageModal').css('display', 'flex');
				}
			},
			error: function(response) {
				$('#messageContent').text('Произошла ошибка. Попробуйте снова.');
				$('#messageModal').css('display', 'flex');
			}
		});
	});

	$('.content-container').on('submit', '.delete-form', function(e) {
        e.preventDefault();

        const form = $(this);
        const dishId = form.closest('.dish-info-container').find('input[name="dishId"]').val();

        $.ajax({
            url: `/admin/delete/${dishId}`,
            type: 'POST',
            success: function(response) {
                form.closest('.dish-info-container').remove();
                $('#messageContent').text('Блюдо успешно удалено');
                $('#messageModal').css('display', 'flex');
            },
            error: function(response) {
                $('#messageContent').text('Произошла ошибка при удалении блюда. Попробуйте снова.');
                $('#messageModal').css('display', 'flex');
            }
        });
    });
});
