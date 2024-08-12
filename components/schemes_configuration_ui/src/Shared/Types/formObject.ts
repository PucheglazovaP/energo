export enum ObjectTypes {
	Transparent = 'Транспарант',
	DynamicObject = 'Динамический объект',
	Series = 'Серия',
	StatusIndicator = 'Индикатор',
}
export interface FormObject {
	transparentGroup: number | null;
	controlledParameterCode: number | null;
	criterionCode: number | null;
	objectType: ObjectTypes;
	orderNumber: number;
	id: number;
	unitName?: string;
	channelsList?: string;
	groupName: string | null;
	groupId: number | null;
	gotonCode: number | null;
	goton: string | null;
	visdelay: number;
	metricId: number;
	height: number;
	layerId: number;
	isLinkEnabled: boolean;
	link: string;
}
export interface TransparentConfiguration extends FormObject {
	[x: string]: any;
	text: string;
	color: string;
	border: number;
	fontSize: number;
	x: number;
	y: number;
	length: number;
	bkg: string;
	csql: boolean;
	csqlUser: number;
	useCapt: boolean;
	csqlType: number;
	dataMax: number;
	dataMin: number;
	short: boolean;
	mult: number;
	firstinc: boolean;
	notcapt: boolean;
	round: number;
	checkboxMultiline: boolean;
	csqlUserName: string | null;
	csqlTypeName: string | null;
	dataType: string;
	loadlistch: boolean;
	loadpargr: boolean;
	zeroHighLights: boolean;
	showDataType: number;
	value: number | null;
	cornerAngle: number;
	textColor: string;
	alignH: string;
	alignV: string;
	isSelected: boolean;
	parameterCode: number;
	nulls: number;
	canerr: string;
	showUnit: boolean;
	metricId: number;
	metricName: string;
	showAlerts: boolean;
	numberOfInternalEmergencyEvents?: number;
	numberOfOwnEmergencyEvents?: number;
}
export interface StatusIndicatorConfiguration {
	[x: string]: any;
	x: number;
	y: number;
	height: number;
	objectType: ObjectTypes;
	orderNumber: number;
	id: number;
	layerId: number;
	length: number;
	nameObject: string;
	normalIndicatorColor: string;
	emergencyIndicatorColor: string;
	warningIndicatorColor: string;
	turnedOffIndicatorColor: string;
	errorIndicatorColor: string;
	normalIndicatorComment: string;
	emergencyIndicatorComment: string;
	warningIndicatorComment: string;
	turnedOffIndicatorComment: string;
	errorIndicatorComment: string;
	d1GroupNumber: number | null;
	d2GroupNumber: number | null;
	d3GroupNumber: number | null;
	dg1GroupNumber: number | null;
	dg2GroupNumber: number | null;
	statusGroupNumber: number | null;
	d1Value: number | null;
	d2Value: number | null;
	d3Value: number | null;
	dg1Value: number | null;
	dg2Value: number | null;
	statusCode: number | null;
	header1: string;
	header2: string;
	scaleBar: number;
	isD1ValueVisible: boolean;
	isD2ValueVisible: boolean;
	isD3ValueVisible: boolean;
	isHeader1Visible: boolean;
	isHeader2Visible: boolean;
	isScaleBarEnabled: boolean;
}
export type DynamicObjectValue = {
	fileNumber: number;
	fileName: string;
	comment: string | null;
	url: string;
};
export interface DynamicObjectConfiguration extends FormObject {
	linkFormName: string;
	dataType: string;
	width: number;
	x: number;
	y: number;
	selectedFileNumber: number;
	nameObject: string;
	transparent: number;
	cursor: number;
	images: DynamicObjectValue[];
	selectedImageNumberFromGroup: number | null;
	parameterCode: number;
}

export type FormObjectConfiguration =
	| TransparentConfiguration
	| DynamicObjectConfiguration
	| StatusIndicatorConfiguration;
