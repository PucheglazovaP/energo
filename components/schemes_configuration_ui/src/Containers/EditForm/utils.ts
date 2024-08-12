import {
	FormObjectConfiguration,
	ObjectTypes,
	TransparentConfiguration,
} from '../../Shared/Types/formObject';
import { TReshapeRectangle } from '../../UI/ReshapeRectangle/types';

// Calculate rectangle position
export function getReshapeRectangle(
	arr: FormObjectConfiguration[],
): TReshapeRectangle {
	// Calculate min X
	const minX = Math.min(...arr.map((el) => Number(el.x) || 0));
	// Calculate min Y
	const minY = Math.min(...arr.map((el) => Number(el.y) || 0));
	const reshape: TReshapeRectangle = arr.reduce(
		(acc, curr) => {
			// Get parameters of the current element
			const x: number = Number(curr.x) || 0;
			const y: number = Number(curr.y) || 0;
			const width: number =
				Number(curr.width || (curr as TransparentConfiguration).length) || 0;
			const height: number = Number(curr.height) || 0;
			// Calculate new width and height
			if (x + width > acc.startX + acc.width) {
				acc.width = x + width - acc.startX;
			}
			if (y + height > acc.startY + acc.height) {
				acc.height = y + height - acc.startY;
			}
			return acc;
		},
		{
			startX: minX,
			startY: minY,
			width: 0,
			height: 0,
		} as TReshapeRectangle,
	);
	return reshape;
}

export function calculateResizedObjectValue(
	oldValue: string | boolean | number | undefined | null,
	delta: number,
): number {
	const result: number = Number(oldValue || 0) - delta;
	return result;
}

export function getWidthParameterName(objectType: ObjectTypes): string {
	if (objectType === ObjectTypes.DynamicObject) {
		return 'width';
	}
	return 'length';
}

export function getFormObjectsAtPointClick(
	x: number,
	y: number,
	formObjects: FormObjectConfiguration[],
) {
	const formObjectList: FormObjectConfiguration[] = [];
	for (const formObject of formObjects) {
		if (
			x >= formObject.x &&
			x <=
				formObject.x +
					(formObject.width ||
						(formObject as TransparentConfiguration).length) &&
			y >= formObject.y &&
			y <= formObject.y + formObject.height
		) {
			// Точка входит в прямоугольник
			formObjectList.push(formObject);
		}
	}
	return formObjectList;
}
