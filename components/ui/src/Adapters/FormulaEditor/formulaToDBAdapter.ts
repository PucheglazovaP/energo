import { FormulaElement } from '../../Store/reducers/FormulaEditorSlice/types';

function createFormulaElement({
	Ord,
	Oper = null,
	ID_Group = null,
	ID_Channel = null,
}: FormulaElement): FormulaElement {
	return { Ord, Oper, ID_Channel, ID_Group };
}

function findFirstNumberFromText(text: string) {
	const numberStart = text.indexOf('(') + 1;
	const numberEnd = text.indexOf(')');
	const elementId = text.slice(numberStart, numberEnd);
	return { elementId, sliceCount: numberEnd + 1 };
}

const simpleOperators = [')', '(', '+', '-', '/', '*', ','];
const simpleCompareOperators = ['>', '<', '='];
const caseOperators = ['case', 'when', 'then', 'and', 'or', 'end'];

export function formulaToDBAdapter(formulaText: string): FormulaElement[] {
	let buffer = [];
	let textBuffer = formulaText.replaceAll("'", "'");
	let ord = 0;
	let firstSymbol = '';
	while (textBuffer !== '') {
		textBuffer = textBuffer.trim();
		firstSymbol = textBuffer[0];
		ord += 1;

		// Группа
		if (textBuffer.indexOf('gr') === 0) {
			const { elementId, sliceCount } = findFirstNumberFromText(textBuffer);
			buffer.push(
				createFormulaElement({
					Ord: ord,
					ID_Group: Number(elementId),
				}),
			);
			textBuffer = textBuffer.slice(sliceCount);
			continue;
		}

		// Канал
		if (textBuffer.indexOf('ch') === 0) {
			const { elementId, sliceCount } = findFirstNumberFromText(textBuffer);
			buffer.push(
				createFormulaElement({
					Ord: ord,
					ID_Channel: Number(elementId),
				}),
			);
			textBuffer = textBuffer.slice(sliceCount);
			continue;
		}

		// Операторы параметрической функции
		if (firstSymbol.match(/[a-z]/)) {
			const regex = /case|when|then|and|end|or/;
			const matches = textBuffer.match(regex);
			if (matches) {
				const searchString = matches[0];
				buffer.push(
					createFormulaElement({
						Ord: ord,
						Oper: caseOperators.includes(searchString)
							? (ord !== 1 ? ' ' : '') + searchString + ' '
							: searchString,
					}),
				);
				textBuffer = textBuffer.slice(matches[0].length);
				continue;
			}
		}

		// Текстовые операторы
		if (firstSymbol.match(/[a-z]/)) {
			const regex = /\w+(?=[(\s*)])|\D/;
			const matches = textBuffer.match(regex);
			if (matches) {
				const searchString = matches[0];
				buffer.push(
					createFormulaElement({
						Ord: ord,
						Oper: searchString,
					}),
				);
				textBuffer = textBuffer.slice(matches[0].length);
			}
			continue;
		}

		// <fun> операторы
		if (firstSymbol === '<') {
			const regex = /<\w+>/;
			const matches = textBuffer.match(regex);
			if (matches) {
				buffer.push(
					createFormulaElement({
						Ord: ord,
						Oper: matches[0],
					}),
				);
				textBuffer = textBuffer.slice(matches[0].length);
				continue;
			}
		}
		// Простые символы
		if (simpleOperators.includes(firstSymbol)) {
			buffer.push(
				createFormulaElement({
					Ord: ord,
					Oper: firstSymbol,
				}),
			);
			textBuffer = textBuffer.slice(1);
			continue;
		}

		// Операторы сравнения
		if (simpleCompareOperators.includes(firstSymbol)) {
			const regex = /([<=>][<=>]?)/;
			const matches = textBuffer.match(regex);
			if (matches) {
				buffer.push(
					createFormulaElement({
						Ord: ord,
						Oper: matches[0],
					}),
				);
				textBuffer = textBuffer.slice(matches[0].length);
				continue;
			}
		}

		//Дата
		if (firstSymbol === "'") {
			const regex = /'\d{4}-\d{2}-\d{2}_\d{2}:\d{2}:\d{2}'/;
			const matches = textBuffer.match(regex);
			if (matches) {
				buffer.push(
					createFormulaElement({
						Ord: ord,
						Oper: matches[0].replace('_', ' '),
					}),
				);
				textBuffer = textBuffer.slice(matches[0].length);
				continue;
			}
		}

		//Константа
		if (firstSymbol.match(/\d/)) {
			const regex = /([0-9]+([.][0-9]*)?|[.][0-9]+)/;
			const matches = textBuffer.match(regex);
			if (matches) {
				buffer.push(
					createFormulaElement({
						Ord: ord,
						Oper: matches[0],
					}),
				);
				textBuffer = textBuffer.slice(matches[0].length);
			}
		}
	}
	return buffer;
}
