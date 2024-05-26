$(document).ready(() => {
	$('.box-link').on('click', function(event) {
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