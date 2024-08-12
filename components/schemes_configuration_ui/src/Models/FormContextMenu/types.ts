import {
	DynamicObjectConfiguration,
	FormObject,
	FormObjectConfiguration,
	StatusIndicatorConfiguration,
	TransparentConfiguration,
} from '../../Shared/Types/formObject';

// Add here all types of object with context menu on the form
export type FormContextMenuObject =
	| FormObject
	| DynamicObjectConfiguration
	| TransparentConfiguration
	| StatusIndicatorConfiguration
	| null;

export interface FormContextMenuModel {
	object: FormContextMenuObject;
	selectedImageId: number;
	objectsForCopy: FormObjectConfiguration[];
	pasteCoord: { x: number | null; y: number | null };
}
