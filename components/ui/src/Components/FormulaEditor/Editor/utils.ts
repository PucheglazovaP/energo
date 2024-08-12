import { StringTemplate } from './types';

const TEMPLATES: StringTemplate[] = [
	{ functionName: 'gr', template: '(0)', cursorShift: 0 },
	{ functionName: 'ch', template: '(0)', cursorShift: 0 },
	{ functionName: 'asin', template: '(0)', cursorShift: 0 },
	{ functionName: 'atg', template: '(0)', cursorShift: 0 },
	{ functionName: 'acos', template: '(0)', cursorShift: 0 },
	{ functionName: 'sin', template: '(0)', cursorShift: 0 },
	{ functionName: 'cos', template: '(0)', cursorShift: 0 },
	{ functionName: 'tg', template: '(0)', cursorShift: 0 },
	{ functionName: 'case', template: 'when(0)then(0)end', cursorShift: 1 },
	{ functionName: '<fun_1>', template: '(0)', cursorShift: 0 },
	{ functionName: '<fun_2>', template: '', cursorShift: 0 },
	{ functionName: '<fun_3>', template: '', cursorShift: 0 },
	{ functionName: 'power', template: '(0,0)', cursorShift: 0 },
	{ functionName: 'sqrt', template: '(0)', cursorShift: 0 },
	{ functionName: 'square', template: '(0)', cursorShift: 0 },
	{
		functionName: '<value_start>',
		template: '()',
		cursorShift: 0,
	},
	{
		functionName: '<value_before>',
		template: '()',
		cursorShift: 0,
	},
	{
		functionName: '<days_of_month>',
		template: '()',
		cursorShift: 0,
	},
];
export function addFragmentTemplate(
	formulaText: string,
	insertCharacter: string,
): StringTemplate {
	const finalString: string = `${formulaText}${insertCharacter}`;
	if (insertCharacter === '(') {
		return { functionName: '', template: ')', cursorShift: 0 };
	}
	for (const template of TEMPLATES) {
		if (finalString.endsWith(template.functionName)) {
			return template;
		}
	}
	return {
		functionName: '',
		template: '',
		cursorShift: 0,
	};
}
