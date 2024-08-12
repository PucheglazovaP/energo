import { Action, FormLayer, SystemLayer } from '../../Shared/types';

export type FormLayers = {
	avaibleSystemLayers: SystemLayer[];
	formLayers: FormLayer[];
	checkedFormLayers: number[];
	checkedSystemLayers: number[];
	systemLayerActionType: Action;
	editData: SystemLayer | null;
	replacedFormLayerId: number | null;
	activeFormLayerId: number | null;
	mainLayer: {
		id: number;
		name: string;
	};
};
