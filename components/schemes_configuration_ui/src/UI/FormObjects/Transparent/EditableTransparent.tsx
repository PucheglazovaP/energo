import { useEffect, useState } from 'react';
import React from 'react';

import Checkbox from '../../Checkbox';
import checkbox from '../../Icon/checkbox.svg';
import {
	calculateBorderRadius,
	getTextHorizontalValue,
	getTextVerticalValue,
	getTransparentText,
} from '../utils';

import { EditTransparentProps, ParametersValue } from './types';

import styles from './Transparent.module.css';

function Transparent(props: EditTransparentProps) {
	const {
		objectValue,
		handleClick = () => {},
		className,
		isSelected,
		onContextMenu,
	} = props;
	const [position, setPosition] = useState<{
		x: number;
		y: number;
	}>({
		x: objectValue.x,
		y: objectValue.y,
	});
	const [size, setSize] = useState<{
		width: number;
		height: number;
	}>({
		width: objectValue.length,
		height: objectValue.height,
	});
	const [objectValueT, set] = useState(objectValue);

	const borderColor = isSelected ? '#FAB82E' : objectValue.color;
	const borderWidth = objectValue.border;

	const objectText = getTransparentText(objectValue);
	const textColor = objectValue.isLinkEnabled
		? '#8A2BE2'
		: objectValue.textColor;
	const textAnchor =
		ParametersValue[objectValue.alignH as keyof typeof ParametersValue];
	const textXCoord = getTextHorizontalValue(size, position, textAnchor);
	const textDominantBaseline =
		ParametersValue[objectValue.alignV as keyof typeof ParametersValue];
	const textYCoord = getTextVerticalValue(size, position, textDominantBaseline);

	const handleContextMenu = (evt: React.MouseEvent) => {
		evt.preventDefault();
		if (onContextMenu) {
			onContextMenu(evt, objectValueT);
		}
	};

	useEffect(() => {
		setPosition({ x: objectValue.x, y: objectValue.y });
		setSize({ width: objectValue.length, height: objectValue.height });
	}, [objectValue.x, objectValue.y, objectValue.length, objectValue.height]);

	useEffect(() => {
		set(objectValue);
	}, [objectValue]);

	return size.width > 0 && size.height > 0 ? (
		<g>
			<rect
				x={position.x}
				y={position.y}
				width={size.width}
				height={size.height}
				onClick={handleClick}
				className={className}
				onContextMenu={handleContextMenu}
				fill={objectValue.bkg || 'white'}
				stroke={borderColor}
				strokeWidth={borderWidth}
				rx={calculateBorderRadius(objectValue.cornerAngle)}
			/>
			<>
				<text
					textAnchor={textAnchor}
					x={textXCoord}
					y={textYCoord}
					dominantBaseline={textDominantBaseline}
					fontSize={objectValue.fontSize}
					fill={textColor}
					style={{
						whiteSpace: 'normal',
						textDecoration: objectValue.isLinkEnabled ? 'underline' : 'none',
					}}
				>
					{objectText}
				</text>
				<foreignObject
					x={position.x}
					y={position.y}
					width={size.width}
					height={size.height}
					fontSize={objectValue.fontSize}
					className={className}
					onClick={handleClick}
					onContextMenu={handleContextMenu}
				>
					<div
						className={styles.transparent}
						style={{
							width: '100%',
							height: '100%',
							backgroundColor: 'transparent',
							border: `none`,
							cursor: objectValue.gotonCode ? 'pointer' : 'default',
						}}
					></div>
				</foreignObject>
			</>
			{objectValue.checkboxMultiline && (
				<>
					<image
						x={position.x + size.width + 2}
						y={position.y + size.height / 12}
						width={size.height / 1.2}
						height={size.height / 1.2}
						href={checkbox}
					/>
					<foreignObject
						x={position.x + size.width}
						y={position.y + size.height / 12}
						width={size.height / 1.2}
						height={size.height / 1.2}
					>
						<div className={styles.checkbox_wrapper}>
							<Checkbox
								name={`${objectValue.text}-${objectValue.id}`}
								title=""
								checked={false}
								className={styles.checkbox}
								onChange={() => {}}
							/>
						</div>
					</foreignObject>
				</>
			)}
		</g>
	) : null;
}

export default Transparent;
