import { FormTypes } from '../../Shared/types';

export type FormSettingsModel = {
	formType: FormTypes;
	isEditMode: boolean;
	activeId: number | null;
};
