import { FormulaChar } from '../types';

function getSubstringWidth(substring: FormulaChar[]): number {
	return substring.reduce((acc, character) => acc + character.size.x, 0);
}

export default getSubstringWidth;
