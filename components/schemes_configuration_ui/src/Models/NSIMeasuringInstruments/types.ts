export interface NSIMeasuringInstrument {
	equipmentNumber: string;
	measurementTypeCode: string;
	measurementType: string;
	equipmentShortName: string;
	manufacturerTypeName: string;
	factoryNumber: string;
	productionYear: string;
	calibrationDate: string;
	verificationDate: string;
	userStatusCode: string;
	userStatus: string;
	rowNumber: number;
	precisionClass: string;
	deviceNumber: string;
	channelNumber: string;
	linkedToUnit: boolean;
	location: string;
	checked: boolean;
}
export interface NSIMeasuringInstrumentsPaginationResponse {
	firstRow: number | null;
	pageNumber: number | null;
	pageTotalCount: number | null;
	selectedRow: number | null;
}
export interface NSIMeasuringInstrumentsPagination {
	pageTotalCount: number;
	pageRowCount: number;
	topPageNumber: number;
	bottomPageNumber: number;
	isFirstFetching: boolean;
	paginationAvailable: boolean;
	needToScroll: boolean;
	scrollbarPosition: number | null;
}

export interface NSIMeasuringInstrumentsModel {
	pageNumber: number;
	allInstrumentsChecked: boolean;
	instrumentsList: NSIMeasuringInstrument[];
	pagination: NSIMeasuringInstrumentsPagination;
}

export interface NSIMeasuringInstrumentsSearchValuesModel {
	equipmentShortName: string;
	manufacturerTypeName: string;
	location: string;
	factoryNumber: string;
}

export interface NSIMeasuringInstrumentsType {
	typeId: string;
	typeName: string;
}

export interface NSIMeasuringInstrumentsUserStatus {
	statusId: string;
	statusSequenceNumber: number;
	statusName: string;
	statusDescription: string;
}

export interface NSIMeasuringInstrumentsFiltersModel {
	measurementType: string | null;
	userStatus: string | null;
}

export interface GetDeviceByEquipmentNumberData {
	deviceId: number;
	nodeId: number;
}
