/* Shared script for project pages: parallax hero + image lightbox. */
(function ($) {
	var $window = $(window), $body = $('body'), $hero = $('#hero');

	$window.on('load', function () {
		window.setTimeout(function () { $body.removeClass('is-preload'); }, 100);
	});

	// Parallax: background lags slightly behind the page. Off for reduced motion, phones, and the "Pause motion" setting.
	var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (!reduceMotion && !browser.mobile && browser.name != 'ie') {
		$window.on('scroll', function () {
			if (document.documentElement.classList.contains('a11y-nomotion')) { $hero.css('background-position', '0 0, 0 0'); return; }
			$hero.css('background-position', '0 0, 0 ' + (-100 + $window.scrollTop() * 0.3) + 'px');
		}).triggerHandler('scroll');
	}

	// Lightbox: caption comes from data-caption, falling back to the <h3> under the image.
	$window.on('load', function () {
		$('.page').poptrox({
			caption: function ($a) { return $a.data('caption') || $a.next('h3').text(); },
			overlayColor: '#2c2c2c',
			overlayOpacity: 0.85,
			popupCloserText: '',
			popupLoaderText: '',
			selector: '.work-item a.image',
			usePopupCaption: true,
			usePopupDefaultStyling: false,
			usePopupEasyClose: false,
			usePopupNav: true,
			windowMargin: (window.innerWidth <= 736 ? 0 : 50)
		});
	});
})(jQuery);
