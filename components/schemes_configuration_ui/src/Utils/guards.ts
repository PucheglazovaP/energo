import { FormContextMenuObject } from '../Models/FormContextMenu/types';
import { PrintFormPositionResponse } from '../Shared/types';
import {
	DynamicObjectConfiguration,
	ObjectTypes,
	TransparentConfiguration,
} from '../Shared/Types/formObject';
import { TOption, TOptionHeading } from '../UI/Dropdown/types';

const colorProperties = ['bkg', 'textColor', 'color'];

export function isPropertyColor(property: string) {
	const result = colorProperties.includes(property);
	return result;
}

export function getNumber(
	property: unknown,
	name: string = 'property',
	element?: PrintFormPositionResponse,
): number {
	if (typeof property === 'object' || Array.isArray(property)) {
		console.log('element: ', element);
		throw new Error(`Ошибка! Для параметра ${name} ожидался тип Number`);
	}
	return Number(property) || 0;
}

export function getString(
	property: unknown,
	name: string = 'property',
): string {
	if (typeof property === 'object' || Array.isArray(property)) {
		throw new Error(`Ошибка! Для параметра ${name} ожидался тип String`);
	}
	return String(property) || '';
}

/**
 * Function to validate JSON
 * @returns returns a boolean that indicates whether the JSON is valid
 */
export function isValidJson(string: string, name: string) {
	try {
		JSON.parse(string);
	} catch (error) {
		throw new Error(`Ошибка! Для параметра ${name} ожидался валидный JSON`);
	}
	return true;
}

export const isDynamicObject = (
	object: FormContextMenuObject,
): object is DynamicObjectConfiguration => {
	return !!object && object.objectType === ObjectTypes.DynamicObject;
};

export const isTransparant = (
	object: FormContextMenuObject,
): object is TransparentConfiguration => {
	return !!object && object.objectType === ObjectTypes.Transparent;
};
export const isStatusIndicator = (
	object: FormContextMenuObject,
): object is TransparentConfiguration => {
	return !!object && object.objectType === ObjectTypes.StatusIndicator;
};
export function isHeadingOption(
	opt: TOption | TOptionHeading,
): opt is TOptionHeading {
	return Object.prototype.hasOwnProperty.call(opt, 'title');
}
