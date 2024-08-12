import { FormLayer, FormTypes } from '../../Shared/types';
import {
	DynamicObjectConfiguration,
	StatusIndicatorConfiguration,
	TransparentConfiguration,
} from '../../Shared/Types/formObject';

export type Form = {
	id: number | null;
	isTitleVisible: boolean;
	title: string;
	visdelayForm: number;
	formType: FormTypes;
	formTransparentObjects: TransparentConfiguration[];
	formDynamicObjects: DynamicObjectConfiguration[];
	statusIndicators: StatusIndicatorConfiguration[];
	formBackground: string;
	backgroundWidth: number;
	backgroundHeight: number;
	parentId?: number;
	isLoading: boolean;
	trendMode: string;
	isUpdateFormEnabled: boolean;
	updateDelay: number;
	versionCode: number;
	dateTime: Date;
	isEmergencyEventsModeEnabled: boolean;
	isFullScreenModeEnabled: boolean;
	isFormProportionsSaved: boolean;
};
export type ActiveFormLayers = {
	formLayers: FormLayer[];
	checkedFormLayers: number[];
	mainLayer: {
		id: number;
		name: string;
	};
};
export type FormParametersResponse = {
	КодФормы: number;
	НазваниеПараметра: string;
	ЗначениеПараметра: string;
};
export type FormBackground = {
	image: string;
	fileName: string;
};
export type ImageInfo = {
	image: string;
	fileName: string;
	extension: string;
};
export type FormObjectsResponse = {
	КодОбъектаФормы: number;
	ТипОбъектаФормы: 'Транспарант' | 'Динамический объект';
	НомерОбъектаПоПорядку: number;
	НазваниеПараметра: string;
	ЗначениеПараметра: string;
	Значение: string;
	ГруппаТранспаранта: number | null;
	КодКонтролируемогоПараметра: number | null;
	КодКритерия: number | null;
};
export type FormObjectsGroupInfoResponse = {
	КодОбъектаФормы: number;
	ГруппаТранспаранта: number;
	ИмяГруппы: string;
	ЕдиницаИзмерения: string;
	КаналыГруппы: string;
};
export type FormObjectDataResponse = {
	dat: string;
	// значение объекта
	dan: number | null;
	val: number | null;
	button: number;
	nulls: number;
	canerr: string;
	grNumber: number;
	// тип объекта
	obj_name: string;
	// значения Индикатора
	ind_d1: number | null;
	ind_d2: number | null;
	ind_d3: number | null;
	ind_dg1: number | null;
	ind_dg2: number | null;
	ind_stat: number | null;
	obj_id: number;
};
export type FormObjectLayerIdResponse = {
	КодСлояФормы: number;
	КодТранспаранта: number;
	КодОбъекта: number;
};

export type DynamicObjectValueResponse = {
	НомерЗначенияПоПорядку: number;
	Значение: string;
	Комментарий: string;
	КодОбъекта: number;
};

export type TransparentEmergencyEventsCount = {
	transparentId: number;
	numberOfInternalEmergencyEvents: number;
	numberOfOwnEmergencyEvents: number;
};
