getPhotos();

$('.btn-scroll').click(() => {
	if ($('.photos-container').is(':visible')) {
		$('html, body').animate({
			scrollTop: $('.photos-container').offset().top
		}, 1000);
	} else {
		$('html, body').animate({
			scrollTop: $('body').height()
		}, 1000);
	}
});

$('.photos-container').change(() => {
	if ($('.photos-container').is(':visible')) {
		$('html, body').animate({
			scrollTop: $('.photos-container').offset().top
		}, 1000);
	}
});

$('.btn-more').click(() => {
	if (!(countRowForShow >= $('.row').length)) {
		$('html, body').animate({
			scrollTop: $('.row').eq(countRowForShow - 1).offset().top
		}, 1000);

		countRowForShow += plusForRowShow;
		renderPhotos(photos);
	}
});