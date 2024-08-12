import { MouseEvent, useRef, useState } from 'react';
import { Color } from 'react-color';
import clsx from 'clsx';

import ColorPickerPane from './ColorPickerPane';
import { ColorPickerPosition } from './types';

import styles from './ColorPicker.module.css';

type ColorPickerProps = {
	className?: string;
	onChange: (color: Color) => void;
	uncontrolled?: boolean;
	initColor?: string; // Only hex
};

const INIT_COLOR: string = 'ffffff';

function ColorPicker(props: ColorPickerProps) {
	const {
		className,
		uncontrolled = true,
		onChange,
		initColor = INIT_COLOR,
	} = props;

	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [coords, setCoords] = useState<ColorPickerPosition>({
		x: 0,
		y: 0,
	});

	const btnRef = useRef<HTMLButtonElement>(null);

	const handleClose = (color: Color) => {
		setIsOpen(false);
		onChange(color);
	};

	const handleOpen = (evt: MouseEvent<HTMLButtonElement>) => {
		setIsOpen(true);
		setCoords({ x: evt.clientX, y: evt.clientY });
	};

	return (
		<>
			<button
				className={clsx('button__empty', styles.picker, className)}
				style={{ background: initColor }}
				onClick={handleOpen}
				ref={btnRef}
			></button>
			<ColorPickerPane
				isOpen={isOpen}
				coordinates={coords}
				initColor={initColor}
				onClose={handleClose}
				onChange={uncontrolled ? undefined : onChange}
			/>
		</>
	);
}

export default ColorPicker;
