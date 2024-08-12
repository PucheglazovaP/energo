import { Cursor } from '../../../Editor/Cursor';
import {
	isDigit,
	isDot,
	isDoubleQuote,
	isEqual,
	isGt,
	isLetter,
	isLt,
	isSinglQuote,
} from '../utils';

import { Num, Tag, Token, Word } from './types';
import { hasNextReservedWord } from './utils';

export default class Lexer {
	#reserved: Map<string, Word> = new Map<string, Word>();
	#cursor: Cursor;
	#reserve(word: Word) {
		this.#reserved.set(word.lexeme, word);
	}

	constructor(cursor: Cursor) {
		this.#cursor = cursor;
		this.#reserve(new Word(Tag.TRUE, 'true'));
		this.#reserve(new Word(Tag.FALSE, 'false'));
		this.#reserve(new Word(Tag.AND, 'and'));
		this.#reserve(new Word(Tag.OR, 'or'));
		this.#reserve(new Word(Tag.CASE, 'case'));
		this.#reserve(new Word(Tag.WHEN, 'when'));
		this.#reserve(new Word(Tag.THEN, 'then'));
		this.#reserve(new Word(Tag.END, 'end'));
		this.#reserve(new Word(Tag.SIN, 'sin'));
		this.#reserve(new Word(Tag.COS, 'cos'));
		this.#reserve(new Word(Tag.TG, 'tg'));
		this.#reserve(new Word(Tag.ASIN, 'asin'));
		this.#reserve(new Word(Tag.ACOS, 'acos'));
		this.#reserve(new Word(Tag.ATG, 'atg'));
		this.#reserve(new Word(Tag.SIGN, 'sign'));
		this.#reserve(new Word(Tag.FUN_1, 'fun_1'));
		this.#reserve(new Word(Tag.FUN_2, 'fun_2'));
		this.#reserve(new Word(Tag.FUN_3, 'fun_3'));
		this.#reserve(new Word(Tag.VALUE_BEFORE, 'value_before'));
		this.#reserve(new Word(Tag.VALUE_START, 'value_start'));
		this.#reserve(new Word(Tag.DATE_PART, 'date_part'));
		this.#reserve(new Word(Tag.DAY_OF_MONTH, '_day_of_month'));
		this.#reserve(new Word(Tag.EMPTY, 'empty'));
		this.#reserve(new Word(Tag.SQRT, 'sqrt'));
		this.#reserve(new Word(Tag.POWER, 'power'));
		this.#reserve(new Word(Tag.SQUARE, 'square'));
		this.#reserve(new Word(Tag.CHANEL, 'ch'));
		this.#reserve(new Word(Tag.GROUP, 'gr'));
		this.#reserve(new Word(Tag.YEAR, 'year'));
		this.#reserve(new Word(Tag.QUARTER, 'quarter'));
		this.#reserve(new Word(Tag.MONTH, 'month'));
		this.#reserve(new Word(Tag.DAY_OF_YEAR, '_day_of_year'));
		this.#reserve(new Word(Tag.DAY, 'day'));
		this.#reserve(new Word(Tag.WEEK, 'week'));
		this.#reserve(new Word(Tag.WEEK_DAY, '_week_day'));
		this.#reserve(new Word(Tag.HOUR, 'hour'));
		this.#reserve(new Word(Tag.MINUTE, 'minute'));
		this.#reserve(new Word(Tag.SECOND, 'second'));
		this.#reserve(new Word(Tag.HALF, 'half'));
		this.#reserve(new Word(Tag.START_SHIFT, 'start_shift'));
		this.#reserve(new Word(Tag.START_DAY, 'start_day'));
		this.#reserve(new Word(Tag.START_MONTH, 'start_month'));
		this.#reserve(new Word(Tag.GTE, '>='));
		this.#reserve(new Word(Tag.LTE, '<='));
		this.#reserve(new Word(Tag.NOTEQUAL, '<>'));
	}

	*scan(input: string): Generator<Token> {
		for (let charIndex = 0; charIndex < input.length; charIndex += 1) {
			let peek: string = input[charIndex];
			if (peek === ' ' || peek === '\t') continue;

			if (isGt(peek)) {
				const nextPeek: string | undefined = input[charIndex + 1];
				if (nextPeek != null && isEqual(nextPeek)) {
					const gte: Word = this.#reserved.get('>=')?.copy()!;
					gte.originEnd = charIndex + 1;
					yield gte;
					charIndex += 1;

					// Компенсация курсора при уменьшении количества символов в знаке ≥
					if (this.#cursor.charPrevPosition?.character.trim() === '>')
						this.#cursor.left();

					continue;
				}
				yield new Token(peek.charCodeAt(0), charIndex);
				continue;
			}

			if (isLt(peek)) {
				const nextPeek: string | undefined = input[charIndex + 1];
				if (nextPeek != null && isEqual(nextPeek)) {
					const lte: Word = this.#reserved.get('<=')?.copy()!;
					lte.originEnd = charIndex + 1;
					yield lte;
					charIndex += 1;

					// Компенсация курсора при уменьшении количества символов в знаке ≤
					if (this.#cursor.charPrevPosition?.character.trim() === '<')
						this.#cursor.left();

					continue;
				}

				if (nextPeek != null && isGt(nextPeek)) {
					const ne: Word = this.#reserved.get('<>')?.copy()!;
					ne.originEnd = charIndex + 1;
					yield ne;
					charIndex += 1;

					// Компенсация курсора при уменьшении количества символов в знаке ≠
					if (this.#cursor.charPrevPosition?.character.trim() === '<')
						this.#cursor.left();
					continue;
				}

				if (hasNextReservedWord(input, charIndex + 1)) {
					const endWordIndex: number = input.indexOf('>', charIndex);
					const reservedWord = input.slice(charIndex, endWordIndex + 1);
					const word: Word | undefined = this.#reserved.get(
						reservedWord.replace(/<|>/g, ''),
					);
					if (word == null) {
						yield new Word(Tag.ID, reservedWord, endWordIndex);
						charIndex += reservedWord.length;
						continue;
					}
					word.originEnd = endWordIndex;
					word.originLength = reservedWord.length;
					yield word;
					charIndex += reservedWord.length - 1;
					continue;
				}
				yield new Token(peek.charCodeAt(0), charIndex);
				continue;
			}

			if (isDigit(peek)) {
				let numberValue: string = '';
				do {
					numberValue += peek;
					if (!isDigit(input[charIndex + 1])) break;
					charIndex += 1;
					peek = input[charIndex];
				} while (isDigit(peek));

				const nextPeek: string | undefined = input[charIndex + 1];
				if (nextPeek == null || (nextPeek != null && !isDot(nextPeek))) {
					yield new Num(numberValue, charIndex);
					continue;
				}

				charIndex += 1;
				peek = input[charIndex];

				numberValue += peek;

				while (isDigit(input[charIndex + 1])) {
					charIndex += 1;
					peek = input[charIndex];
					numberValue += peek;
				}
				yield new Num(numberValue, charIndex);
				continue;
			}

			if (isSinglQuote(peek) || isDoubleQuote(peek)) {
				let stringBuffer: string = '';
				const startQuoteMark: string = peek;
				do {
					charIndex += 1;
					peek = input[charIndex];
					if (startQuoteMark === peek) break;
					stringBuffer += peek;
				} while (1);

				yield new Word(Tag.ID, stringBuffer, charIndex);
				continue;
			}

			if (isLetter(peek)) {
				let stringBuffer: string = '';
				let reservedWord: Word | undefined;
				do {
					stringBuffer += peek;
					if (stringBuffer == 'day') {
						const nextLetter: string | undefined = input[charIndex + 1];
						if (nextLetter === 's' || nextLetter === '_') {
							charIndex += 1;
							peek = input[charIndex];
							continue;
						}
					}
					reservedWord = this.#reserved.get(stringBuffer)?.copy();
					if (reservedWord != null) {
						reservedWord.originEnd = charIndex;
						break;
					}
					const nextPeek: string | undefined = input[charIndex + 1];
					if (
						nextPeek == null ||
						(nextPeek != null && !isLetter(nextPeek) && !isDigit(nextPeek))
					)
						break;
					charIndex += 1;
					peek = input[charIndex];
				} while (isLetter(peek) || isDigit(peek));
				if (reservedWord != null) yield reservedWord;
				else yield new Word(Tag.ID, stringBuffer, charIndex);
				continue;
			}

			yield new Token(peek.charCodeAt(0), charIndex);
		}
	}
}
