import { FormulaChar } from '../../types';
import { Tag, Token } from '../Parser/Lexer/types';
import Node from '../Parser/Node';

import { FormulaCharacter, Vector2 } from './types';

export function calculateNodeBoundingBox(
	node: Node,
	initialFontSize: number,
	canvasContext: CanvasRenderingContext2D,
): void {
	const { children = [], leafs = [], padding } = node;
	const [
		paddingRootLeft = 0,
		paddingRootTop = 0,
		paddingRootRight = 0,
		paddingRootBottom = 0,
	] = padding;
	if (children.length === 0 && leafs.length === 0) return;
	const nodeFontSize: number = initialFontSize * node.fontSize;

	node.width = paddingRootLeft + paddingRootRight;
	node.height = paddingRootTop + paddingRootBottom;

	if (leafs.length !== 0) {
		const textSize: Vector2 = getTextSize(leafs, nodeFontSize, canvasContext);
		node.height = textSize.y;
		node.width = textSize.x;
		return;
	}

	if (node.type === 'sqrt') {
		const [rootNode, expressionNode] = node.children;
		calculateNodeBoundingBox(expressionNode, nodeFontSize, canvasContext);
		const maxHeight = expressionNode.height;
		node.height = paddingRootTop + maxHeight + paddingRootBottom;
		calculateNodeBoundingBox(rootNode, maxHeight, canvasContext);
		node.width =
			paddingRootLeft +
			rootNode.width +
			expressionNode.width +
			paddingRootRight;
		return;
	}

	for (const child of children) {
		calculateNodeBoundingBox(child, nodeFontSize, canvasContext);
		if (node.flow === 'horizontal') {
			node.width += child.width;
			if (child.height > node.height) {
				node.height = paddingRootTop + child.height + paddingRootBottom;
			}
		}

		if (node.flow === 'vertical') {
			node.height += child.height;
			if (child.width > node.width) {
				node.width = paddingRootLeft + child.width + paddingRootRight;
			}
		}
	}
}

function getTextSize(
	leafs: Token[],
	fontSize: number,
	canvasContext: CanvasRenderingContext2D,
): Vector2 {
	const textSize: Vector2 = { x: 0, y: fontSize };
	canvasContext.save();
	canvasContext.font = `${fontSize}px serif`;
	for (const leaf of leafs) {
		const textMetrix: TextMetrics = canvasContext.measureText(leaf.toString());
		textSize.x += textMetrix.width;
	}
	canvasContext.restore();
	return textSize;
}

export function calculateNodeBaseline(node: Node): void {
	const { children, leafs } = node;
	const [, paddingTop = 0] = node.padding;
	if (leafs.length === 0 && children.length === 0) return;

	if (children.length === 0) {
		node.baseline = node.height * 0.5 + paddingTop;
		return;
	}

	let childIndex: number = 0;

	const halfLengthOfChildren: number = Math.ceil(children.length * 0.5);

	for (const child of children) {
		calculateNodeBaseline(child);

		if (node.flow === 'vertical' && halfLengthOfChildren > childIndex) {
			node.baseline += child.height;
			childIndex += 1;
		}

		if (node.flow === 'horizontal') {
			if (node.baseline < child.baseline) {
				node.baseline = child.baseline;
			}
		}
	}
	node.baseline += paddingTop;
}

export function convertNodeToFormulaChar(node: Node): FormulaCharacter[] {
	const startYPosition: number = getMaxBaseline(node);
	let characters: FormulaCharacter[] = [];

	let leftShift: number = 0;

	for (const child of node.children) {
		const localCharacters: FormulaCharacter[] = convertNodeToFormulaChar(child);
		const { children, leafs } = child;

		if (children.length === 0 && leafs.length === 0) return [];

		for (const leaf of leafs) {
			localCharacters.push({
				position: { x: leftShift, y: startYPosition },
				fontSize: node.fontSize,
				character: leaf.toString(),
				originIndex: leaf.originEnd || 0,
			});
		}

		characters = [...characters, ...localCharacters];

		leftShift += child.width;
	}

	return characters;
}

export function drawFormula(
	node: Node,
	fontSize: number,
	startPosition: Vector2,
	canvasContext: CanvasRenderingContext2D,
): FormulaChar[] {
	const { children = [], leafs = [], padding } = node;
	const [paddingLeft = 0, paddingTop = 0] = padding;

	let textFormula: FormulaChar[] = [];
	const maxBaseline = getMaxBaseline(node);

	if (leafs.length !== 0) {
		const [firstLeaf] = leafs;
		const actualFontSize: number =
			firstLeaf.toString() !== '√' ? fontSize : node.height;
		textFormula = [
			...textFormula,
			...drawText(
				leafs,
				actualFontSize * node.fontSize,
				{
					x: paddingLeft + startPosition.x,
					y: paddingTop + startPosition.y,
				},
				canvasContext,
			),
		];

		return textFormula;
	}

	switch (node.flow) {
		case 'vertical': {
			let topShift: number = paddingTop;
			for (const child of children) {
				textFormula = [
					...textFormula,
					...drawFormula(
						child,
						fontSize * node.fontSize,
						{
							x: startPosition.x + paddingLeft,
							y: startPosition.y + topShift,
						},
						canvasContext,
					),
				];
				topShift += child.height;
			}
			break;
		}
		default: {
			let leftShift: number = paddingLeft;
			for (const child of children) {
				const yDelta: number = maxBaseline - child.baseline + paddingTop;
				textFormula = [
					...textFormula,
					...drawFormula(
						child,
						fontSize * node.fontSize,
						{
							x: leftShift + startPosition.x,
							y: startPosition.y + yDelta,
						},
						canvasContext,
					),
				];
				const [childPaddingLeft, , childPaddingRight] = child.padding;
				leftShift += childPaddingLeft + child.width + childPaddingRight;
			}
		}
	}

	if (node.type === 'fraction') {
		drawFractionDecoration(node, startPosition, canvasContext);
	}

	if (node.type === 'case') {
		drawCaseDecoration(node, startPosition, canvasContext);
	}

	if (node.type === 'sqrt') {
		drawSqrtDecoration(node, startPosition, fontSize, canvasContext);
	}

	return textFormula;
}

function drawText(
	leafs: Token[],
	fontSize: number,
	startPosition: Vector2,
	canvasContext: CanvasRenderingContext2D,
): FormulaChar[] {
	const preparedFormulaText: FormulaChar[] = [];
	let shift = startPosition.x;
	canvasContext.save();
	canvasContext.font = `${fontSize}px serif`;
	for (const leaf of leafs) {
		const textMetrix: TextMetrics = canvasContext.measureText(leaf.toString());
		canvasContext.fillText(leaf.toString(), shift, startPosition.y + fontSize);
		preparedFormulaText.push(
			...getFormulaTextMetrics(
				leaf,
				fontSize,
				{ x: shift, y: startPosition.y + fontSize },
				leaf.originEnd,
				canvasContext,
			),
		);
		shift += textMetrix.width;
	}
	canvasContext.restore();
	return preparedFormulaText;
}

function getFormulaTextMetrics(
	text: Token,
	fontSize: number,
	initialPosition: Vector2,
	originEnd: number | null,
	canvasContext: CanvasRenderingContext2D,
): FormulaChar[] {
	if (!(text.tag === Tag.ID || 'value' in text)) {
		const wordMetrix: TextMetrics = canvasContext.measureText(text.toString());
		return [
			{
				character: text.toString(),
				position: { x: initialPosition.x, y: initialPosition.y },
				size: { x: wordMetrix.width, y: fontSize },
				fontSize,
				originIndex: originEnd || undefined,
				originLength: text.originLength,
			},
		];
	}
	let xShift: number = 0;
	const formulaBuffer: FormulaChar[] = [];
	let originIndex: number | undefined =
		originEnd != null ? originEnd - text.originLength + 1 : undefined;
	for (const character of text.toString()) {
		const characterMetrics: TextMetrics = canvasContext.measureText(character);
		formulaBuffer.push({
			character,
			position: { x: initialPosition.x + xShift, y: initialPosition.y },
			fontSize,
			size: { x: characterMetrics.width, y: fontSize },
			originIndex,
		});
		xShift += characterMetrics.width;
		if (originIndex != null) {
			originIndex += 1;
		}
	}
	return formulaBuffer;
}

function drawFractionDecoration(
	node: Node,
	startPosition: Vector2,
	canvasContext: CanvasRenderingContext2D,
) {
	const [numerator, denumerator] = node.children;
	const lineWidth: number = Math.max(numerator.width, denumerator.width);
	const lineHeight: number = 2;
	const lineMarginTop: number = 8;

	canvasContext.fillRect(
		startPosition.x,
		startPosition.y + numerator.height + lineMarginTop,
		lineWidth,
		lineHeight,
	);
}

function drawCaseDecoration(
	node: Node,
	startPosition: Vector2,
	canvasContext: CanvasRenderingContext2D,
) {
	const maxHeight: number = node.children.reduce(
		(max, child) => max + child.height,
		0,
	);
	const lineMarginTop: number = 6;
	const lineWidth: number = 2;

	canvasContext.fillRect(
		startPosition.x,
		startPosition.y + lineMarginTop,
		lineWidth,
		maxHeight - lineMarginTop,
	);
	canvasContext.save();
	canvasContext.strokeStyle = '#cccccc';
	canvasContext.strokeRect(
		startPosition.x,
		startPosition.y,
		node.width + 15,
		node.height,
	);
	canvasContext.restore();
}

function drawSqrtDecoration(
	node: Node,
	startPosition: Vector2,
	fontSize: number,
	canvasContext: CanvasRenderingContext2D,
) {
	const [rootNode, expressionNodes] = node.children;
	const [, paddingTop] = node.padding;
	const { leafs } = rootNode;
	const [rootSign] = leafs;
	const widthExpression: number = expressionNodes.width;
	canvasContext.save();
	canvasContext.font = `${rootNode.height}px serif`;
	const rootTextMetrics: TextMetrics = canvasContext.measureText(
		rootSign.toString(),
	);
	const margin: number =
		rootTextMetrics.actualBoundingBoxRight - rootTextMetrics.width;
	const lineSize: number = 1;
	const multiplier: number = node.height / fontSize;
	canvasContext.fillRect(
		startPosition.x +
			rootTextMetrics.actualBoundingBoxRight -
			multiplier * lineSize,
		startPosition.y +
			paddingTop +
			rootNode.height -
			rootTextMetrics.actualBoundingBoxAscent +
			lineSize,
		widthExpression - margin,
		lineSize * multiplier,
	);
	canvasContext.fillRect(
		startPosition.x +
			rootTextMetrics.actualBoundingBoxRight -
			multiplier * lineSize +
			widthExpression -
			margin,
		startPosition.y +
			paddingTop +
			rootNode.height -
			rootTextMetrics.actualBoundingBoxAscent +
			lineSize,
		lineSize * multiplier,
		5,
	);
	canvasContext.restore();
}

function getMaxBaseline(node: Node): number {
	let maxBaseline: number = 0;

	for (const child of node.children) {
		if (maxBaseline < child.baseline) maxBaseline = child.baseline;
	}

	return maxBaseline;
}
