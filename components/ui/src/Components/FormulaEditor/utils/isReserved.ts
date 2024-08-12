import reservedWords from '../Editor/reservedWords';

export default function isReserved(character: string): boolean {
	return (
		['(', ')', ',', '/', '<', '>'].includes(character) ||
		reservedWords.includes(character.toLocaleLowerCase())
	);
}
