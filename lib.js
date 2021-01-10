const svgNode = (name) =>
	document.createElementNS('http://www.w3.org/2000/svg', name);

const svgLine = (x1, y1, x2, y2) => {
	const lineNode = svgNode('line');

	lineNode.setAttribute('x1', x1);
	lineNode.setAttribute('y1', y1);

	lineNode.setAttribute('x2', x2);
	lineNode.setAttribute('y2', y2);

	return lineNode;
};

const svgText = (text, x, y, horizAlign, vertAlign) => {
	const textNode = svgNode('text');

	textNode.textContent = text;

	textNode.setAttribute('x', x);
	textNode.setAttribute('y', y);

	if (horizAlign) textNode.setAttribute('text-anchor', horizAlign);
	if (vertAlign) textNode.setAttribute('dominant-baseline', vertAlign);

	return textNode;
};

const svgRect = (x, y, width, height) => {
	const rectNode = svgNode('rect');

	rectNode.setAttribute('x', x);
	rectNode.setAttribute('y', y);

	rectNode.setAttribute('width', width);
	rectNode.setAttribute('height', height);

	return rectNode;
};

const svgCirc = (x, y, r) => {
	const circNode = svgNode('circle');

	circNode.setAttribute('cx', x);
	circNode.setAttribute('cy', y);

	circNode.setAttribute('r', r);

	return circNode;
};
