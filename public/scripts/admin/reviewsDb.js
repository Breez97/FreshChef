$(document).ready(function() {
    $('.delete-form').submit(function(event) {
        event.preventDefault();

        const $form = $(this);
        const actionUrl = $form.attr('action');
        const $reviewContainer = $form.closest('.review-info-container');

        $.ajax({
            type: 'POST',
            url: actionUrl,
            success: function(response) {
                if (response.success) {
                    $reviewContainer.remove();

                    $('#messageContent').text(response.message);
                    $('#messageModal').css('display', 'flex');
                } else {
                    $('#messageContent').text('Ошибка при удалении отзыва');
                    $('#messageModal').css('display', 'flex');
                }
            },
            error: function() {
                $('#messageContent').text('Ошибка при удалении отзыва');
                $('#messageModal').css('display', 'flex');
            }
        });
    });

    $('.close').click(function() {
        $('#messageModal').css('display', 'none');
    });
});