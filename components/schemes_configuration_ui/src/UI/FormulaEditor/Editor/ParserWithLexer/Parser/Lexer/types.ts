import { isDate } from './utils';

export enum Tag {
	NUM = 256,
	ID,
	TRUE,
	FALSE,
	AND,
	OR,
	LTE,
	GTE,
	NOTEQUAL,
	CASE,
	WHEN,
	THEN,
	END,
	SIN,
	COS,
	TG,
	ASIN,
	ACOS,
	ATG,
	SIGN,
	FUN_1,
	FUN_2,
	FUN_3,
	VALUE_BEFORE,
	VALUE_START,
	DATE_PART,
	DAY_OF_MONTH,
	EMPTY,
	SQRT,
	POWER,
	SQUARE,
	CHANEL,
	GROUP,
	YEAR,
	QUARTER,
	MONTH,
	DAY_OF_YEAR,
	DAY,
	WEEK,
	WEEK_DAY,
	HOUR,
	MINUTE,
	SECOND,
	HALF,
	START_SHIFT,
	START_DAY,
	START_MONTH,
}

const replaceSymbol: Map<number, string> = new Map();

replaceSymbol.set('*'.charCodeAt(0), ' × ');
replaceSymbol.set(Tag.LTE, ' ≤ ');
replaceSymbol.set(Tag.GTE, ' ≥ ');
replaceSymbol.set(','.charCodeAt(0), ', ');
replaceSymbol.set(Tag.FUN_1, 'P');
replaceSymbol.set(Tag.GROUP, 'Гр');
replaceSymbol.set(Tag.CHANEL, 'К');
replaceSymbol.set('-'.charCodeAt(0), ' – ');
replaceSymbol.set('+'.charCodeAt(0), ' + ');
replaceSymbol.set('<'.charCodeAt(0), ' < ');
replaceSymbol.set('>'.charCodeAt(0), ' > ');
replaceSymbol.set(Tag.AND, ' и ');
replaceSymbol.set(Tag.OR, ' или ');
replaceSymbol.set('='.charCodeAt(0), ' = ');
replaceSymbol.set(Tag.NOTEQUAL, ' ≠ ');
replaceSymbol.set(Tag.FUN_3, ' дней в мес ');
replaceSymbol.set(Tag.FUN_2, ' дата ');
replaceSymbol.set(Tag.SQRT, '√');
replaceSymbol.set('/'.charCodeAt(0), ' ÷ ');

/**
 * Определяет токен из ASCII символов
 * от 0 до 255
 */
export class Token {
	#tag: number;
	#originEnd: number | null = null;

	get tag() {
		return this.#tag;
	}

	get originEnd() {
		return this.#originEnd;
	}

	set originEnd(value: number | null) {
		this.#originEnd = value;
	}

	constructor(tag: number, originEnd?: number) {
		this.#tag = tag;
		// тернарник так как || не корректно сработает с 0
		this.#originEnd = originEnd != null ? originEnd : null;
	}

	toString(): string {
		const output: string | undefined = replaceSymbol.get(this.#tag);
		if (output == null) return String.fromCharCode(this.#tag);
		return output;
	}
}

export class Num extends Token {
	#value: number;

	get value() {
		return this.#value;
	}

	constructor(value: number, originEnd?: number) {
		super(Tag.NUM, originEnd);
		this.#value = value;
	}

	toString(): string {
		return String(this.#value);
	}
}

export class Word extends Token {
	#lexeme: string;

	get lexeme() {
		return this.#lexeme;
	}

	constructor(tag: number, lexeme: string, originEnd?: number) {
		super(tag, originEnd);
		this.#lexeme = lexeme;
	}

	toString(): string {
		const value = replaceSymbol.get(this.tag);
		if (isDate(this.#lexeme)) {
			const isoDateString: string = this.#lexeme.replace(/(\s|_)/, 'T');
			const isoDate: Date = new Date(isoDateString);
			const formatter = Intl.DateTimeFormat(undefined, {
				dateStyle: 'short',
				timeStyle: 'medium',
			});
			return formatter.format(isoDate);
		}
		if (value == null) return this.#lexeme;
		return value;
	}
}
