$(document).ready(function() {

    function updateTotalPrice() {
        let totalPrice = 0;
        $('.order-item').each(function() {
            const price = parseInt($(this).data('price'));
            const quantity = parseInt($(this).find('.quantity').val());
            totalPrice += price * quantity;
        });
        $('#total-price').text('Итоговая стоимость: ' + totalPrice + ' ₽');
    }

    function checkEmptyCart() {
        if ($('.order-item').length === 0) {
            $('.orders-list').html('<div class="header-text">Ваша корзина пуста</div>');
            $('.summary').remove();
        }
    }

    $('.increment').on('click', function() {
        let quantityInput = $(this).siblings('.quantity');
        let currentQuantity = parseInt(quantityInput.val());
        quantityInput.val(currentQuantity + 1);
        $(this).closest('.order-details').find('.main-text[name=quantity]').text('Количество: ' + (currentQuantity + 1));
        updateTotalPrice();
    });

    $('.decrement').on('click', function() {
        let quantityInput = $(this).siblings('.quantity');
        let currentQuantity = parseInt(quantityInput.val());
        if (currentQuantity > 1) {
            quantityInput.val(currentQuantity - 1);
            $(this).closest('.order-details').find('.main-text[name=quantity]').text('Количество: ' + (currentQuantity - 1));
            updateTotalPrice();
        }
    });

    $('.remove-button').on('click', function() {
        $(this).closest('.order-item').remove();
        checkEmptyCart();
        updateTotalPrice();
        let currentHeight = parseInt($('.content-container').css('height'));
        $('.content-container').css('height', currentHeight - 200);
    });

    $('#checkout-button').on('click', function() {
        const orderItems = [];
        
        $('.order-item').each(function() {
            const orderItem = {
                id: parseInt($(this).find('input[type=hidden]').val()),
                price: parseInt($(this).data('price')),
                quantity: parseInt($(this).find('.quantity').val())
            };
            orderItems.push(orderItem);
        });

        $('#successModal').css('display', 'flex');
        $('.orders-list').html('<div class="header-text">Ваша корзина пуста</div>');
        $('.summary').remove();
        $('.content-container').css('height', '300px');

        $.ajax({
            type: 'POST',
            url: '/submitOrder',
            contentType: 'application/json',
            data: JSON.stringify({ orderItems: orderItems })
        });
    });

    $('.close').on('click', function() {
        $('#successModal').css('display', 'none');
    });

    $(window).on('click', function(event) {
        if ($(event.target).is('#successModal')) {
            $('#successModal').css('display', 'none');
        }
    });

    updateTotalPrice();

    let amountOfOrders = $('.order-item');
    if (amountOfOrders.length === 0) {
        $('.content-container').css('height', '300px');
    } else {
        $('.content-container').css('height', amountOfOrders.length * 200 + 200);
    }
});
