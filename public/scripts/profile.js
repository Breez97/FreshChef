$(document).ready(function() {
	function checkFields(fieldName) {
		let email = $(`form.${fieldName} input[name="email"]`).val();
		let password = $(`form.${fieldName} input[name="password"]`).val();
		let isDisabled;

		if (fieldName === 'save-form') {
			let name = $(`form.${fieldName} input[name="name"]`).val();
			isDisabled = email.trim() === '' || password.trim() === '' || password.trim().length < 5 || name.trim() === '';
		} else {
			isDisabled = email.trim() === '' || password.trim() === '';
		}

		$(`form.${fieldName} button[type="submit"]`).prop('disabled', isDisabled);
	}

	function resetForm(fieldName) {
		$(`form.${fieldName} input[name="email"]`).val('');
		$(`form.${fieldName} input[name="password"]`).val('');
		if (fieldName === 'save-form') {
			$(`form.${fieldName} input[name="name"]`).val('');
		}
		$(`form.${fieldName} .info-message`).remove();
		checkFields(fieldName);
	}

	checkFields('save-form');

	$('form.save-form input[name="email"], form.save-form input[name="password"], form.save-form input[name="name"]').on('input', function() {
		checkFields('save-form');
	});

	$('a.button-profile').on('click', function() {
		if (!$(this).hasClass('selected')) {
			$('a.button-orders').removeClass('selected');
			$(this).addClass('selected');
			$('div.orders-container').addClass('form-hidden');
			$('form.save-form').removeClass('form-hidden');
		}
	});

	$('a.button-orders').on('click', function() {
		if (!$(this).hasClass('selected')) {
			$('a.button-profile').removeClass('selected');
			$(this).addClass('selected');
			$('form.save-form').addClass('form-hidden');
			$('div.orders-container').removeClass('form-hidden');
		}
	});
});
