$(document).ready(() => {
	$('.box-link').on('click', function(event) {
		
	});

	// $('.dish-button').on('click', function(event) {
	// 	event.stopPropagation();
	// 	event.preventDefault();
	// 	$(this).closest('.info-button-container').find('.quantity-button').removeClass('button-hidden');
	// 	$(this).addClass('button-hidden');
	// 	$('.notification-dot').removeClass('button-hidden');
	// 	$(this).closest('.info-button-container').find('.quantity').text('1');
	// });

	// $('.dish-button-go-to-auth').on('click', function(event) {
    //     event.stopPropagation();
    //     event.preventDefault();
    //     window.location.href = '/auth';
    // });

	// $('.decrement').on('click', function() {
	// 	let amount = $(this).closest('.quantity-button').find('.quantity');
	// 	if (parseInt(amount.text()) == 1) {
	// 		$(this).closest('.quantity-button').addClass('button-hidden');
	// 		$(this).closest('.info-button-container').find('.dish-button').removeClass('button-hidden');
	// 		$(this).closest('.info-button-container').find('.quantity').text('0');
	// 	} else {
	// 		amount.text(parseInt(amount.text()) - 1);
	// 	}
	// });

	// $('.increment').on('click', function() {
	// 	let amount = $(this).closest('.quantity-button').find('.quantity');
	// 	amount.text(parseInt(amount.text()) + 1);
	// });

	// $(window).on('beforeunload', function() {
	// 	let data = [];
	// 	$('.box-link').each(function() {
	// 		let id = $(this).find('input[type="hidden"]').val();
	// 		let quantity = $(this).find('.quantity').text();
	// 		data.push({ 
	// 			id: id, 
	// 			quantity: quantity 
	// 		});
	// 	});
	
	// 	console.log('Sending data:', data);
	
	// 	const blob = new Blob([JSON.stringify(data)], {type : 'application/json'});
	// 	navigator.sendBeacon('/saveCurrentInfo', blob);
	
	// 	console.log('Data sent');
	// });	
});