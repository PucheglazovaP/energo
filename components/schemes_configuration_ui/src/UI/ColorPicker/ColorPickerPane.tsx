import { CSSProperties, useState } from 'react';
import { Color, ColorChangeHandler, SketchPicker } from 'react-color';
import { createPortal } from 'react-dom';
import clsx from 'clsx';

import { ColorPickerPosition } from './types';

import styles from './ColorPicker.module.css';

type ColorPickerPaneProps = {
	isOpen: boolean;
	initColor: Color;
	coordinates: ColorPickerPosition;
	onChange?: (color: Color) => void; // if picker is controllable
	onClose: (color: Color) => void;
};

const PANE_WIDTH: number = 225;
const PANE_HEIGHT: number = 300;

// TODO: add 'type' prop and bind it to the 'Color' type
// to return not only color in hex, but in any of available
function ColorPickerPane(props: ColorPickerPaneProps) {
	const { isOpen, initColor, onChange, onClose, coordinates } = props;

	const [color, setColor] = useState<Color>(initColor);

	const handleChange: ColorChangeHandler = (color) => {
		setColor(color.hex);
		if (onChange) {
			onChange(color.rgb);
		}
	};

	const handleClose = () => {
		onClose(color);
	};

	const getStyles = (): CSSProperties => {
		let left: number = coordinates.x;
		let top: number = coordinates.y + PANE_HEIGHT;
		const { screenX, screenY } = window;
		if (left + PANE_WIDTH > screenX) {
			left = left - PANE_WIDTH;
		}
		if (top > screenY) {
			top = top - PANE_HEIGHT;
		}
		return {
			left: `${left}px`,
			top: `${top}px`,
		};
	};

	if (!isOpen) {
		return null;
	}

	return createPortal(
		<div className={styles.pane} style={getStyles()}>
			<button
				className={clsx('button__empty', styles.cover)}
				onClick={handleClose}
			/>
			<SketchPicker color={color} onChange={handleChange} />
		</div>,
		document.getElementById('root') || document.body,
	);
}

export default ColorPickerPane;
