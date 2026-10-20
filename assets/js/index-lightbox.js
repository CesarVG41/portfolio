/* Index page: adds a "Learn More" button to the lightbox caption, matching the clicked project. */
(function () {
	var links = {};
	document.querySelectorAll('#two .work-item').forEach(function (art) {
		var h = art.querySelector('h3'), a = art.querySelector('ul.actions a');
		if (h && a) { links[h.textContent.trim()] = a.getAttribute('href'); }
	});
	function add() {
		var cap = document.querySelector('.poptrox-popup .caption');
		if (!cap || cap.querySelector('.lm')) return;
		var href = links[cap.textContent.trim()];
		if (!href) return;
		var a = document.createElement('a');
		a.className = 'button lm'; a.href = href; a.textContent = 'Learn More';
		cap.appendChild(a);
	}
	new MutationObserver(add).observe(document.body, { childList: true, subtree: true, characterData: true });
})();
