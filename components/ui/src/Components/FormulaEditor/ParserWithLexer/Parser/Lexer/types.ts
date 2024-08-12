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
replaceSymbol.set(Tag.DATE_PART, ' часть даты ');
replaceSymbol.set(Tag.VALUE_START, ' дискрета времени ');
replaceSymbol.set(Tag.VALUE_BEFORE, ' значение на ');
replaceSymbol.set(Tag.START_SHIFT, ' начало смены ');
replaceSymbol.set(Tag.START_DAY, ' начало дня ');
replaceSymbol.set(Tag.START_MONTH, ' начало месяца ');
replaceSymbol.set(Tag.YEAR, ' год ');
replaceSymbol.set(Tag.QUARTER, ' квартал ');
replaceSymbol.set(Tag.MONTH, ' месяц ');
replaceSymbol.set(Tag.DAY_OF_YEAR, ' день в году ');
replaceSymbol.set(Tag.DAY, ' сутки ');
replaceSymbol.set(Tag.WEEK, ' неделя ');
replaceSymbol.set(Tag.WEEK_DAY, ' день недели ');
replaceSymbol.set(Tag.HOUR, ' час ');
replaceSymbol.set(Tag.HALF, ' 30 минут ');
replaceSymbol.set(Tag.MINUTE, ' минута ');
replaceSymbol.set(Tag.SECOND, ' секунда ');

/**
 * Определяет токен из ASCII символов
 * от 0 до 255
 */
export class Token {
	#tag: number;
	#originEnd: number | null = null;
	#length: number = 0;
	get tag() {
		return this.#tag;
	}

	get originEnd() {
		return this.#originEnd;
	}

	set originEnd(value: number | null) {
		this.#originEnd = value;
	}

	get originLength(): number {
		return this.#length;
	}

	set originLength(value: number) {
		this.#length = value;
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
	#value: string;

	get value() {
		return this.#value;
	}

	get originLength(): number {
		return String(this.#value).length;
	}

	constructor(value: string, originEnd?: number) {
		super(Tag.NUM, originEnd);
		this.#value = value;
	}

	toString(): string {
		return String(this.#value);
	}
}

export class Word extends Token {
	#lexeme: string;
	#length?: number;

	get lexeme() {
		return this.#lexeme;
	}

	get originLength(): number {
		if (this.#length) return this.#length;
		return this.#lexeme.length;
	}

	set originLength(value: number) {
		this.#length = value;
	}

	constructor(tag: number, lexeme: string, originEnd?: number) {
		super(tag, originEnd);
		this.#lexeme = lexeme;
	}

	copy(): Word {
		return new Word(this.tag, this.#lexeme, this.originEnd || undefined);
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
