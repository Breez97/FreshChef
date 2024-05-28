$(document).ready(function() {
	function showModal(message) {
		$('#messageContent').text(message);
		$('#messageModal').css('display', 'flex');
	}

	$('.auth-form.login').on('submit', function(e) {
		e.preventDefault();

		const formData = $(this).serialize();

		$.ajax({
			url: '/login',
			type: 'POST',
			data: formData,
			success: function(response) {
				if (response.success) {
					window.location.href = '/';
				} else {
					showModal(response.message);
				}
			},
			error: function() {
				showModal('Произошла ошибка. Попробуйте снова.');
			}
		});
	});

	$('.auth-form.reg').on('submit', function(e) {
		e.preventDefault();

		const formData = $(this).serialize();

		$.ajax({
			url: '/reg',
			type: 'POST',
			data: formData,
			success: function(response) {
				if (response.success) {
					window.location.href = '/';
				} else {
					showModal(response.message);
				}
			},
			error: function() {
				showModal('Произошла ошибка. Попробуйте снова.');
			}
		});
	});
	
	$('.close').on('click', function() {
		$('#messageModal').css('display', 'none');
	});

	let currentForm = $('input[name="currentForm"]').val();
	if (currentForm === 'auth') {
		$('form.reg').addClass('form-hidden');
		$('form.login').removeClass('form-hidden');
		$('a.button-auth').addClass('selected');
		$('a.button-reg').removeClass('selected');
	} else if (currentForm === 'reg') {
		$('form.login').addClass('form-hidden');
		$('form.reg').removeClass('form-hidden');
		$('a.button-auth').removeClass('selected');
		$('a.button-reg').addClass('selected');
	}
	
	function checkFields(fieldName) {
		let email = $(`form.${fieldName} input[name="email"]`).val();
		let password = $(`form.${fieldName} input[name="password"]`).val();
		let isDisabled;

		if (fieldName === 'reg') {
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
		if (fieldName === 'reg') {
			$(`form.${fieldName} input[name="name"]`).val('');
		}
		$(`form.${fieldName} .info-message`).remove();
		checkFields(fieldName);
	}

	checkFields('login');
	checkFields('reg');

	$('form.login input[name="email"], form.login input[name="password"]').on('input', function() {
		checkFields('login');
	});

	$('form.reg input[name="email"], form.reg input[name="password"], form.reg input[name="name"]').on('input', function() {
		checkFields('reg');
	});

	$('a.button-reg').on('click', function() {
		if (!$(this).hasClass('selected')) {
			$('a.button-auth').removeClass('selected');
			$(this).addClass('selected');
			resetForm('reg');
			$('form.login').addClass('form-hidden');
			$('form.reg').removeClass('form-hidden');
		}
	});

	$('a.button-auth').on('click', function() {
		if (!$(this).hasClass('selected')) {
			$('a.button-reg').removeClass('selected');
			$(this).addClass('selected');
			resetForm('login');
			$('form.reg').addClass('form-hidden');
			$('form.login').removeClass('form-hidden');
		}
	});
});
