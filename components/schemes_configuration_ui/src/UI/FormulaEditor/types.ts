import { ChangeEvent, CSSProperties } from 'react';
export interface PreferenceType {
	Comment?: string;
	ID: number;
	LastModified?: string;
	Name: String;
}
export type UnitsTreeItem = {
	id: number;
	name: string;
	displayName: string;
	parentId?: number;
	isOpen: boolean;
	isLast: boolean;
};

export interface ParamsList {
	placeholder?: string | DataTabsElem;
	canCopy?: boolean;
	value: string | number;
	dropdown?: boolean;
	isTree?: boolean;
	options?: PreferenceType[] | UnitsTreeItem[];
	header?: string;
	id?: string;
	listItems?: number[];
	withUnderLine?: boolean;
	readOnly?: boolean;
	needRenderAddButton?: boolean;
	onAddClick?: (string: string) => () => void;
	isCalendar?: boolean;
	className?: string;
}
export interface FormulaEditorProps {
	className?: string;
	style?: CSSProperties;
	onSubmit: () => void;
	onCancel: () => void;
	formula?: string;
	setFormulaInputHandler: (e: ChangeEvent<HTMLInputElement>) => void;
	onSelectFormulaElement?: (element: string) => void;
	isViewModeEnabled?: boolean;
	setFormulaText?: (formulaText: string) => void;
}
export interface FormulaViewerProps {
	className?: string;
	style?: CSSProperties;
	formula?: string;
	onSelectFormulaElement?: (element: string) => void;
	setFormulaText?: (formulaText: string) => void;
}
export interface ButtonsSubmitProps {
	className?: string;
	style?: CSSProperties;
	onSubmit: () => void;
	onCancel: () => void;
}

export interface FormulaInputProps {
	className?: string;
	style?: CSSProperties;
	formulaText?: string;
	setFormulaInputHandler: (e: ChangeEvent<HTMLInputElement>) => void;
}

export type KeyboardFunction = (event: KeyboardEvent) => void;
export type UpdateFunction = (deltaTime: number) => void;

export type Vector2D = {
	x: number;
	y: number;
};

export type FormulaChar = {
	size: Vector2D;
	position: Vector2D;
	boundingBox?: number[];
	character: string;
	fontSize?: number;
	originIndex?: number;
	originLength?: number;
	color?: string;
};

export type DrawFunction = (
	canvasContext: CanvasRenderingContext2D,
	mousePosition?: Vector2D,
	activeElementCallback?: (element: string) => void,
) => void;

export interface RecalculateSize {
	recalculateSize(): void;
	getSize(): Vector2D;
	recalculatePosition(initialPosition: Vector2D): void;
	getCharacters(): FormulaChar[];
	getDecorations(): DrawFunction[];
	addDrawDecorationFunction(drawFunction: DrawFunction): void;
	areUseBaseline?: boolean;
}

export type ParseResult = {
	text: FormulaChar[];
	decorations: DrawFunction[];
};

export type Direction = 'horizontal' | 'vertical';

export type Align = 'start' | 'end' | 'center' | 'baseline' | 'midline';

export type Border = 'none' | 'top' | 'bottom' | 'left' | 'right' | 'center';

export enum Box {
	Top,
	Right,
	Bottom,
	Left,
}

export interface ButtonsBooleansProps {
	className?: string;
	style?: Record<string, string>;
	onClick?: (char: string) => void;
}

export interface ButtonsFunctionsProps {
	className?: string;
	style?: Record<string, string>;
	onClick?: (chars: string) => void;
}

export interface ButtonsSystemsProps {
	className?: string;
	style?: Record<string, string>;
	onClick?: (char: string) => void;
}

export enum DataTab {
	Argument,
	Data,
}
export enum DataTabsElem {
	Channel = 'Канал',
	Group = 'Группа',
	Start = 'Дискрета времени',
	Before = 'Значение на',
	Date = 'Дата',
	CalendarDate = 'Дата',
	DaysOfMonth = 'Дней в мес.',
	CurrentDate = 'Дата',
	DatePart = 'Часть даты',
}

export enum DateArgumentItem {
	Input,
	Button,
	Calendar,
}
export interface DateArgumentList extends ParamsList {
	type: DateArgumentItem;
}
export enum StartDateElem {
	Month = 'MONTH',
	Shift = 'SHIFT',
	Day = 'DAY',
}

export interface ButtonsInputHistoryProps {
	className?: string;
	style?: CSSProperties;
	canUndo?: boolean;
	canRedo?: boolean;
	onUndo: () => void;
	onRedo: () => void;
}
