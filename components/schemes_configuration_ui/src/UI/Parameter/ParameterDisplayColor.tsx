import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { ChromePicker } from 'react-color';
import { Tooltip } from '@evraz/ui-kit';
import clsx from 'clsx';

import { IconCircularArrows, TransparencyIcon } from './iconEditing';
import { ParameterDisplayProps, TooltipDirection } from './types';
import { setPosition } from './utils';

import styles from './Parameter.module.css';

function ParameterDisplayColor({
	className,
	style,
	value,
	onClick = () => {},
	onResetClick,
	isHintEnabled,
}: ParameterDisplayProps) {
	const setColor = (color: string) => {
		onClick(color);
	};

	const [transparency, setTransparency] = useState(false);
	const [isModalOpen, setModalOpenState] = useState(false);
	const [color, setColorValue] = useState(value as string);

	const id = useId();
	useEffect(() => {
		if (value == null || value == '') setTransparency(true);
		else setTransparency(false);
		setColorValue(value || '');
	}, [value]);

	const colorPickerRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (colorPickerRef.current) {
			setPosition(colorPickerRef.current);
		}
	}, [colorPickerRef.current]);

	const ApplyingDefaultValues = () => {
		onResetClick && onResetClick();
	};

	return (
		<div className={clsx(styles.parameter_color, className)} style={style}>
			<div className={clsx(styles.parameter_color_display)}>
				<div className={clsx(styles.parameter_display_color, className)}>
					{transparency ? (
						<button
							className={styles.parameter_display_input}
							style={{ backgroundColor: color }}
							onClick={() => {
								setModalOpenState(!isModalOpen);
								setTransparency(false);
								if (isModalOpen) {
									setColor(color);
								}
							}}
						>
							<TransparencyIcon />
						</button>
					) : (
						<button
							className={styles.parameter_display_input}
							style={{ backgroundColor: color }}
							onClick={() => {
								setModalOpenState(!isModalOpen);
								if (isModalOpen) {
									setColor(color);
								}
							}}
						/>
					)}
					{isModalOpen && (
						<div ref={colorPickerRef} className={styles.wrapper}>
							<ChromePicker
								color={color}
								className={styles.parameter_display_color_picker}
								onChange={(color) => {
									if (color.rgb.a && color.rgb.a !== 1) {
										const alpha = color.rgb.a;
										setColorValue(
											`${color.hex}${Math.round(alpha * 255).toString(16)}`,
										);
									} else setColorValue(`${color.hex}`);
								}}
							/>
						</div>
					)}
				</div>
				{transparency ? '' : <p>{color}</p>}
			</div>
			<Tooltip
				disabled={!isHintEnabled}
				tooltip="По умолчанию"
				forceDirection={TooltipDirection.Left}
			>
				<button
					key={id}
					className={clsx(styles.param_double_lines)}
					onClick={ApplyingDefaultValues}
				>
					<IconCircularArrows />
				</button>
			</Tooltip>
		</div>
	);
}
export default ParameterDisplayColor;
