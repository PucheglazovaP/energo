import { useId, useMemo } from 'react';
import { Tooltip } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import { $editMode, $selectedObjectsState } from '../../Models/EditMode';
import { $navigation } from '../../Models/Navigation';

import {
	bottomAlignment,
	centerHorizontal,
	centerVertical,
	equalDistanceHorizontal,
	equalDistanceVertical,
	leftAlignment,
	leftRightHorizontal,
	leftRightVertical,
	rightAlignment,
	topAlignment,
} from './alignmentUtils';
import {
	IconAlignmentBottom,
	IconAlignmentCenterHorizontal,
	IconAlignmentCenterVertical,
	IconAlignmentDoubleH,
	IconAlignmentDoubleV,
	IconAlignmentHorizontal,
	IconAlignmentLeft,
	IconAlignmentRight,
	IconAlignmentTop,
	IconAlignmentVertical,
} from './IconAlignment';
import { Parameters, TooltipDirection } from './types';

import styles from './ConfigurationBlock.module.css';

function AlignmentElementsTools() {
	const editMode = useStore($editMode);
	const tooltipId = useId();
	const { objectParameters, isHintModeEnabled } = editMode;
	const { selectedObjects } = useStore($selectedObjectsState);
	const { versionId: versionCode = 90 } = useStore($navigation);

	const alignmentElements = useMemo(() => {
		if (selectedObjects.length >= 2) {
			return true;
		} else {
			return false;
		}
	}, [selectedObjects]);

	const newObjectParameters = new Map(objectParameters);
	const [donorObject = { id: -1 }] = selectedObjects;
	const configFirstElement = newObjectParameters.get(donorObject.id);

	const typeElement = () => {
		if (selectedObjects[0].objectType === 'Транспарант') {
			return true;
		} else return false;
	};

	const arrY: number[] = [];
	const arrX: number[] = [];
	let minimumValueCoordinatesY: number = 0;
	let maximumValueCoordinatesY: number = 0;
	let minimumValueCoordinatesX: number = 0;
	let maximumValueCoordinatesX: number = 0;

	if (selectedObjects.length >= 1) {
		selectedObjects.forEach((coord) => {
			arrY.push(coord.y);
			arrX.push(coord.x);
		});

		minimumValueCoordinatesY = arrY.reduce((a: number, b: number) =>
			Math.min(a, b),
		);
		maximumValueCoordinatesY = arrY.reduce((a: number, b: number) =>
			Math.max(a, b),
		);

		minimumValueCoordinatesX = arrX.reduce((a: number, b: number) =>
			Math.min(a, b),
		);
		maximumValueCoordinatesX = arrX.reduce((a: number, b: number) =>
			Math.max(a, b),
		);
	}

	const firstElement: { x: number; y: number; w: number; h: number } = {
		x: 0,
		y: 0,
		w: 0,
		h: 0,
	};

	if (configFirstElement) {
		if (typeElement()) {
			configFirstElement.forEach((item) => {
				if (item.parameterCode === Parameters.X)
					firstElement.x = Number(item.value);
				if (item.parameterCode === Parameters.Y)
					firstElement.y = Number(item.value);
				if (item.parameterCode === Parameters.W)
					firstElement.w = Number(item.value);
				if (item.parameterCode === Parameters.H)
					firstElement.h = Number(item.value);
			});
		} else {
			configFirstElement.forEach((item) => {
				if (item.parameterCode === Parameters.dX)
					firstElement.x = Number(item.value);
				if (item.parameterCode === Parameters.dY)
					firstElement.y = Number(item.value);
				if (item.parameterCode === Parameters.dW)
					firstElement.w = Number(item.value);
				if (item.parameterCode === Parameters.dH)
					firstElement.h = Number(item.value);
			});
		}
	}

	return (
		<>
			{alignmentElements && (
				<div className={styles.alignment}>
					<Tooltip
						disabled={!isHintModeEnabled}
						tooltip="По левому краю"
						direction={TooltipDirection.Down}
					>
						<button
							key={tooltipId}
							className={styles.button_alignment}
							onClick={() => {
								leftAlignment(
									selectedObjects,
									versionCode,
									newObjectParameters,
									firstElement,
								);
							}}
						>
							<IconAlignmentLeft />
						</button>
					</Tooltip>
					<Tooltip
						tooltip="Относительно центра по вертикали"
						direction={TooltipDirection.Down}
						disabled={!isHintModeEnabled}
					>
						<button
							key={tooltipId}
							className={styles.button_alignment}
							onClick={() => {
								centerVertical(
									selectedObjects,
									versionCode,
									newObjectParameters,
									firstElement,
									configFirstElement,
								);
							}}
						>
							<IconAlignmentCenterVertical />
						</button>
					</Tooltip>
					<Tooltip
						disabled={!isHintModeEnabled}
						tooltip="По правому краю"
						direction={TooltipDirection.Down}
					>
						<button
							key={tooltipId}
							className={styles.button_alignment}
							onClick={() => {
								rightAlignment(
									selectedObjects,
									versionCode,
									newObjectParameters,
									firstElement,
									configFirstElement,
								);
							}}
						>
							<IconAlignmentRight />
						</button>
					</Tooltip>
					<Tooltip
						disabled={!isHintModeEnabled}
						tooltip="По верхнему краю"
						direction={TooltipDirection.Down}
					>
						<button
							key={tooltipId}
							className={styles.button_alignment}
							onClick={() => {
								topAlignment(
									selectedObjects,
									versionCode,
									firstElement,
									configFirstElement,
								);
							}}
						>
							<IconAlignmentTop />
						</button>
					</Tooltip>
					<Tooltip
						tooltip="Относительно центра по горизонтали"
						direction={TooltipDirection.Down}
						disabled={!isHintModeEnabled}
					>
						<button
							key={tooltipId}
							className={styles.button_alignment}
							onClick={() => {
								centerHorizontal(
									selectedObjects,
									versionCode,
									newObjectParameters,
									firstElement,
									configFirstElement,
								);
							}}
						>
							<IconAlignmentCenterHorizontal />
						</button>
					</Tooltip>
					<Tooltip
						disabled={!isHintModeEnabled}
						tooltip="По нижнему краю"
						direction={TooltipDirection.Down}
					>
						<button
							key={tooltipId}
							className={styles.button_alignment}
							onClick={() => {
								bottomAlignment(
									selectedObjects,
									versionCode,
									newObjectParameters,
									firstElement,
									configFirstElement,
								);
							}}
						>
							<IconAlignmentBottom />
						</button>
					</Tooltip>

					<div className={styles.line}></div>
					<Tooltip
						tooltip="Распределить интервалы по горизонтали"
						direction={TooltipDirection.Down}
						disabled={!isHintModeEnabled}
					>
						<button
							key={tooltipId}
							className={styles.button_alignment}
							onClick={() => {
								leftRightVertical(
									configFirstElement,
									selectedObjects,
									newObjectParameters,
									minimumValueCoordinatesX,
									maximumValueCoordinatesX,
									typeElement,
									versionCode,
								);
							}}
						>
							<IconAlignmentVertical />
						</button>
					</Tooltip>
					<Tooltip
						tooltip="Распределить интервалы по вертикали"
						direction={TooltipDirection.Down}
						disabled={!isHintModeEnabled}
					>
						<button
							key={tooltipId}
							className={styles.button_alignment}
							onClick={() => {
								leftRightHorizontal(
									selectedObjects,
									versionCode,
									newObjectParameters,
									minimumValueCoordinatesY,
									maximumValueCoordinatesY,
									configFirstElement,
								);
							}}
						>
							<IconAlignmentHorizontal />
						</button>
					</Tooltip>
					<Tooltip
						disabled={!isHintModeEnabled}
						tooltip="По горизонтали"
						direction={TooltipDirection.Down}
					>
						<button
							key={tooltipId}
							className={styles.button_alignment}
							onClick={() => {
								equalDistanceVertical(selectedObjects, versionCode);
							}}
						>
							<IconAlignmentDoubleV />
						</button>
					</Tooltip>
					<Tooltip
						disabled={!isHintModeEnabled}
						tooltip="По вертикали"
						direction={TooltipDirection.Down}
					>
						<button
							key={tooltipId}
							className={styles.button_alignment}
							onClick={() => {
								equalDistanceHorizontal(selectedObjects, versionCode);
							}}
						>
							<IconAlignmentDoubleH />
						</button>
					</Tooltip>
				</div>
			)}
		</>
	);
}

export default AlignmentElementsTools;
