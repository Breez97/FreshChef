$(document).ready(() => {
	$('.box-link').on('click', function(event) {
		event.preventDefault();
	});

	$('.dish-button').on('click', function(event) {
		event.stopPropagation();
		event.preventDefault();
		$(this).closest('.info-button-container').find('.quantity-button').removeClass('button-hidden');
		$(this).addClass('button-hidden');
		$('.notification-dot').removeClass('button-hidden');
	});

	$('.decrement').on('click', function() {
		let amount = $(this).closest('.quantity-button').find('.quantity');
		if (parseInt(amount.text()) == 1) {
			$(this).closest('.quantity-button').addClass('button-hidden');
			$(this).closest('.info-button-container').find('.dish-button').removeClass('button-hidden');
		} else {
			amount.text(parseInt(amount.text()) - 1);
		}
	});

	$('.increment').on('click', function() {
		let amount = $(this).closest('.quantity-button').find('.quantity');
		amount.text(parseInt(amount.text()) + 1);
	});
});