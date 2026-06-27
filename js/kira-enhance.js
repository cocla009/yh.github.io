/* kira 增强交互：代码块语言标签 */
(function () {
	'use strict';

	// ---------- 代码块语言标签 ----------
	function initCodeLang() {
		var blocks = document.querySelectorAll('figure.highlight');
		blocks.forEach(function (fig) {
			if (fig.querySelector('.kira-code-lang')) return;
			var lang = '';
			fig.classList.forEach(function (c) {
				if (c !== 'highlight' && !lang) lang = c;
			});
			if (!lang) return;
			var label = document.createElement('span');
			label.className = 'kira-code-lang';
			label.textContent = lang;
			fig.appendChild(label);
		});
	}

	function ready(fn) {
		if (document.readyState !== 'loading') fn();
		else document.addEventListener('DOMContentLoaded', fn);
	}

	ready(initCodeLang);
})();
