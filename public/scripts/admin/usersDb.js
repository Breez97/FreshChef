$(document).ready(function() {
	$('a[name=add-button]').on('click', function() {
		$('#addUserModal').css('display', 'flex');
	});

	$('.close').on('click', function() {
		$(this).closest('.modal').css('display', 'none');
	});

	$('.info-button').click(function() {
		$('#messageModal').css('display', 'flex');
	});

	function checkFormFieldsAddUser() {
		let isFormValid = true;

		$('#addUserModal input[type="text"], #addUserModal input[type="email"], #addUserModal input[type="password"]').each(function() {
			if ($(this).val().trim() === '') {
				isFormValid = false;
			}
		});

		if ($('#addUserModal input[name="new-password"]').val().trim().length < 5) {
			isFormValid = false;
		}

		return isFormValid;
	}

	function checkFormFieldsUpdateUser() {
		let isFormValid = true;

		$('#updateUserModal input[type="text"], #updateUserModal input[type="email"], #updateUserModal input[name="update-password"]').each(function() {
			if ($(this).val().trim() === '') {
				isFormValid = false;
			}
		});

		if ($('#updateUserModal input[name="update-password"]').val().trim().length < 5) {
			isFormValid = false;
		}

		return isFormValid;
	}

	$('#addUserModal input, #addUserModal input[type="email"], #addUserModal input[name="new-password"]').on('input change', function() {
		if (checkFormFieldsAddUser()) {
			$('#addUserModal .form-button-add').prop('disabled', false);
		} else {
			$('#addUserModal .form-button-add').prop('disabled', true);
		}
	});

	$('#updateUserModal input, #updateUserModal input[type="email"], #updateUserModal input[type="password"]').on('input change', function() {
		if (checkFormFieldsUpdateUser()) {
			$('#updateUserModal .form-button-update').prop('disabled', false);
		} else {
			$('#updateUserModal .form-button-update').prop('disabled', true);
		}
	});

	$('#addUserModal').on('submit', '.add-form', function(e) {
		e.preventDefault();

		const formData = $(this).serialize();

		$.ajax({
			url: '/addUser',
			type: 'POST',
			data: formData,
			success: function(response) {
				$('#addUserModal').css('display', 'none');
				$('#messageContent').text(response.message);
				$('#messageModal').css('display', 'flex');

				$('.add-form')[0].reset();
				$('.form-button-add').prop('disabled', true);

				if (response.user) {
					const user = response.user;
					const userHtml = `
						<div class="user-info-container">
							<input type="hidden" name="userId" value="${user.id}">
							<div class="button-container">
								<a name="update-button" class="user-button">Изменить</a>
								<form action="/admin/deleteUser/${user.id}" method="POST" class="delete-form">
									<button type="submit" class="user-button remove-button">Удалить</button>
								</form>
							</div>
							<div class="header-title-text">${user.name}</div>
							<div class="text-container">
								<div class="user-info-label">Email:</div>
								<div class="card-text-info">${user.email}</div>
								<div class="user-info-label">Пароль:</div>
								<div class="card-text-info">${user.password}</div>
								<div class="user-info-label">Администратор:</div>
								<div class="card-text-info">${user.isAdmin ? 'Да' : 'Нет'}</div>
							</div>
						</div>
					`;
					$('.content-container').append(userHtml);
				}
			},
			error: function(response) {
				$('#messageContent').text('Произошла ошибка. Попробуйте снова.');
				$('#messageModal').css('display', 'flex');
			}
		});
	});

	$('.content-container').on('click', 'a[name="update-button"]', function() {
		const userContainer = $(this).closest('.user-info-container');
		const userId = userContainer.find('input[name="userId"]').val();
		const userName = userContainer.find('.header-title-text').text();
		const userEmail = userContainer.find('.text-container .card-text-info:eq(0)').text().replace('Email: ', '');
		const userPassword = userContainer.find('.text-container .card-text-info:eq(1)').text();
		const isAdmin = userContainer.find('.text-container .card-text-info:eq(2)').text().replace('Администратор: ', '') === 'Да' ? '1' : '0';
	
		$('#updateUserModal input[name="user-id"]').val(userId);
		$('#updateUserModal input[name="update-name"]').val(userName);
		$('#updateUserModal input[name="update-email"]').val(userEmail);
		$('#updateUserModal input[name="update-password"]').val(userPassword);
		$('#updateUserModal select[name="update-is-admin"]').val(isAdmin);
	
		$('#updateUserModal').css('display', 'flex');
	});
	

	$('#updateUserModal').on('submit', '.update-form', function(e) {
		e.preventDefault();
	
		const formData = $(this).serialize();
	
		$.ajax({
			url: '/updateUser',
			type: 'POST',
			data: formData,
			success: function(response) {
				$('#updateUserModal').css('display', 'none');
				$('#messageContent').text(response.message);
				$('#messageModal').css('display', 'flex');
	
				if (response.user) {
					console.log(response.user.isAdmin);
					const user = response.user;
					const userId = user.id;
					let isAdmin = 'Да';
					if (response.user.isAdmin == 0) {
						isAdmin = 'Нет';
					}
					const userContainer = $(`input[name="userId"][value="${userId}"]`).closest('.user-info-container');
					userContainer.find('.header-title-text').text(user.name);
					userContainer.find('.card-text-info').eq(0).text(`${user.email}`);
					userContainer.find('.card-text-info').eq(1).text(`${user.password}`);
					userContainer.find('.card-text-info').eq(2).text(`${isAdmin}`);
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
		const userId = form.closest('.user-info-container').find('input[name="userId"]').val();

		$.ajax({
			url: `/admin/deleteUser/${userId}`,
			type: 'POST',
			success: function(response) {
				if (response.success) {
					form.closest('.user-info-container').remove();
					$('#messageContent').text(response.message);
					$('#messageModal').css('display', 'flex');
				} else {
					$('#messageContent').text('Не удалось удалить пользователя. Попробуйте снова.');
					$('#messageModal').css('display', 'flex');
				}
			},
			error: function(response) {
				$('#messageContent').text('Произошла ошибка. Попробуйте снова.');
				$('#messageModal').css('display', 'flex');
			}
		});
	});
});
