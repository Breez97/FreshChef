$(document).ready(function() {
	$('.close').on('click', function() {
		$(this).closest('.modal').css('display', 'none');
	});

	$('#profileForm').on('submit', function(e) {
        e.preventDefault();

        const formData = $(this).serialize();

        $.ajax({
            url: '/save',
            type: 'POST',
            data: formData,
            success: function(response) {
                $('#messageContent').text(response.message);
                $('#messageModal').css('display', 'flex');

                if (response.user) {
					$('#profileForm input[name="name"]').val(response.user.name);
					$('#profileForm input[name="email"]').val(response.user.email);
					$('#profileForm input[name="password"]').val('');
                }
            },
            error: function(response) {
                $('#messageContent').text('Произошла ошибка. Попробуйте снова.');
                $('#messageModal').css('display', 'flex');
            }
        });
    });

    $('.close').on('click', function() {
        $('#messageModal').css('display', 'none');
    });

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
			$('div.orders-container').addClass('field-hidden');
			$('div.input-form').removeClass('field-hidden');
		}
	});

	$('a.button-orders').on('click', function() {
		if (!$(this).hasClass('selected')) {
			$('a.button-profile').removeClass('selected');
			$(this).addClass('selected');
			$('div.input-form').addClass('field-hidden');
			$('div.orders-container').removeClass('field-hidden');
		}
	});

	$('.logout-button').on('click', function() {
		$.ajax({
			method: 'POST',
			url: '/logout',
			success: function() {
				window.location.href = '/auth';
			}
		});
	});
});
