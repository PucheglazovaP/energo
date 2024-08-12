export enum Direction {
	RIGHT = 'right',
	LEFT = 'left',
	UP = 'up',
	DOWN = 'down',
}

export interface AngleProps {
	className?: string;
	direction?: Direction;
}

export interface CloseProps {
	className?: string;
	height?: string;
	width?: string;
	color?: string;
}

export interface IconProps {
	className?: string;
	width?: number;
	height?: number;
}
