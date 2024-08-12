import React, { useEffect, useState } from 'react';

import Checkbox from '../../Checkbox';
import checkbox from '../../Icon/checkbox.svg';
import checkedCheckbox from '../../Icon/checkedCheckbox.svg';
import {
	calculateBorderRadius,
	getEmergencyEventsCountLabel,
	getTextHorizontalValue,
	getTextVerticalValue,
	getTransparentText,
} from '../utils';

import { ParametersValue, TransparentProps } from './types';

import styles from './Transparent.module.css';

function Transparent(props: TransparentProps) {
	const {
		objectValue,
		handleClick = () => {},
		className,
		handleSelect = () => {},
		isSelected = false,
		validate,
		onContextMenu,
		onMouseMove,
		onMouseLeave,
		onEmergencyButtonClick,
		isEmergencyEventsModeEnabled,
	} = props;
	const [isChecked, setCheckedStatus] = useState(false);
	const handleCheckboxChange = () => {
		setCheckedStatus(!isChecked);
		handleSelect(!isChecked);
	};

	useEffect(() => {
		setCheckedStatus(isSelected);
	}, [isSelected]);

	const result = validate
		? validate(objectValue)
		: { backgroundColor: objectValue.bkg, textColor: objectValue.textColor };

	const emergencyEventsCount =
		objectValue.numberOfInternalEmergencyEvents ||
		objectValue.numberOfOwnEmergencyEvents ||
		0;

	const emergencyEventsCountLabel =
		getEmergencyEventsCountLabel(emergencyEventsCount);

	const isEmergencyEventsInfoVisible =
		isEmergencyEventsModeEnabled &&
		objectValue.metricId &&
		objectValue.showAlerts &&
		emergencyEventsCount;
	const emergencyEventsCountColor = objectValue.numberOfInternalEmergencyEvents
		? '#e32213'
		: '#EB5835';
	const emergencyEventsXCoord =
		objectValue.x +
		objectValue.length +
		(objectValue.checkboxMultiline ? objectValue.height : 0);

	const objectText = getTransparentText(objectValue);
	const textColor = objectValue.isLinkEnabled
		? '#8A2BE2'
		: objectValue.textColor;
	const textAnchor =
		ParametersValue[objectValue.alignH as keyof typeof ParametersValue];
	const textXCoord = getTextHorizontalValue(
		{ width: objectValue.length, height: objectValue.height },
		{ x: objectValue.x, y: objectValue.y },
		textAnchor,
	);
	const textDominantBaseline =
		ParametersValue[objectValue.alignV as keyof typeof ParametersValue];
	const textYCoord = getTextVerticalValue(
		{ width: objectValue.length, height: objectValue.height },
		{ x: objectValue.x, y: objectValue.y },
		textDominantBaseline,
	);

	const handleContextMenu = (evt: React.MouseEvent) => {
		evt.preventDefault();
		if (onContextMenu) {
			onContextMenu(evt, objectValue);
		}
	};

	const handleMouseEnter = (evt: React.MouseEvent) => {
		evt.preventDefault();
		evt.stopPropagation();
		onMouseMove && onMouseMove(evt, objectValue);
	};

	const handleMouseLeave = (evt: React.MouseEvent) => {
		evt.preventDefault();
		evt.stopPropagation();
		onMouseLeave && onMouseLeave(evt, objectValue);
	};
	const handleEmergencyButtonClick = (evt: React.MouseEvent) => {
		evt.preventDefault();
		evt.stopPropagation();
		onEmergencyButtonClick && onEmergencyButtonClick(objectValue);
	};
	if (objectValue.length < 0 || objectValue.height < 0) return null;
	return (
		<g>
			<rect
				x={objectValue.x}
				y={objectValue.y}
				width={objectValue.length}
				height={objectValue.height}
				onClick={handleClick}
				className={className}
				onContextMenu={handleContextMenu}
				onMouseMove={handleMouseEnter}
				onMouseLeave={handleMouseLeave}
				fill={result.backgroundColor}
				stroke={objectValue.color}
				strokeWidth={objectValue.border}
				rx={calculateBorderRadius(objectValue.cornerAngle)}
				style={{
					cursor:
						objectValue.gotonCode || objectValue.isLinkEnabled
							? 'pointer'
							: 'default',
				}}
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
					x={objectValue.x}
					y={objectValue.y}
					width={objectValue.length}
					height={objectValue.height}
					onClick={handleClick}
					fontSize={objectValue.fontSize}
					className={className}
					onContextMenu={handleContextMenu}
					onMouseMove={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<div
						className={styles.transparent}
						style={{
							width: '100%',
							height: '100%',
							backgroundColor: 'transparent',
							border: `none`,
							cursor:
								objectValue.gotonCode || objectValue.isLinkEnabled
									? 'pointer'
									: 'default',
						}}
					></div>
				</foreignObject>
			</>
			{objectValue.checkboxMultiline && (
				<>
					{isChecked ? (
						<image
							x={objectValue.x + objectValue.length + 2}
							y={objectValue.y + objectValue.height / 12}
							width={objectValue.height / 1.2}
							height={objectValue.height / 1.2}
							href={checkedCheckbox}
						/>
					) : (
						<image
							x={objectValue.x + objectValue.length + 2}
							y={objectValue.y + objectValue.height / 12}
							width={objectValue.height / 1.2}
							height={objectValue.height / 1.2}
							href={checkbox}
						/>
					)}
					<foreignObject
						x={objectValue.x + objectValue.length}
						y={objectValue.y + objectValue.height / 12}
						width={objectValue.height / 1.2}
						height={objectValue.height / 1.2}
					>
						<div className={styles.checkbox_wrapper}>
							<Checkbox
								name={`${objectValue.text}-${objectValue.id}`}
								title=""
								checked={false}
								className={styles.checkbox}
								onChange={handleCheckboxChange}
							/>
						</div>
					</foreignObject>
				</>
			)}
			{isEmergencyEventsInfoVisible && (
				<>
					<rect
						x={emergencyEventsXCoord}
						y={objectValue.y - 12 / 3}
						width={12}
						style={{
							maxWidth: '1.2em',
						}}
						height={12}
						fill={emergencyEventsCountColor}
						rx={50}
					/>
					<text
						textAnchor="middle"
						x={emergencyEventsXCoord + 12 / 2}
						y={objectValue.y + 12 / 4}
						dominantBaseline="middle"
						fontSize={10}
						fill={'white'}
					>
						{emergencyEventsCountLabel}
					</text>
					<foreignObject
						x={emergencyEventsXCoord}
						y={objectValue.y - objectValue.height / 3}
						width={objectValue.height}
						height={objectValue.height}
					>
						<button
							className={styles.emergency_events}
							onClick={handleEmergencyButtonClick}
						></button>
					</foreignObject>
				</>
			)}
		</g>
	);
}

export default Transparent;
