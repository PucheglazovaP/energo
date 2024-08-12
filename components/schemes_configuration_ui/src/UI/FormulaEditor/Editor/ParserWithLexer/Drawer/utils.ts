import { FormulaChar } from '../../../types';
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
	if (children.length === 0) {
		node.height = nodeFontSize;
	}

	for (const child of children) {
		calculateNodeBoundingBox(child, initialFontSize, canvasContext);
		if (node.flow === 'horizontal') {
			node.width += child.width + paddingRootLeft + paddingRootRight;
			if (child.height > node.height) {
				node.height = child.height + paddingRootTop + paddingRootBottom;
			}
		}

		if (node.flow === 'vertical') {
			node.height += child.height + paddingRootLeft + paddingRootRight;
			if (child.width > node.width) {
				node.width = child.width + paddingRootTop + paddingRootBottom;
			}
		}
	}

	canvasContext.save();
	canvasContext.font = `${nodeFontSize}px serif`;
	for (const leaf of leafs) {
		const textMetrix: TextMetrics = canvasContext.measureText(leaf.toString());
		node.width += textMetrix.width;
	}
	canvasContext.restore();
}

export function calculateNodeBaseline(node: Node): void {
	const { children, leafs } = node;

	if (leafs.length === 0 && children.length === 0) return;

	if (children.length === 0) {
		node.baseline = node.height * 0.5;
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
	const [paddingLeft, paddingTop, , paddingBottom] = padding;

	let textFormula: FormulaChar[] = [];
	const maxBaseline = getMaxBaseline(node);

	switch (node.flow) {
		case 'vertical': {
			let topShift: number = 0;
			for (const child of children) {
				textFormula = [
					...textFormula,
					...drawFormula(
						child,
						fontSize,
						{
							x: startPosition.x + paddingLeft,
							y: startPosition.y + paddingTop + topShift,
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
				const yDelta: number = maxBaseline + paddingTop - child.baseline;
				textFormula = [
					...textFormula,
					...drawFormula(
						child,
						fontSize,
						{
							x: startPosition.x + leftShift,
							y: startPosition.y + yDelta,
						},
						canvasContext,
					),
				];
				const [childPaddingLeft, , childPaddingRight] = child.padding;
				leftShift += child.width + childPaddingLeft + childPaddingRight;
			}
		}
	}

	const maxHeight = Math.max(...node.children.map((child) => child.height));

	if (node.type === 'fraction') {
		drawFractionDecoration(node, startPosition, canvasContext);
	}

	if (node.type === 'case') {
		drawCaseDecoration(node, startPosition, canvasContext);
	}

	if (node.type === 'sqrt') {
		drawSqrtDecoration(node, startPosition, maxHeight, canvasContext);
	}

	if (leafs.length === 0) return textFormula;

	let leftShift: number = startPosition.x + paddingLeft;

	for (const leaf of leafs) {
		canvasContext.save();
		const actualFontSize: number =
			leaf.toString() === '√' ? maxHeight : fontSize * node.fontSize;
		canvasContext.font = `${actualFontSize}px serif`;
		const textMeasure: TextMetrics = canvasContext.measureText(leaf.toString());
		canvasContext.fillText(
			leaf.toString(),
			leftShift,
			startPosition.y + fontSize * node.fontSize - paddingBottom,
		);
		textFormula.push(
			...getFormulaTextMetrics(
				leaf,
				fontSize * node.fontSize,
				{
					x: leftShift,
					y: startPosition.y + fontSize * node.fontSize - paddingBottom,
				},
				leaf.originEnd,
				canvasContext,
			),
		);
		leftShift += textMeasure.width;
		canvasContext.restore();
	}
	return textFormula;
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
			},
		];
	}
	let xShift: number = 0;
	const formulaBuffer: FormulaChar[] = [];
	for (const character of text.toString()) {
		const characterMetrics: TextMetrics = canvasContext.measureText(character);
		formulaBuffer.push({
			character,
			position: { x: initialPosition.x + xShift, y: initialPosition.y },
			fontSize,
			size: { x: characterMetrics.width, y: fontSize },
			originIndex: originEnd || undefined,
		});
		xShift += characterMetrics.width;
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
	const lineMarginTop: number = 4;

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
}

function drawSqrtDecoration(
	node: Node,
	startPosition: Vector2,
	fontSize: number,
	canvasContext: CanvasRenderingContext2D,
) {
	const [rootNode, ...expressionNodes] = node.children;
	const [, paddingTop] = node.padding;
	const { leafs } = rootNode;
	const [rootSign] = leafs;
	const widthExpression: number = expressionNodes.reduce(
		(acc, node) => node.width + acc,
		0,
	);
	const rootTextMetrics: TextMetrics = canvasContext.measureText(
		rootSign.toString(),
	);
	const lineSize: number = 1.3;
	const multiplier: number = 1;
	canvasContext.fillRect(
		startPosition.x +
			rootTextMetrics.actualBoundingBoxRight -
			multiplier * lineSize * 0.7,
		startPosition.y +
			paddingTop +
			fontSize -
			rootTextMetrics.actualBoundingBoxAscent -
			0.1,
		widthExpression,
		lineSize * multiplier,
	);
	canvasContext.fillRect(
		startPosition.x +
			rootTextMetrics.actualBoundingBoxRight -
			multiplier * lineSize * 0.7 +
			widthExpression,
		startPosition.y +
			paddingTop +
			fontSize -
			rootTextMetrics.actualBoundingBoxAscent -
			0.1,
		lineSize * multiplier,
		5,
	);
}

function getMaxBaseline(node: Node): number {
	let maxBaseline: number = 0;

	for (const child of node.children) {
		if (maxBaseline < child.baseline) maxBaseline = child.baseline;
	}

	return maxBaseline;
}
