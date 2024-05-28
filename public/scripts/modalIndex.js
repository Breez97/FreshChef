$(document).ready(function() {
	$('.info-button').click(function() {
		$('#messageModal').css('display', 'flex');
	});

	$('.close').click(function() {
		$('#messageModal').css('display', 'none');
	});

	$(window).click(function(event) {
		if ($(event.target).is('#messageModal')) {
			$('#messageModal').css('display', 'none');
		}
	});
});
