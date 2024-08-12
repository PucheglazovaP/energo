function* transformTextToCharacters(text: string): Generator<string> {
	for (
		let cursorPosition = 0;
		cursorPosition < text.length;
		cursorPosition += 1
	) {
		const character = text[cursorPosition] || '';

		if (character === ' ' || character === '') {
			continue;
		}

		yield character;
	}
}

export default transformTextToCharacters;
