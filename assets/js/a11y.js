/* Accessibility panel, skip link and lightbox labels. Shared by every page. */
(function () {
	var KEY = 'a11y-prefs-v1', root = document.documentElement, SIZES = [0.85, 1, 1.15, 1.3, 1.5],
		p = { size: 1, contrast: false, dark: false, font: false, motion: false };

	try {
		var saved = JSON.parse(localStorage.getItem(KEY) || 'null');
		if (saved) { for (var k in p) { if (k in saved) p[k] = saved[k]; } }
		else if (window.matchMedia) {
			p.contrast = matchMedia('(prefers-contrast: more)').matches;
			p.motion = matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
	} catch (e) {}

	function mk(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text) n.textContent = text; return n; }

	function apply() {
		root.style.setProperty('--ts', SIZES[p.size]);
		root.classList.toggle('a11y-contrast', p.contrast);
		root.classList.toggle('a11y-dark', p.dark);
		root.classList.toggle('a11y-font', p.font);
		root.classList.toggle('a11y-nomotion', p.motion);
		if (p.motion && window.jQuery) { jQuery(window).off('scroll.strata_parallax'); jQuery('#header').css('background-position', ''); }
		if (sizeLabel) sizeLabel.textContent = 'Text size: ' + Math.round(SIZES[p.size] * 100) + '%';
		toggles.forEach(function (t) { t.btn.setAttribute('aria-pressed', String(!!p[t.key])); });
		try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {}
	}

	/* Skip link */
	var target = document.getElementById('content') || document.getElementById('main');
	if (target) {
		target.setAttribute('tabindex', '-1');
		var skip = mk('a', 'skip-link', 'Skip to main content'); skip.href = '#' + target.id;
		document.body.insertBefore(skip, document.body.firstChild);
	}

	/* Panel */
	var toggles = [], sizeLabel = mk('span', 'a11y-size'),
		open = mk('button', 'a11y-toggle', 'Accessibility'),
		panel = mk('div', 'a11y-panel');
	open.type = 'button'; open.setAttribute('aria-expanded', 'false'); open.setAttribute('aria-controls', 'a11y-panel');
	panel.id = 'a11y-panel'; panel.hidden = true; panel.setAttribute('role', 'group'); panel.setAttribute('aria-label', 'Accessibility settings');
	sizeLabel.setAttribute('aria-live', 'polite');

	function btn(label, fn, aria) { var b = mk('button', '', label); b.type = 'button'; if (aria) b.setAttribute('aria-label', aria); b.addEventListener('click', fn); return b; }
	function addToggle(label, key) { var b = btn(label, function () { p[key] = !p[key]; apply(); }); b.setAttribute('aria-pressed', 'false'); toggles.push({ btn: b, key: key }); panel.appendChild(b); }

	var sizeRow = mk('div', 'a11y-row');
	sizeRow.appendChild(btn('A\u2212', function () { p.size = Math.max(0, p.size - 1); apply(); }, 'Decrease text size'));
	sizeRow.appendChild(sizeLabel);
	sizeRow.appendChild(btn('A+', function () { p.size = Math.min(SIZES.length - 1, p.size + 1); apply(); }, 'Increase text size'));
	panel.appendChild(sizeRow);
	addToggle('High contrast', 'contrast'); addToggle('Dark mode', 'dark'); addToggle('Readable font', 'font'); addToggle('Pause motion', 'motion');
	panel.appendChild(btn('Reset to defaults', function () { p = { size: 0, contrast: false, dark: false, font: false, motion: false }; apply(); }));

	function setOpen(v) { panel.hidden = !v; open.setAttribute('aria-expanded', String(v)); }
	open.addEventListener('click', function () { setOpen(panel.hidden); });
	document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) { setOpen(false); open.focus(); } });
	document.body.appendChild(open); document.body.appendChild(panel);
	apply();

	/* Lightbox: label and keyboard-enable the close and arrow controls once poptrox creates them */
	var labels = { '.closer': 'Close image', '.nav-next': 'Next image', '.nav-previous': 'Previous image' };
	function label() {
		for (var sel in labels) {
			var n = document.querySelector('.poptrox-popup ' + sel);
			if (n && !n.getAttribute('role')) {
				n.setAttribute('role', 'button'); n.setAttribute('tabindex', '0'); n.setAttribute('aria-label', labels[sel]);
				n.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.click(); } });
			}
		}
	}
	new MutationObserver(label).observe(document.body, { childList: true, subtree: true });
})();
