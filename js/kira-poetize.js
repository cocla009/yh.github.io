/* poetize 风格交互：打字机 + 樱花飘落 */
(function () {
	'use strict';

	// ---------- 打字机 ----------
	function initTyped() {
		var el = document.getElementById('kira-typed-text');
		var data = document.getElementById('kira-typed-data');
		if (!el || !data) return;

		var texts;
		try {
			texts = JSON.parse(data.textContent.trim());
		} catch (e) {
			texts = [];
		}
		if (!texts.length) return;

		var line = 0;
		var char = 0;
		var deleting = false;

		function tick() {
			var full = texts[line % texts.length];
			if (deleting) {
				char--;
			} else {
				char++;
			}
			el.textContent = full.substring(0, char);

			var delay = deleting ? 60 : 150;
			if (!deleting && char === full.length) {
				delay = 1800; // 打完停顿
				deleting = true;
			} else if (deleting && char === 0) {
				deleting = false;
				line++;
				delay = 400;
			}
			setTimeout(tick, delay);
		}
		tick();
	}

	// ---------- 樱花飘落 ----------
	function initSakura() {
		if (document.body.getAttribute('data-sakura') !== 'true') return;
		if (window.matchMedia && window.matchMedia('(max-width: 1000px)').matches) return;

		var petals = ['❀', '✿', '❁'];
		var max = 14;

		function spawn() {
			var span = document.createElement('span');
			span.className = 'kira-sakura';
			span.textContent = petals[Math.floor(Math.random() * petals.length)];

			var size = 10 + Math.random() * 14;
			var startX = Math.random() * window.innerWidth;
			var duration = 8000 + Math.random() * 7000;
			var drift = (Math.random() - 0.5) * 240;
			var rotate = 360 + Math.random() * 360;

			span.style.left = startX + 'px';
			span.style.fontSize = size + 'px';
			span.style.opacity = 0.4 + Math.random() * 0.5;

			document.body.appendChild(span);

			var anim = span.animate(
				[
					{ transform: 'translate(0, 0) rotate(0deg)' },
					{
						transform:
							'translate(' + drift + 'px, ' + (window.innerHeight + 80) + 'px) rotate(' + rotate + 'deg)'
					}
				],
				{ duration: duration, easing: 'linear' }
			);
			anim.onfinish = function () {
				span.remove();
			};
		}

		// Web Animations API 兜底
		if (!document.body.animate) return;
		for (var i = 0; i < max; i++) {
			setTimeout(spawn, i * 600);
		}
		setInterval(spawn, 1100);
	}

	// ---------- 点击特效（小猫 + 爱心爆裂上浮） ----------
	function initClickEffect() {
		if (!document.body.animate) return;
		var emojis = ['🐱', '🐾', '😺', '💗', '🐈', '✨'];

		document.addEventListener('click', function (e) {
			// 避免影响输入框/可编辑区域的正常点击
			var tag = (e.target && e.target.tagName) || '';
			if (tag === 'INPUT' || tag === 'TEXTAREA') return;

			var count = 4 + Math.floor(Math.random() * 3);
			for (var i = 0; i < count; i++) {
				spawnBurst(e.clientX, e.clientY, emojis);
			}
		}, false);

		function spawnBurst(x, y, pool) {
			var span = document.createElement('span');
			span.className = 'kira-click-burst';
			span.textContent = pool[Math.floor(Math.random() * pool.length)];

			var size = 14 + Math.random() * 14;
			var angle = Math.random() * Math.PI * 2;
			var dist = 40 + Math.random() * 60;
			var dx = Math.cos(angle) * dist;
			var dy = Math.sin(angle) * dist - 50; // 整体偏向上方飘
			var rotate = (Math.random() - 0.5) * 120;
			var duration = 700 + Math.random() * 500;

			span.style.left = x + 'px';
			span.style.top = y + 'px';
			span.style.fontSize = size + 'px';

			document.body.appendChild(span);

			var anim = span.animate(
				[
					{ transform: 'translate(-50%, -50%) scale(0.4) rotate(0deg)', opacity: 1 },
					{ transform: 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px)) scale(1) rotate(' + rotate + 'deg)', opacity: 0 }
				],
				{ duration: duration, easing: 'cubic-bezier(.17,.67,.42,1)' }
			);
			anim.onfinish = function () { span.remove(); };
		}
	}

	function ready(fn) {
		if (document.readyState !== 'loading') {
			fn();
		} else {
			document.addEventListener('DOMContentLoaded', fn);
		}
	}

	ready(function () {
		initTyped();
		initSakura();
		initClickEffect();
	});
})();
