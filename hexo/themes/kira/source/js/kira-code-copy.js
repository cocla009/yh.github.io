window.addEventListener('DOMContentLoaded', () => {
	const codeBlocks = document.querySelectorAll('figure.highlight');
	if (!codeBlocks.length) return;

	const addCopyButton = function (codeBlock) {
		const copyWrapper = document.createElement('div');
		copyWrapper.setAttribute('class', 'kira-codeblock-copy-wrapper');

		let copiedTimeout = null;

		copyWrapper.addEventListener('click', () => {
			// 兼容两种高亮结构：
			// 1) 表格式 figure.highlight > table > td.code（Hexo 默认）
			// 2) 直接 <code> 元素
			// 用闭包里的 codeBlock(figure) 作为根，避免依赖不稳定的 ev.target
			const codeSource = codeBlock.querySelector('td.code') || codeBlock.querySelector('code');
			if (!codeSource) return;

			let copiedCode = '';

			(function traverseChildNodes(node) {
				const childNodes = node.childNodes;
				childNodes.forEach((child) => {
					switch (child.nodeName) {
						case '#text':
							copiedCode += child.nodeValue;
							break;
						case 'BR':
							copiedCode += '\n';
							break;
						default:
							traverseChildNodes(child);
					}
				});
			})(codeSource);

			navigator.clipboard
				.writeText(
					// 去掉最后的换行
					copiedCode.replace(/\n$/, '')
				)
				.then(() => {
					if (!!copiedTimeout) clearTimeout(copiedTimeout);

					copyWrapper.classList.add('kira-codeblock-copy-wrapper-copied');
					copiedTimeout = setTimeout(() => {
						copyWrapper.classList.remove('kira-codeblock-copy-wrapper-copied');
						copiedTimeout = null;
					}, 1500);
				});
		});
		codeBlock.appendChild(copyWrapper);
	};

	codeBlocks.forEach(addCopyButton);
});
