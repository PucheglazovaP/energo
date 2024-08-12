import { updateObjectParameter } from '../../Models/EditMode/events';
import { FormObjectParameters } from '../../Models/EditMode/types';
import {
	FormObjectConfiguration,
	TransparentConfiguration,
} from '../../Shared/Types/formObject';

import { Parameters } from './types';

export function leftAlignment(
	selectedObjects: { id: number; objectType: string }[],
	versionCode: number,
	newObjectParameters: Map<number, FormObjectParameters[]>,
	firstElement: { x: number; y?: number; w?: number; h?: number },
) {
	selectedObjects.slice(1).forEach((item: any) => {
		const alignmentElement = newObjectParameters.get(item.id);
		const parameterCodeType = item.objectType === 'Транспарант' ? true : false;

		if (alignmentElement) {
			updateObjectParameter({
				objectId: item.id,
				value: Math.round(firstElement.x),
				parameterName: 'x',
				parameterCode: parameterCodeType ? Parameters.X : Parameters.dX,
				versionCode: versionCode,
			});
		}
	});
}
export function centerVertical(
	selectedObjects: { id: number; objectType: string }[],
	versionCode: number,
	newObjectParameters: Map<number, FormObjectParameters[]>,
	firstElement: { x: number; y?: number; w: number; h?: number },
	configFirstElement: FormObjectParameters[] | undefined,
) {
	selectedObjects.slice(1).forEach((item: any) => {
		if (configFirstElement) {
			const centerElement = firstElement.x + firstElement.w * 0.5;
			const alignmentElement = newObjectParameters.get(item.id);
			const parameterCodeType =
				item.objectType === 'Транспарант' ? true : false;

			if (alignmentElement) {
				const { value: alignmentElementWidth = 0 } =
					alignmentElement.find((parameter) => {
						if (parameterCodeType) {
							return parameter.parameterCode === Parameters.W;
						} else {
							return parameter.parameterCode === Parameters.dW;
						}
					}) || {};
				updateObjectParameter({
					objectId: item.id,
					value: Math.round(
						centerElement - Number(alignmentElementWidth) * 0.5,
					),
					parameterName: 'x',
					parameterCode: parameterCodeType ? Parameters.X : Parameters.dX,
					versionCode: versionCode,
				});
			}
		}
	});
}

export function rightAlignment(
	selectedObjects: { id: number; objectType: string }[],
	versionCode: number,
	newObjectParameters: Map<number, FormObjectParameters[]>,
	firstElement: { x: number; y?: number; w: number; h?: number },
	configFirstElement: FormObjectParameters[] | undefined,
) {
	selectedObjects.slice(1).forEach((item: any) => {
		if (configFirstElement) {
			const alignmentElement = newObjectParameters.get(item.id);
			const parameterCodeType =
				item.objectType === 'Транспарант' ? true : false;

			if (alignmentElement) {
				const { value: alignmentElementWidth = 0 } =
					alignmentElement.find((parameter) => {
						if (parameterCodeType) {
							return parameter.parameterCode === Parameters.W;
						} else {
							return parameter.parameterCode === Parameters.dW;
						}
					}) || {};
				updateObjectParameter({
					objectId: item.id,
					value: Math.round(
						firstElement.x + firstElement.w - Number(alignmentElementWidth),
					),
					parameterName: 'x',
					parameterCode: parameterCodeType ? Parameters.X : Parameters.dX,
					versionCode: versionCode,
				});
			}
		}
	});
}

export function topAlignment(
	selectedObjects: { id: number; objectType: string }[],
	versionCode: number,
	firstElement: { x: number; y: number; w: number; h?: number },
	configFirstElement: FormObjectParameters[] | undefined,
) {
	selectedObjects.slice(1).forEach((item: any) => {
		if (configFirstElement) {
			const parameterCodeType =
				item.objectType === 'Транспарант' ? true : false;
			updateObjectParameter({
				objectId: item.id,
				value: Math.round(firstElement.y),
				parameterName: 'y',
				parameterCode: parameterCodeType ? Parameters.Y : Parameters.dY,
				versionCode: versionCode,
			});
		}
	});
}

export function centerHorizontal(
	selectedObjects: { id: number; objectType: string }[],
	versionCode: number,
	newObjectParameters: Map<number, FormObjectParameters[]>,
	firstElement: { x: number; y: number; w: number; h: number },
	configFirstElement: FormObjectParameters[] | undefined,
) {
	selectedObjects.slice(1).forEach((item: any) => {
		if (configFirstElement) {
			const centerElement = firstElement.y + firstElement.h * 0.5;
			const alignmentElement = newObjectParameters.get(item.id);
			const parameterCodeType =
				item.objectType === 'Транспарант' ? true : false;

			if (alignmentElement) {
				const { value: alignmentElementWidth = 0 } =
					alignmentElement.find((parameter: { parameterCode: Parameters }) => {
						if (parameterCodeType) {
							return parameter.parameterCode === Parameters.H;
						} else {
							return parameter.parameterCode === Parameters.dH;
						}
					}) || {};
				updateObjectParameter({
					objectId: item.id,
					value: Math.round(
						centerElement - Number(alignmentElementWidth) * 0.5,
					),
					parameterName: 'y',
					parameterCode: parameterCodeType ? Parameters.Y : Parameters.dY,
					versionCode: versionCode,
				});
			}
		}
	});
}

export function bottomAlignment(
	selectedObjects: { id: number; objectType: string }[],
	versionCode: number,
	newObjectParameters: Map<number, FormObjectParameters[]>,
	firstElement: { x: number; y: number; w: number; h: number },
	configFirstElement: FormObjectParameters[] | undefined,
) {
	selectedObjects.slice(1).forEach((item: any) => {
		if (configFirstElement) {
			const alignmentElement = newObjectParameters.get(item.id);
			const parameterCodeType =
				item.objectType === 'Транспарант' ? true : false;

			if (alignmentElement) {
				updateObjectParameter({
					objectId: item.id,
					value: Math.round(firstElement.y + firstElement.h - item.height),
					parameterName: 'y',
					parameterCode: parameterCodeType ? Parameters.Y : Parameters.dY,
					versionCode: versionCode,
				});
			}
		}
	});
}

export function leftRightVertical(
	configFirstElement: FormObjectParameters[] | undefined,
	selectedObjects: { id: number; objectType: string }[],
	newObjectParameters: Map<number, FormObjectParameters[]>,
	minimumValueCoordinatesX: number,
	maximumValueCoordinatesX: number,
	typeElement: { (): boolean; (): any },
	versionCode: number,
) {
	if (configFirstElement) {
		const alignmentElement = newObjectParameters.get(selectedObjects[0].id);

		let sumWidth: number = 0;
		let constructionPoint: number = 0;
		let distanceBetweenElements: number = 0;
		let buildingElements: number = 0;

		selectedObjects.forEach((item: any) => {
			const parameterCodeType =
				item.objectType === 'Транспарант' ? true : false;
			if (item.x === minimumValueCoordinatesX) {
				constructionPoint = typeElement()
					? minimumValueCoordinatesX + item.length
					: minimumValueCoordinatesX + item.width;
			}

			if (
				item.x !== maximumValueCoordinatesX &&
				item.x !== minimumValueCoordinatesX
			) {
				if (parameterCodeType) {
					sumWidth += item.length;
				} else {
					sumWidth += item.width;
				}
			}
		});

		distanceBetweenElements =
			(maximumValueCoordinatesX - (constructionPoint + sumWidth)) /
			(selectedObjects.length - 1);

		buildingElements = constructionPoint + distanceBetweenElements;

		selectedObjects.forEach((item: any) => {
			const parameterCodeType =
				item.objectType === 'Транспарант' ? true : false;

			if (
				item.x !== maximumValueCoordinatesX &&
				item.x !== minimumValueCoordinatesX
			) {
				if (alignmentElement) {
					updateObjectParameter({
						objectId: item.id,
						value: Math.round(buildingElements),
						parameterName: 'x',
						parameterCode: parameterCodeType ? Parameters.X : Parameters.dX,
						versionCode: versionCode,
					});
				}
				buildingElements += item.length + distanceBetweenElements;
			}
		});
	}
}

export function leftRightHorizontal(
	selectedObjects: {
		y: number;
		height: number;
		id: number;
		objectType: string;
	}[],
	versionCode: number,
	newObjectParameters: Map<number, FormObjectParameters[]>,
	minimumValueCoordinatesY: number,
	maximumValueCoordinatesY: number,
	configFirstElement: FormObjectParameters[] | undefined,
) {
	if (configFirstElement) {
		const alignmentElement = newObjectParameters.get(selectedObjects[0].id);

		let sumHeight: number = 0;
		let constructionPoint: number = 0;
		let distanceBetweenElements: number = 0;
		let buildingElements: number = 0;

		selectedObjects.forEach((item) => {
			if (item.y === minimumValueCoordinatesY) {
				constructionPoint = minimumValueCoordinatesY + item.height;
			}
			if (
				item.y !== maximumValueCoordinatesY &&
				item.y !== minimumValueCoordinatesY
			) {
				sumHeight += item.height;
			}
		});

		distanceBetweenElements =
			(maximumValueCoordinatesY - (constructionPoint + sumHeight)) /
			(selectedObjects.length - 1);

		buildingElements = constructionPoint + distanceBetweenElements;

		const selectedObjectsSort = selectedObjects.sort((a, b) =>
			a.y > b.y ? 1 : -1,
		);

		selectedObjectsSort.forEach((item: any) => {
			const parameterCodeType =
				item.objectType === 'Транспарант' ? true : false;
			if (
				item.y !== maximumValueCoordinatesY &&
				item.y !== minimumValueCoordinatesY
			) {
				if (alignmentElement) {
					updateObjectParameter({
						objectId: item.id,
						value: Math.round(buildingElements),
						parameterName: 'y',
						parameterCode: parameterCodeType ? Parameters.Y : Parameters.dY,
						versionCode: versionCode,
					});
				}
				buildingElements += item.height + distanceBetweenElements;
			}
		});
	}
}

export function equalDistanceVertical(
	selectedObjects: FormObjectConfiguration[],
	versionCode: number,
) {
	const selectedObjectsSort = selectedObjects.sort((a, b) =>
		a.x > b.x ? 1 : -1,
	);
	const totalWidth = selectedObjectsSort.reduce((sum, obj) => {
		if (obj.objectType === 'Транспарант')
			return sum + (obj as TransparentConfiguration).length;
		return sum + obj.width;
	}, 0);
	const containerStart = selectedObjectsSort[0].x;
	let containerEnd = selectedObjectsSort[selectedObjectsSort.length - 1].x;
	if (selectedObjectsSort[0].objectType === 'Транспарант')
		containerEnd =
			selectedObjectsSort[selectedObjectsSort.length - 1].x +
			(
				selectedObjectsSort[
					selectedObjectsSort.length - 1
				] as TransparentConfiguration
			).length;
	else
		containerEnd =
			selectedObjectsSort[selectedObjectsSort.length - 1].x +
			selectedObjectsSort[selectedObjectsSort.length - 1].width;

	const containerWidth = containerEnd - containerStart;

	const totalGapWidth = containerWidth - totalWidth;
	const gapBetweenObjects = totalGapWidth / (selectedObjectsSort.length - 1);
	let currentX = selectedObjectsSort[0].x;
	selectedObjectsSort.forEach((item, index) => {
		const parameterCodeType = item.objectType === 'Транспарант' ? true : false;

		updateObjectParameter({
			objectId: item.id,
			value: Math.round(currentX),
			parameterName: 'x',
			parameterCode: parameterCodeType ? Parameters.X : Parameters.dX,
			versionCode: versionCode,
		});
		if (index < selectedObjectsSort.length - 1) {
			if (item.objectType === 'Транспарант')
				currentX +=
					(item as TransparentConfiguration).length + gapBetweenObjects;
			else currentX += item.width + gapBetweenObjects;
		}
	});
}
export function equalDistanceHorizontal(
	selectedObjects: FormObjectConfiguration[],
	versionCode: number,
) {
	const selectedObjectsSort = selectedObjects.sort((a, b) =>
		a.y > b.y ? 1 : -1,
	);
	const totalHeight = selectedObjectsSort.reduce(
		(sum, obj) => sum + obj.height,
		0,
	);

	// Вычисление расстояния между объектами
	const gap = totalHeight / (selectedObjectsSort.length - 1);
	let currentY = selectedObjectsSort[0].y >= 0 ? selectedObjectsSort[0].y : 0;

	selectedObjectsSort.forEach((item) => {
		const parameterCodeType = item.objectType === 'Транспарант' ? true : false;
		updateObjectParameter({
			objectId: item.id,
			value: Math.round(currentY),
			parameterName: 'y',
			parameterCode: parameterCodeType ? Parameters.Y : Parameters.dY,
			versionCode: versionCode,
		});
		currentY += item.height + gap;
	});
}
