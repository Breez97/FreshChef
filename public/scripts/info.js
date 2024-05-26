$(document).ready(function() {
	$('.auth-button').on('click', function() {
		window.location.href = '/auth';
	});

	$(document).on('click', '.add-button', function() {
		let dishId = $(this).closest('.dish-info-container').find('input[type=hidden]').val();
		$(this).addClass('remove-button').removeClass('add-button').text('Убрать из корзины');
		$.ajax({
			method: 'POST',
			url: '/addToBag',
			data: { dishId: dishId }
		});
	});

	$(document).on('click', '.remove-button', function() {
		let dishId = $(this).closest('.dish-info-container').find('input[type=hidden]').val();
		$(this).addClass('add-button').removeClass('remove-button').text('Добавить в корзину');
		$.ajax({
			method: 'POST',
			url: '/removeFromBag',
			data: { dishId: dishId }
		});
	});
});
