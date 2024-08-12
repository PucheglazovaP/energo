export type Vector2 = {
	x: number;
	y: number;
};

export type FormulaCharacter = {
	position: Vector2;
	fontSize: number;
	character: string;
	originIndex: number;
};

export type FormulaChar = {
	size: Vector2;
	position: Vector2;
	boundingBox?: number[];
	character: string;
	fontSize?: number;
	originIndex?: number;
	originLength?: number;
	color?: string;
};
