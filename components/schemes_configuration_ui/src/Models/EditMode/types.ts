import { XrangePointOptionsObject } from 'highcharts';

import { ConfigurationTypes, FormTypes } from '../../Shared/types';
import {
	DynamicObjectConfiguration,
	FormObjectConfiguration,
	ObjectTypes,
	TransparentConfiguration,
} from '../../Shared/Types/formObject';
import { TreeItem } from '../../UI/Tree/types';
import { Form } from '../ActiveForm/types';

export type FormParametersResponse = {
	КодФормы: number;
	КодТипаФормы: number;
	КодПараметра: number;
	НазваниеПараметра: string;
	НазваниеДляОтображения: string;
	Комментарий: string;
	ТипДанныхПараметра: string;
	КодТипаДанныхDelphiПараметра: number;
	ТипДанныхDelphiПараметра: string;
	ЗначениеПараметра: string;
	ЗначениеПоУмолчаниюПараметра: string;
	ПризнакВидимостиДляПользователя: boolean;
	ПризнакВозможнойЗависимости: boolean;
	ВидимоеДляПользователя: boolean;
	ПорядковыйНомерГруппы: number | null;
	НазваниеГруппы: string | null;
	НомерПоПорядкуВГруппе: number | null;
	ВозможностьГрупповогоИзмененияЗначений: boolean;
	ПеречислениеВозможныхЗначений: string | null;
};
export type FormParameters = {
	parameterCode: number;
	parameterName: string;
	parameterForDisplay: string;
	comment: string;
	dataType: string;
	codeTypeDelphi: number;
	dataTypeDelphi: string;
	value: string | number;
	defaultValue: string;
	visibilityForUser: boolean;
	possibleDependency: boolean;
	possibleValues: { value: string; displayValue: string }[] | null;
	groupNumber: number | null;
	groupName: string | null;
	numberInGroup: number | null;
	possibilityForGroupChange: boolean;
};
export type FormObjectParametersResponse = {
	КодОбъектаФормы: number;
	КодТипаОбъектаФормы: number;
	КодПараметра: number;
	НазваниеПараметра: string;
	Комментарий: string;
	НазваниеДляОтображения: string;
	НазваниеПараметраДляОтображения: string;
	ТипДанныхПараметра: string;
	КодТипаДанныхDelphiПараметра: number;
	ТипДанныхDelphiПараметра: string;
	НазваниеТипаДанныхDelphi: string;
	ЗначениеПараметра: string;
	ЗначениеПоУмолчаниюПараметра: string;
	ПризнакВидимостиДляПользователя: boolean;
	ПризнакВозможнойЗависимости: boolean;
	КодПарногоПараметра: number | null;
	ПеречислениеВозможныхЗначений: string | null;
	ВидимоеДляПользователя: boolean;
	ПорядковыйНомерГруппы: number | null;
	НазваниеГруппы: string | null;
	НомерПоПорядкуВГруппе: number | null;
	ВозможностьГрупповогоИзмененияЗначений: boolean;
	Слой: number;
};
export type FormObjectValue = string | number | boolean | null;
export type FormObjectParameters = {
	parameterCode: number;
	parameterName: string;
	comment: string;
	parameterForDisplay: string;
	dataType: string;
	codeTypeDelphi: number;
	dataTypeDelphi: string;
	value: FormObjectValue;
	defaultValue: string;
	visibilityForUser: boolean;
	possibleDependency: boolean;
	pairedParameterCode: number | null;
	possibleValues: { value: string; displayValue: string }[] | null;
	groupNumber: number | null;
	groupName: string | null;
	numberInGroup: number | null;
	possibilityForGroupChange: boolean;
	objectId: number;
};

export interface EditMode extends Form {
	isEditing: boolean;
	// массивы свойств формы для инспектора
	formParameters: FormParameters[];
	// массивы свойств объектов формы для инспектора
	objectParameters: Map<number, FormObjectParameters[]>;
	isCreateTransparentModeEnabled: boolean;
	isCreateDynamicObjectModeEnabled: boolean;
	editedParameterCode: number | null;
	editedParameterName: string;
	editedFile: string;
	editedFileName: string;
	existingFile: string;
	chartPoints: Map<number, XrangePointOptionsObject[]>;
	selectedConfigurationType: ConfigurationTypes;
	isHintModeEnabled: boolean;
	isCreateStatusIndicatorEnabled: boolean;
	editableParameterName: string;
	selectedObjectConfig: TreeItem[];
}
export type selectProp = {
	multipleSelected: any;
};
export enum Parameters {
	X = 4975,
	Y = 4976,
	W = 4977,
	H = 4978,
	dX = 5019,
	dY = 5020,
	dW = 5018,
	dH = 4978,
}

export type alignType =
	| 'left'
	| 'center'
	| 'right'
	| 'top'
	| 'middle'
	| 'bottom';
export type alignItem = {
	alignType: alignType;
	x: number;
	w: number;
	typeCoord: string;
	item: FormObjectConfiguration;
};

export type CreatedTransparent = {
	objectParameters: FormObjectParameters[];
	createdTransparentId: number | null;
	transparentObject: Partial<TransparentConfiguration>;
};
export type CreatedDynamicObject = {
	objectDynamicParameters: FormObjectParameters[];
	createdDynamicObjectId: number | null;
	dynamicObject: Partial<DynamicObjectConfiguration>;
};
export type CreatedStatusIndicator = {
	statusIndicatorParameters: FormObjectParameters[];
	createdStatusIndicatorId: number | null;
	statusIndicator: Partial<DynamicObjectConfiguration>;
};
export type UpdateObjectWithParameters = {
	formTransparentObjects: TransparentConfiguration[];
	formDynamicObjects: DynamicObjectConfiguration[];
	objectParameters: Map<number, FormObjectParameters[]>;
};

export type ObjectConfigTreeOpenState = {
	type: ObjectTypes | FormTypes;
	config: TreeItem[];
};
export type SelectedObjectsState = {
	selectedObjects: FormObjectConfiguration[];
	isFormSelected: boolean;
};
