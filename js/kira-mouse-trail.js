/* 渐变线条鼠标拖尾特效 */
(function () {
	'use strict';

	function initMouseTrail() {
		var body = document.body;
		if (body.getAttribute('data-mouse-trail') !== 'true') return;
		if (window.matchMedia && window.matchMedia('(max-width: 1000px)').matches) return;

		var config = {
			maxTrailLength: parseInt(body.getAttribute('data-trail-length')) || 10,
			lineWidth: parseInt(body.getAttribute('data-trail-width')) || 3,
			fadeOutSpeed: parseInt(body.getAttribute('data-trail-speed')) || 1
		};

		// 解析 RGB 颜色
		function parseColor(attr) {
			var val = body.getAttribute(attr);
			if (!val) return [91, 141, 239];
			return val.split(',').map(function (v) { return parseInt(v.trim()); });
		}
		var startColor = parseColor('data-trail-start');
		var endColor = parseColor('data-trail-end');

		var canvas = document.createElement('canvas');
		canvas.style.position = 'fixed';
		canvas.style.top = '0';
		canvas.style.left = '0';
		canvas.style.width = '100%';
		canvas.style.height = '100%';
		canvas.style.pointerEvents = 'none';
		canvas.style.zIndex = '9998';
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		body.appendChild(canvas);

		var ctx = canvas.getContext('2d');
		var trail = [];
		var lastMousePosition = { x: 0, y: 0 };

		function lerpColor(a, b, amount) {
			return [
				Math.round(a[0] + amount * (b[0] - a[0])),
				Math.round(a[1] + amount * (b[1] - a[1])),
				Math.round(a[2] + amount * (b[2] - a[2]))
			];
		}

		function draw() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			for (var i = 1; i < trail.length; i++) {
				var gradientRatio = i / trail.length;
				var color = lerpColor(startColor, endColor, gradientRatio);
				ctx.beginPath();
				ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
				ctx.lineTo(trail[i].x, trail[i].y);
				ctx.strokeStyle = 'rgb(' + color[0] + ', ' + color[1] + ', ' + color[2] + ')';
				ctx.lineWidth = config.lineWidth;
				ctx.stroke();
			}
		}

		function updateTrail() {
			if (lastMousePosition.x !== 0 && lastMousePosition.y !== 0) {
				trail.push({ x: lastMousePosition.x, y: lastMousePosition.y });
			}
			if (trail.length > config.maxTrailLength) {
				trail = trail.slice(config.fadeOutSpeed);
			}
		}

		window.addEventListener('mousemove', function (e) {
			// canvas 是 position:fixed，使用 clientX/clientY 而非 pageX/pageY
			lastMousePosition.x = e.clientX;
			lastMousePosition.y = e.clientY;
		});

		function animate() {
			updateTrail();
			draw();
			requestAnimationFrame(animate);
		}
		animate();

		window.addEventListener('resize', function () {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		});
	}

	function ready(fn) {
		if (document.readyState !== 'loading') {
			fn();
		} else {
			document.addEventListener('DOMContentLoaded', fn);
		}
	}

	ready(initMouseTrail);
})();
