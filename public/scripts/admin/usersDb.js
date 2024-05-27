$(document).ready(function() {
	$('a[name=add-button]').on('click', function() {
		$('#addUserModal').css('display', 'flex');
	});

	$('.close').on('click', function() {
		$(this).closest('.modal').css('display', 'none');
	});

	function checkFormFieldsAddUser() {
		let isFormValid = true;

		$('#addUserModal input[type="text"], #addUserModal input[type="email"], #addUserModal input[type="password"]').each(function() {
			if ($(this).val().trim() === '') {
				isFormValid = false;
			}
		});

		return isFormValid;
	}

	$('#addUserModal input, #addUserModal input[type="email"], #addUserModal input[type="password"]').on('input change', function() {
		if (checkFormFieldsAddUser()) {
			$('#addUserModal .form-button-add').prop('disabled', false);
		} else {
			$('#addUserModal .form-button-add').prop('disabled', true);
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
								<a name="update-user-button" class="user-button">Изменить</a>
								<form action="/admin/deleteUser/${user.id}" method="POST" class="delete-user-form">
									<button type="submit" class="user-button remove-button">Удалить</button>
								</form>
							</div>
							<div class="header-title-text">${user.name}</div>
							<div class="additional-info">
								<div class="card-text-info">Email: ${user.email}</div>
								<div class="card-text-info">Администратор: ${user.isAdmin ? 'Да' : 'Нет'}</div>
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
});
