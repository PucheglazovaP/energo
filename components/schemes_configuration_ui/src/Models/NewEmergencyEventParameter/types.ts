import { RadioGroup } from '../../Containers/FormCreation/types';
import { SelectOption } from '../../UI/Select/types';

export enum ParameterPosition {
	ABOVE = 0,
	UNDER = 1,
	CHILD = 3,
}
export enum ParameterOperation {
	New = 'new',
	Edit = 'edit',
}
export enum SelectGroupType {
	ControlGroupNumber = 'controlGroupNumber',
	DynamicObjectGroupNumber = 'dynamicObjectGroupNumber',
}
export enum ResponsiblePersonOperationStatus {
	Add = 'add',
	Change = 'change',
	Delete = 'delete',
	NoChange = 'noChange',
}
export type NewParameter = {
	id: number | null;
	parentId: number | null;
	responsiblePersons: ResponsiblePersons[];
	name: string;
	listIsLoading: boolean;
	controlGroupNumber: number | null;
	controlGroupNumberDataTypeCode: number | null;
	dynamicObjectGroupNumber: number | null;
	itHasControlParameter: boolean;
	selectedPersonsList: {
		items: ResponsiblePersons[];
		skey?: number;
		recordCode?: number;
		lastModified?: string;
		operationStatus: ResponsiblePersonOperationStatus;
	}[];
	positions: RadioGroup[];
	unitId: number | null;
	selectGroupType: SelectGroupType;
	selectedParameterId: number | null;
	operation: ParameterOperation;
	lastModified: string;
	dataTypeList: SelectOption[];
};

export interface ResponsiblePersons extends SelectOption {
	id?: string;
	name: string;
	email?: string;
	skey: number;
	recordCode?: number;
	lastModified?: string;
}
export type GroupInfo = {
	number: number;
	name: string;
	unitId: number;
};
