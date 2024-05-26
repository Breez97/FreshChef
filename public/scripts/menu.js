$(document).ready(function() {
	// $('#sort-select').change(function() {
	// 	let sortBy = $(this).val();

	// 	if (sortBy === 'default') {
	// 		$('.dish-box-container.hidden').removeClass('hidden');
	// 	} else {
	// 		$('.dish-box-container').addClass('hidden');
	// 	}

	// 	let dishBlocks = $('.box-link').toArray();

	// 	dishBlocks.sort(function(a, b) {
	// 		let priceA = parseFloat($(a).find('.info-dish-price-text').text());
	// 		let priceB = parseFloat($(b).find('.info-dish-price-text').text());
	// 		return sortBy === 'asc' ? priceA - priceB : priceB - priceA;
	// 	});

	// 	let dishBoxContainer = $('.content-container');

	// 	if (sortBy !== 'default') {
	// 		dishBoxContainer.find('.dish-box-container').remove();
	// 	} else {
	// 		dishBoxContainer.find('.dish-box-container:not(.hidden)').remove();
	// 	}

	// 	for (let i = 0; i < dishBlocks.length; i += 3) {
	// 		let chunk = dishBlocks.slice(i, i + 3);
	// 		let row = $('<div class="dish-box-container"></div>');
	// 		row.append(chunk);
	// 		dishBoxContainer.append(row);
	// 	}
	// });

	let originalContainers = $('.dish-box-container').clone();
	let boxLinks = $('.box-link').toArray();

	$('#search-input').on('input', function() {
		let query = $(this).val().toLowerCase();
		$('.dish-box-container').remove();
	
		if (query === '') {
			$('.content-container').append(originalContainers);
		} else {
			let newContainers = [];
			let currentBoxes = [];
			for (let i = 0; i < boxLinks.length; i++) {
				let dishTitle = $(boxLinks[i]).find('.header-dish-text').text().toLowerCase();
				if (dishTitle.includes(query)) {
					currentBoxes.push(boxLinks[i]);
				}
			}
	
			let newDishBoxContainer = $('<div class="dish-box-container"></div>');
			for (let i = 0; i < currentBoxes.length; i++) {
				newDishBoxContainer.append(currentBoxes[i]);
				if ((i + 1) % 3 === 0 || i === currentBoxes.length - 1) {
					newContainers.push(newDishBoxContainer);
					newDishBoxContainer = $('<div class="dish-box-container"></div>');
				}
			}
	
			for (let i = 0; i < newContainers.length; i++) {
				$('.content-container').append(newContainers[i]);
			}
		}
	});
	
	$('#show-all-button').click(function() {
		$('.dish-box-container').remove();
		$('.content-container').append(originalContainers);
		$('#search-input').val('');
	});	

	$('.content-container').on('click', '.box-link', function(event) {
		let id = $(this).find('input[type="hidden"]').val();

		$.ajax({
			type: 'POST',
			url: '/getInfo',
			data: JSON.stringify({ id: id }),
			contentType: 'application/json',
			success: function(response) {
				window.location.href = '/info';
			},
			error: function(xhr, status, error) {
				console.error('Ошибка при отправке запроса:', error);
			}
		});
	});
});
