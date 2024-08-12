import React from 'react';
import {
	ActionFunction,
	LoaderFunction,
	RouteObject,
	ShouldRevalidateFunction,
} from 'react-router-dom';
import { TableCellProps } from 'react-virtualized';
import { SelectOption } from '@evraz/ui-kit/dist/src/Shared/Types/SelectCommonProps';

import { Device } from '../Models/Devices/types';
import { GroupListItem } from '../Models/HardwareGroup/types';
import { Image } from '../Models/ImagesCollection/types';
import { FormPosition } from '../Models/NewForm/types';
import {
	NSIMeasuringInstrument,
	NSIMeasuringInstrumentsPaginationResponse,
} from '../Models/NSIMeasuringInstruments/types';
import { GroupsInReportForm } from '../Models/ReportFormProperties/types';
import { ReportType } from '../Pages/PageElectricPower/types';
import { TOption } from '../UI/Dropdown/types';
import { TreeItem } from '../UI/Tree/types';

import { Module, ModuleName } from './Types/moduleName';

export enum Action {
	Update = 'update',
	Create = 'create',
	Delete = 'delete',
}

export enum RemoteEntries {
	host = 'host',
	reports = 'reports',
	monitoring = 'monitoring',
	configurator = 'configurator',
}

export enum Path {
	Monitoring = '/monitoring/',
	NSI = '/nsi',
	ReportByDevices = '/report-by-devices/',
	ReportByPoints = '/report-by-points/',
	ReportByParameters = '/report-by-parameters/',
	ReferenceByReports = '/reference-by-reports/',
	ReferenceByForms = '/reference-by-forms/',
	ReportsTechnical = '/reports-technical/',
	ReportByInstrumentation = '/report-by-instrumentation',
	ReportByInputForms = '/report-by-input-forms',
	ReportByLogBook = '/report-by-log-book',
	ReportByCorrectionLog = '/report-by-correction-log',
	ReportByConstantLog = '/report-by-constant-log',
	ReportByPeriod = '/report-by-period',
	ReportByPrintForms = '/report-by-print-forms',
	EmergencyEvents = '/emergency-events',
	DevicesStatus = '/devices-status',
	RetrofittingAccountingNodes = '/retrofitting-accounting-nodes',
	StatisticalProcessing = '/statistical-processing',
	ElectricPower = '/electric-power',
	NaturalGas = '/natural-gas',
}

export type RouteItem = {
	path?: string;
	displayName: string;
	key: string;
	index?: boolean;
	element?: React.ReactNode | null;
	caseSensitive?: boolean;
	id?: string;
	loader?: LoaderFunction;
	action?: ActionFunction;
	errorElement?: React.ReactNode | null;
	handle?: RouteObject['handle'];
	shouldRevalidate?: ShouldRevalidateFunction;
};

export interface BackendResponse {
	Response: {
		Error: unknown;
		OutParameters: {
			'@PageNumber': string;
			'@FirstRow': string;
			'@PageTotalCount': string;
			'@Err': string;
			TextErr: string;
			'@ReturnValue': string;
			[key: string]: string;
		}[];
		PrintOutput: string;
		Tables: { Rows: unknown; Structure: unknown }[];
	};
}

export enum FormTypes {
	Form = 'Основная форма',
	Chart = 'Форма-график',
	MultiChart = 'Мультисерийный график',
	DeviceChart = 'Приборы и каналы',
	ChannelChart = 'Каналы без привязки к прибору',
	DiagnosticForm = 'Диагностика',
	ReportForm = 'Отчет',
	CondensateDrainForm = 'Форма учёта слива конденсата',
	ActivePowerForm = 'Форма активной мощности',
}

export enum TreeTypes {
	Mnemoschemes = 'mnemoschemes',
	Devices = 'devices',
	Channels = 'channels',
}

export enum Position {
	Top = 'top',
	Left = 'left',
	Right = 'right',
	bottom = 'bottom',
}

export enum PositionAxis {
	Vertical = 'vertical',
	Horizontal = 'horizontal',
}

export enum DiagnosticType {
	Device = 'device',
	Channel = 'channel',
}

export enum SearchParameters {
	TreeType = 'treeType',
	FormId = 'formId',
	DeviceId = 'deviceId',
	ChannelId = 'channelId',
	ServerId = 'serverId',
	NodeId = 'nodeId',
	NodeItemId = 'nodeItemId',
	VersionId = 'versionId',
	ControlParameterId = 'controlParameterId',
}

export enum HorizontalLineProperties {
	// 1st horizontal line
	hlineVisible = 'hlineVisible',
	hlineValue = 'hlineValue',
	hlineColor = 'hlineColor',
	hlineWidth = 'hlineWidth',
	// 2nd horizontal line
	hlineVisible1 = 'hlineVisible1',
	hlineValue1 = 'hlineValue1',
	hlineColor1 = 'hlineColor1',
	hlineWidth1 = 'hlineWidth1',
	// 3rd horizontal line
	hlineVisible2 = 'hlineVisible2',
	hlineValue2 = 'hlineValue2',
	hlineColor2 = 'hlineColor2',
	hlineWidth2 = 'hlineWidth2',
}

export enum HorizontalLineVisibleProp {
	hlineVisible = 'hlineVisible',
	hlineVisible1 = 'hlineVisible1',
	hlineVisible2 = 'hlineVisible2',
}

export enum HorizontalLineValueProp {
	hlineValue = 'hlineValue',
	hlineValue1 = 'hlineValue1',
	hlineValue2 = 'hlineValue2',
}

export enum HorizontalLineColorProp {
	hlineColor = 'hlineColor',
	hlineColor1 = 'hlineColor1',
	hlineColor2 = 'hlineColor2',
}

export enum HorizontalLineWidthProp {
	hlineWidth = 'hlineWidth',
	hlineWidth1 = 'hlineWidth1',
	hlineWidth2 = 'hlineWidth2',
}

export const formObjectProperties = {
	transparentGroup: 'transparentGroup',
	controlledParameterCode: 'controlledParameterCode',
	orderNumber: 'orderNumber',
	id: 'id',
	key: 'text',
	goton: 'goton',
	color: 'color',
	bkg: 'bkg',
	border: 'border',
	fontsize: 'fontSize',
	x: 'x',
	y: 'y',
	left: 'x',
	top: 'y',
	length: 'length',
	width: 'width',
	height: 'height',
	csql: 'csql',
	csqluser: 'csqlUser',
	csqlgroup: 'groupId',
	asqlgroupname: 'asqlGroupName',
	asqlgroup: 'asqlGroupId',
	asqltype: 'asqlType',
	groupnumber: 'groupId',
	groupname: 'groupName',
	selectednumberfile: 'selectedFileNumber',
	nameobject: 'nameObject',
	transparent: 'transparent',
	cursor: 'cursor',
	usecapt: 'useCapt',
	csqltype: 'csqlType',
	datamax: 'dataMax',
	datamin: 'dataMin',
	short: 'short',
	visdelay: 'visdelay',
	mult: 'mult',
	firstinc: 'firstinc',
	notcapt: 'notcapt',
	round: 'round',
	checkbox_multiline: 'checkboxMultiline',
	gotoncode: 'gotonCode',
	csqlgroupname: 'groupName',
	csqlusername: 'csqlUserName',
	csqltypename: 'csqlTypeName',
	datatype: 'dataType',
	loadlistch: 'loadlistch',
	loadpargr: 'loadpargr',
	ZeroHighLights: 'zeroHighLights',
	showdatatype: 'showDataType',
	fontname: 'fontName',
	beepmaxfile: 'beepMaxFile',
	beepminfile: 'beepMinFile',
	beepmax: 'beepMin',
	beepmin: 'beepMin',
	title: 'isTitleVisible',
	trend_mode: 'trendMode',
	visdelayform: 'visdelayForm',
	img: 'img',
	cornerAngle: 'cornerAngle',
	textcolor: 'textColor',
	alignH: 'alignH',
	alignV: 'alignV',
	csqlchannel: 'csqlChannel',
	VertAxisName: 'vertAxisName',
	AutoQuery: 'autoQuery',
	metric_id: 'metricId',
	metric_name: 'metricName',
	show_alerts: 'showAlerts',
	linkOnOff: 'isLinkEnabled',
	link: 'link',
	// 1st horizontal line
	HlineVisible: 'hlineVisible',
	HlineValue: 'hlineValue',
	HlineColor: 'hlineColor',
	HlineWidth: 'hlineWidth',
	// 2nd horizontal line
	HlineVisible1: 'hlineVisible1',
	HlineValue1: 'hlineValue1',
	HlineColor1: 'hlineColor1',
	HlineWidth1: 'hlineWidth1',
	// 3rd horizontal line
	HlineVisible2: 'hlineVisible2',
	HlineValue2: 'hlineValue2',
	HlineColor2: 'hlineColor2',
	HlineWidth2: 'hlineWidth2',
	// series (trends)
	seriesvisible: 'visibility',
	seriescolor: 'color',
	serieswidth: 'width',
	seriesname: 'name',
	topcaption: 'topCaption',
	bottomcaption: 'bottomCaption',
	bottomhint: 'bottomHint',
	show_unit: 'showUnit',
	typegraph: 'typeGraph',
	multiplecount: 'multipleCount',
	//status indicator
	ind_vid: 'degree',
	ind_color1: 'normalIndicatorColor',
	ind_color2: 'emergencyIndicatorColor',
	ind_color3: 'warningIndicatorColor',
	ind_color4: 'turnedOffIndicatorColor',
	ind_color5: 'errorIndicatorColor',
	ind_comment1: 'normalIndicatorComment',
	ind_comment2: 'emergencyIndicatorComment',
	ind_comment3: 'warningIndicatorComment',
	ind_comment4: 'turnedOffIndicatorComment',
	ind_comment5: 'errorIndicatorComment',
	ind_d1: 'd1GroupNumber',
	ind_d2: 'd2GroupNumber',
	ind_d3: 'd3GroupNumber',
	ind_dg1: 'dg1GroupNumber',
	ind_dg2: 'dg2GroupNumber',
	ind_header1: 'header1',
	ind_header2: 'header2',
	ind_scalebar: 'scaleBar',
	ind_show_scalebar: 'isScaleBarEnabled',
	ind_show_d1: 'isD1ValueVisible',
	ind_show_d2: 'isD2ValueVisible',
	ind_show_d3: 'isD3ValueVisible',
	ind_show_header1: 'isHeader1Visible',
	ind_show_header2: 'isHeader2Visible',
	ind_stat: 'statusGroupNumber',
	ind_statname: 'ind_statname',
	ind_d1name: 'ind_d1name',
	ind_d2name: 'ind_d2name',
	ind_d3name: 'ind_d3name',
	ind_dg1name: 'ind_dg1name',
	ind_dg2name: 'ind_dg2name',
};

export enum ParametersValue {
	Center = 'Center',
	Left = 'left',
	Right = 'right',
	Top = 'start',
	Bottom = 'end',
}

export type ChartValue = {
	date: string;
	value: number | null;
	color?: string;
};

export enum AggregateTypes {
	Average = 'Среднее',
	Sum = 'Сумма',
	Current = 'Текущее',
}

export type Trend = {
	name: string;
	data: ChartValue[];
	width?: number | null;
	visible?: boolean;
	asqlGroup?: number;
	id?: number;
	unitName: string;
	round: number;
	color?: string;
	type?: 'line';
	typeGraph?: number;
	methodName?: string;
	isConsumption?: boolean;
	isVisibleOnChart?: boolean;
	multipleCount?: number;
};

export const chartParameters = {
	title: 'isTitleVisible',
	asqluser: 'asqlUser',
	asqlgroup: 'asqlGroup',
	asqltype: 'asqlType',
	usecapt: 'useCapt',
	HlineVisible: 'hlineVisible',
	HlineValue: 'hlineValue',
	HlineColor: 'hlineColor',
	HlineWidth: 'hlineWidth',
	HlineVisible1: 'hlineVisible1',
	HlineValue1: 'hlineValue1',
	HlineColor1: 'hlineColor1',
	HlineWidth1: 'hlineWidth1',
	HlineVisible2: 'hlineVisible2',
	HlineValue2: 'hlineValue2',
	HlineColor2: 'hlineColor2',
	HlineWidth2: 'hlineWidth2',
	asqlgroupname: 'asqlGroupName',
	asqlusername: 'asqlUserName',
	asqltypename: 'asqlTypeName',
	trend_mode: 'trendMode',
	img: 'backgroundFileName',
	serieswidth: 'seriesWidth',
	seriesname: 'seriesName',
	seriescolor: 'seriesColor',
	seriesvisible: 'seriesVisible',
	round: 'round',
	show_overperiod_data: 'showOverperiodData',
	typegraph: 'typeGraph',
	VertAxisName: 'vertAxisName',
	csqlchannel: 'channelNumber',
	multiplecount: 'multipleCount',
};

export type ChartConfiguration = {
	isTitleVisible: boolean;
	asqlUser: number;
	asqlGroup: number;
	asqlType: number;
	useCapt: boolean;
	hlineVisible: boolean;
	hlineValue: number;
	hlineColor: string;
	hlineWidth: number;
	hlineVisible1: boolean;
	hlineValue1: number;
	hlineColor1: string;
	hlineWidth1: number;
	hlineVisible2: boolean;
	hlineValue2: number;
	hlineColor2: string;
	hlineWidth2: number;
	asqlGroupName: string | null;
	asqlUserName: string | null;
	asqlTypeName: string | null;
	trendMode: string;
	seriesWidth: number | null;
	seriesName: string | null;
	seriesVisible: string | null;
	seriesColor: number;
};

export type SeriesConfiguration = {
	id: number;
	asqlGroup: number;
	seriesWidth: number | null;
	seriesName: string | null;
	seriesVisible: string | null;
	seriesColor: number;
};
declare global {
	const WMF2PNG: {
		getPNG(file: string): Promise<string>;
	};
}

export enum CalendarType {
	DayTime = 'daytime',
	Day = 'day',
	Month = 'month',
	Year = 'year',
	Period = 'period',
	PeriodWithTime = 'periodWithTime',
	Quarter = 'quarter',
}

export interface HardwareGroupListOptions extends UserId {
	pageNumber: number;
	pageRowCount: number;
	filterStr: string | null;
	fkChannel: number | null;
	serverId: number | null;
	isNeedUpdateList?: boolean;
	filterMode: number;
	orderMode: number;
	mode: number;
}

export type RpcQueryParameter = {
	Name: string;
	DbType: string;
	Value: number | string | null | boolean;
	Direction: string;
	Size?: string | number | null;
};

export type RpcQuery = {
	Sql: string;
	CommandType: string;
	Parameters: RpcQueryParameter[];
};

type OutputParametersKeys = '@Err' | '@TextErr' | '@TextWarn';

export type OutputParameters = {
	[key in OutputParametersKeys]: string;
};

// Versions
export type VersionsListResponse = {
	КодВерсии: number;
	НомерВерсии: number;
	РаботоспособнаяВерсия: boolean;
	АктуальнаяВерсия: boolean;
	ДатаСоздания: string;
	ДатаПоследнегоИзменения: string;
	НазваниеСистемы: string;
	Комментарий: string | null;
	КодСистемы: number;
};

// Form
export interface FetchFormParametersParams extends UserId {
	formId: number;
	versionCode: number;
}
export interface FetchFormParametersForEditingParams {
	formId: number;
	versionCode: number;
}
export type FetchFormObjectValueParams = {
	objectId: number;
	gr: number | null;
	visdelay: number;
	datatype: string;
	round?: number;
	isDynamicObject?: boolean;
	mode?: number;
};

export type FetchFormObjectParametersParams = {
	objectId: number;
	versionCode: number;
};

export interface ChangeFormNameParams extends UserId, Module {
	formId: number;
	versionCode: number;
	newFormName: string;
}

export interface PublishFormParams extends UserId, Module {
	formId: number;
}

export type UpdateFormParameterParams = {
	formId: number;
	value: string | number;
	parameterCode: number;
	versionCode: number;
	itHasPairedParameter?: boolean;
	pairedParameterValue?: string | number | null;
};

export type UpdateFormObjectParameterParams = {
	objectId: number;
	value: string | number | null;
	parameterCode: number;
	versionCode: number;
	itHasPairedParameter?: boolean;
	pairedParameterValue?: string | number | null;
};

export interface CreateObjectParams extends UserId, Module {
	x: number;
	y: number;
	formId: number;
	layerId: number | null;
}

export type FormParametersResponse = {
	КодФормы: number;
	НазваниеПараметра: string;
	ЗначениеПараметра: string;
};

export interface DeleteFormParams extends UserId, Module {
	id: number;
	versionCode: number;
}

export type DeleteFormResponse = {
	RowsDeleted: number;
};

export interface MoveFormParams extends UserId, Module {
	versionCode: number;
	formId: number;
	move: FormPosition.ABOVE | FormPosition.UNDER;
}

export type GetFormObjectDataQueryParams = {
	fromd?: string | null;
	tod?: string | null;
	gr: number | null;
	visdelay: number;
	datatype?: string | null;
	round?: number | null;
	mode: number;
	btn?: number | null;
	nullaserr?: number | null;
	notnullMinutediff?: number | null;
	hourSift?: number | null;
	useHint?: number | null;
	canDiagInclude?: number | null;
};
export interface CreateFormObjectParams extends UserId, Module {
	formId: number;
	x: number;
	y: number;
	layerId: number | null;
}
export interface DeleteFormObjectParams extends UserId, Module {
	objectId: number;
}
export interface FetchImageByIdParams extends UserId, Module {
	id: number;
}
export interface FetchImagesCollectionsParams extends UserId, Module {
	versionCode: number;
}
export interface CopyFormObjectParams extends UserId, Module {
	id: number;
	formId: number;
	versionId: number;
	x: number;
	y: number;
}

export type UpdateFormResponse = {
	RowsUpdated: number;
};

// Tree
export type TreeResponse = {
	КодФормы: number;
	КодРодительскойФормы: number | null;
	НомерПоПорядку: number | null;
	НомерТипаФормы: number;
	НазваниеФормы: string;
	ЕстьПотомки: number; // 0 || 1
	HasOwner: number; // 0 || 1
	CanEdit: number; // 0 || 1
	FK_TypesStorage: number | null; // 0 || 1 || null
};
export enum TypesStorage {
	Regulated = 'Regulated',
	Unregulated = 'Unregulated',
}
export const TYPES_STORAGE_LIST = [
	TypesStorage.Regulated,
	TypesStorage.Unregulated,
];
export type DiagnosticResponse = {
	КодФормыДиагностики: number;
};

// Image
export type ImageResponse = {
	NAME: string;
	BINARY_FILE: string;
};

export interface UploadImageParams extends UserId, Module {
	fileName: string;
	image: string;
	formId: number;
	replaceFlag: number;
	versionCode: number;
}
export interface FetchFormObjectsParams extends UserId {
	formId: number;
	versionCode: number;
}
//Chart
export interface FetchChartDataParams extends Module {
	gr: number;
	startDateTime: Date;
	endDateTime: Date;
	isMoscowTimeZone: boolean;
	discrete: string;
	round: number;
	gtype?: number;
	multipleCount?: number;
}
export interface FetchChartKoefParams extends UserId {
	gr: number;
}
export type ChartKoefResponse = {
	Unit_ID: number;
	Unit_Name: string;
	Method_Name: string;
	IsConsumption: number;
};

export type ChartKoefListResponse = {
	ID: number;
	Name: string;
	Coefficient: number;
};

export type FetchChartParametersParams = {
	formId: number;
	versionCode: number;
	chartName: string;
};
declare global {
	interface Window {
		appConfig: {
			KEYCLOAK_AUTH_ON: string;
			KEYCLOAK_CONFIG_URL: string;
			KEYCLOAK_CONFIG_REALM: string;
			KEYCLOAK_CONFIG_CLIENT_ID: string;
			KEYCLOAK_TOKEN_MIN_VALIDITY: string;
			KEYCLOAK_FLOW: string;
			RABBIT_USER: string;
			RABBIT_PASS: string;
			RABBIT_WS_URL: string;
			RABBIT_WS_CHANNEL_NAME: string;
		};
	}
}

export enum TooltipDirection {
	Up = 'up',
	Down = 'down',
	Right = 'right',
	Left = 'left',
}

export type ServerResponse = {
	ID: number;
	IP: string;
	FQDN: string;
	TextName: string;
	Comment: string;
	User_ID: string;
	LastModified: string;
	HaveDevices: boolean;
	HaveGroups: boolean;
	HaveUnConnCh: boolean;
};

export type DeviceResponse = {
	Number: number;
	Name: string;
	FK_DataServers: number;
	LastModified: string;
	Comment: string | null;
	ChannelsCount: string;
	ChannelsList: string | null;
	isFavorite: 0 | 1;
	RowNumber: number;
};

export type DevicesGroupsArchiveResponse = {
	Number: number;
	Name: string;
	DeviceType: string;
};

export type DeviceParameterResponse = {
	param_name: string;
	param_value: string;
};

export interface DevicesParams extends UserId {
	pageNumber?: number;
	pageRowCount?: number;
	filterMode?: number;
	filterStr?: string | null;
	serverId?: number | null;
}

export interface FilteredDevicesParams extends UserId {
	filterStr: string;
	moduleName?: ModuleName;
}

export interface DeviceParams extends UserId, Module {
	number?: number;
	name?: string;
	value?: string;
}

export interface DeviceArchiveParams extends UserId, Module {
	number: number;
}

export enum HeatingSeasonOperation {
	Add = 1,
	Update = 2,
	Delete = 3,
}
export interface UserId {
	userId: string;
}

export interface InputFormOptionsParams extends UserId, Module {}

export interface HeatingSeasonAction extends UserId, Module {
	seasonId?: number | null;
	seasonStartDate?: string | null;
	seasonEndDate?: string | null;
	operation?: HeatingSeasonOperation;
}

export interface ChannelsParams extends UserId {
	operation?: 'add' | 'set';
	serverId?: number | null;
	deviceId?: number | null;
	mode?: 1 | 2 | 3;
	pageNumber?: number;
	pageRowCount?: number;
	searchFrom?: string | null;
}

export type ChannelsChartDataParams = {
	startDateTime: Date;
	endDateTime: Date;
	channelNumber: number;
	discrete: string;
	round?: number;
	isMoscowTimeZone?: boolean;
	canDiagUse?: number;
};

export type ChannelResponse = {
	Number: number;
	Name: string;
	FK_DataServers: number;
	LastModified: string;
	Unit_ID: number;
	Unit_Name: string;
	FK_Methods: number;
	Method_Name: string;
	FK_TypesStorage: number;
	TypesStorage_Name: string;
	GroupsList: string;
	KoefList: string;
	IsFavorite: 0 | 1;
	RowNumber: number;
	FK_Devices: number;
	IsConsumption: number;
};

export type OptimizedPagination = {
	positionRow?: number;
	pageTotalCount: number;
	pageNumber: number;
	rowsPerPage: number;
};

export type ImagesCollectionResponse = {
	SKEY: number;
	NAME: string;
	BINARY_FILE?: string;
};

export type UploadImageResponse = Pick<
	ImagesCollectionResponse,
	'SKEY' | 'BINARY_FILE'
>;

export interface MoveObjectParams extends UserId, Module {
	objectId?: number;
	objectIdx: number;
	move: number;
	parameterName: string;
	formId?: number | null;
}

export type User = {
	id: string;
	firstName: string;
	lastName: string;
	email?: string;
	groups?: string[];
	preferredUsername: string;
};

export type UserResponse = {
	email: string;
	email_verified: boolean;
	family_name: string;
	given_name: string;
	name: string;
	preferred_username: string;
	sub: string;
};

// Based on the names in database
export enum Role {
	EM_ADMIN,
	EM_REPORT_ARCHIVE,
	EM_ANALITIC,
	EM_VIEW,
	EM_REPORTUGE_EDIT,
	EM_REPORTUGE_OPER,
	EM_EMERGEVENTS_EDIT,
	EM_EMERGEVENTS_CONFIRM,
	EM_NSI_EDIT,
	EM_BALANCE,
	EM_NSI_VIEW,
	EM_OPERATIONALINFORM,
}

export type RoleKey = keyof typeof Role;

export interface UserRoleResponse {
	ROLE_NAME: string;
	ID: null;
	ID_Group_Start: null;
	ID_Group_End: null;
}

interface AddObjectBase {
	formId?: number;
	objectId?: number;
	versionId: number | null;
}

export interface AddImagesParams extends AddObjectBase, UserId, Module {
	images: Image[];
	startFileNumber: number;
}
export interface FetchReportGroupListParams extends UserId, Module {
	formId: number;
}
export interface AddGroupsParams extends AddObjectBase, UserId, Module {
	groups: GroupListItem[];
}
export interface AddObjectQueryParams extends AddObjectBase, UserId, Module {
	value: string | number;
	parameterName: string;
	order?: number;
}

export interface DeleteObjectParams extends UserId, Module {
	objectId?: number | null;
	objectIdx?: number;
	parameterName: string;
	formId?: number;
	deleteAllFlag?: 0 | 1;
}

export interface UpdateFormObjectParams extends UserId, Module {
	objectId: number | null;
	paramIdx: number;
	value: string;
	versionId: number | null;
	paramName: string;
}

export interface AddFieldToFormObjectParams extends UserId, Module {
	formId: number | null;
	name: string;
	binary: string;
	versionCode: number;
}

export enum ChannelStatusCode {
	Normal = 0,
	LowMinValue = 1,
	HighMaxValue = 2,
	ConvertFloatError = 3,
	OPC = 4,
}

// объект для хранения сообщений и цветов
export const statusColors = {
	'#616160': 'Норма',
	'#C7A6CD': 'Ниже минимального',
	'#FDD58B': 'Больше Максимального',
	'#92BC8C': 'Ошибка конвертирования FLOAT',
	'#F8B176': 'Ошибка приема с OPC',
};
export const statusDetails = {
	[ChannelStatusCode.Normal]: { message: 'Норма', color: '#616160' },
	[ChannelStatusCode.LowMinValue]: {
		message: 'Ниже минимального',
		color: '#C7A6CD',
	},
	[ChannelStatusCode.HighMaxValue]: {
		message: 'Больше Максимального',
		color: '#FDD58B',
	},
	[ChannelStatusCode.ConvertFloatError]: {
		message: 'Ошибка конвертирования FLOAT',
		color: '#92BC8C',
	},
	[ChannelStatusCode.OPC]: {
		message: 'Ошибка приема с OPC',
		color: '#F8B176',
	},
};

export type HorizontalLine = {
	id: number;
	value?: number;
	visible?: boolean;
	width?: string | number;
	color: string | number;
	name: string;
};

export interface CreateSeriesParams {
	formId: number | null;
	versionId: number;
}

export interface CreateSeriesResponse {
	err: null | 1;
	trendId: number | null;
	textErr: string | null;
}

export interface FetchDiagnosticChartParams {
	deviceId: string;
	fromDate: string;
	toDate: string;
}

export interface FetchDiagnosticChartResponse {
	ДатаВремя: string;
	Ok: string;
	CRC: string;
	'ТО прибора': string;
	'ТО ICP': string;
	lost_value: string;
}
export type ReportFormGroupListResponse = {
	ПорядковыйНомер: number;
	НомерГруппы: number;
	НазваниеГруппы: string;
};
export type GroupListResponse = {
	Number: number;
	Name: string;
	FK_DataServers: number;
	LastModified: string;
	Unit_ID: number;
	Unit_Name: string;
	FK_Methods: number;
	Method_Name: string;
	FK_TypesStorage: number;
	TypesStorage_Name: string;
	GroupsList: string;
	KoefList: string;
	IsFavorite: boolean;
	RowNumber: number;
	FK_Devices: number;
	ActiveFormula: boolean;
	CanEdit: number;
	ChannelsCount: number;
	Formula: boolean;
	Number_EWork: number;
	isFavorite: boolean;
};

export interface DeviceHealthinessResponse {
	Name: string;
	НомерПрибора: number;
	num_ok: number;
	num_ok_clr: string;
	num_crc: number;
	num_crc_clr: string;
	num_to: number;
	num_to_clr: string;
	num_icp: number;
	num_icp_clr: string;
	dat: string;
}

export interface DeleteGroupsParams extends UserId, Module {
	groups: GroupsInReportForm[];
	deleteAllFlag: 0 | 1;
	formId: number;
}

export type PointsResponse = {
	ID: number;
	SortOrder: number;
	ShortName: string;
	InputCaption: string;
	Name: string;
	Comment: string;
	ActiveFrom: string;
	ActiveTo: string;
	ID_User: string;
	ChangeDT: string;
	FK_EnergyResources: number;
	LastModified: string;
	CoreChannelsNumber: number;
	ChannelName: string;
	Coefficient: number | null;
	FK_Devices: number;
	LinkedPointID: number | null;
	LinkedPointName: string | null;
	LinkedPointCoeff: number | null;
	LinkedPointComment: string | null;
	DeviceName: string;
};

export type EnergyResourceResponse = {
	ID: number;
	ShortName: string;
	Name: string;
	Comment: string | null;
	ID_User: string | null;
	ChangeDT: string | null;
	BaseHour: number;
};

export type PointChannelResponse = {
	ID: number;
	FK_Points: number;
	ShortName: string;
	CoreChannelsNumber: number;
	ChannelName: string;
	BaseCumulativeValue: number;
	Coefficient: number;
	Comment: string;
	FK_Devices: number;
	DeviceName: string;
	ActiveFrom: string;
	ActiveTo: string;
	LastModified: string;
	canDelete: number;
	ID_User: string;
	ChangeDT: string;
};

export interface ObjectValue {
	objectValue: number | null;
	nulls: number;
	canerr: string;
	groupNumber?: number;
	objectId?: number;
}
export interface StatusIndicatorValue extends ObjectValue {
	d1Value: number | null;
	d2Value: number | null;
	d3Value: number | null;
	dg1Value: number | null;
	dg2Value: number | null;
	statusCode: number | null;
	objectId: number;
}
export enum SortOrder {
	Asc = 1,
	Desc = -1,
	None = 0,
}

export interface FetchDiagnosticGroupCurrentStateParams extends UserId {
	groupId: number;
}

export type FetchChannelsDiagnosticParams = {
	interval: number;
};

export type FetchChannelsDiagnosticResponse = {
	ChNumber: number; // Номер канала
	ChName: string; // Имя канала
	diag_code: ChannelStatusCode; // Код проблемы
	diag_name: string; // Имя проблемы
	DevNumber: number; // Номер прибора
	DevName: string; // Имя прибора
	dat: string; // Дата последнего значения прибора
	lastdat: string; // Дата последних данных в БД
	ErrPercLast24H: number; // Процент ошибок за сутки
	ErrLast24H: number; // Количество ошибок за сутки
	FK_DataServers: number; // Номер сервера
};

export type SearchFilters = Record<string, string>;

export type SortOptions = {
	accessor: string;
	order: SortOrder;
};

export type FilterOptions = {
	name: string;
	key: string;
	isChecked: boolean;
};

export interface AccountingNodeMethods extends UserId, Module {}

export type FormulaElement = {
	FK_Group?: number;
	ID_Channel?: number | null;
	ID_Group?: number | null;
	Oper?: string | null;
	Ord: number;
};

export type GroupComponentsTreeResponse = {
	IsGroup: number;
	ID_Companent: number;
	Name: string;
	UnitName: string;
	Ord: number;
	ID: number;
	PID: number | null;
	ActiveFormula: boolean;
	ChOb: number | null;
	KI: number | null;
	KU: number | null;
	Value: number | null;
	UnitID: number;
	Koef: number | null;
	IsConsumption: number | null;
	FK_TypeStorage: number | null;
	FK_MetodName: string;
};

export type GroupComponentsTree = {
	isGroup: boolean;
	idCompanent: number;
	name: string;
	unitName: string;
	order: number;
	id: number;
	parentId: number | undefined;
	activeFormula: boolean;
	chOb: number | null;
	ki: number | null;
	ku: number | null;
	value: string | null;
	unitID: number;
	koef: number | null;
	isConsumption: boolean;
	typeStorage: string;
	methodName: string;
};

export type ReportsResponse = {
	ID: number;
	ChangeDT: string;
	Name: string;
	Comment: string;
	RepURL: string;
};

export type ReportItemsResponse = {
	ID: number;
	FK_Reports: number;
	PID: number;
	SortOrder: number;
	ReportPositionNumber: string;
	PositionName: string;
	IsCalculated: number | null;
	FK_Points: number | null;
	Coefficient: number;
	ActiveFrom: string | null;
	ActiveTo: string | null;
	ChangeDT: string;
	LEVEL: number;
	PointName: string;
};

export type ChannelsChartDataResponse = {
	dat: string;
	dan: number;
	code: number;
};

export type VolumeOfMergedCondensateResponse = {
	DAT: string;
	MAXV: number;
	MINV: number;
	DIFF: number;
	RESULT: number;
	dat: string;
};

export type VolumeOfMergedCondensate = {
	date: string;
	max: number;
	min: number;
	diff: number;
	result: number;
};

export interface EditReportParams extends UserId, Module {
	id?: number;
	name: string;
	comment: string;
}

export interface CommonIdParams extends UserId, Module {
	id: number;
}

export interface CreateReportItemParams extends UserId, Module {
	reportId: number;
	targetId: number;
	insertPosition: number;
	positionName: string;
}

export interface EditReportItemParams extends UserId, Module {
	id: number;
	positionName: string;
	reportPositionNumber: string;
	isCalculated: number | null;
	pointId: number | null;
	coefficient: number;
	activeFrom: string | null;
	activeTo: string | null;
}

export interface MoveReportItemParams extends UserId, Module {
	id: number;
	targetId: number;
	insertPosition: number;
}

export type ExcelRow = {
	[x: string]: string | number | undefined;
	date?: string;
};

export type PrintFormResponse = {
	ID: number;
	FK_Reports: number;
	Name: string;
	Comment: string;
	ID_User: string;
	ChangeDT: string;
	repURL: string;
};
export type EditResponse = {
	RowsUpdated: number;
};
export type CreatePrintFormResponse = {
	RowsUpdated: number;
};

export type DeletePrintFormResponse = CreatePrintFormResponse;
export type UpdatePrintFormResponse = CreatePrintFormResponse;
export type MovePrintFormPositionResponse = CreatePrintFormResponse;
export type CreatePrintFormPositionResponse = CreatePrintFormResponse;
export type DeletePrintFormPositionResponse = CreatePrintFormResponse;
export type SavePrintFormPositionSettingsResponse = CreatePrintFormResponse;
export type UnsyncPrintFormPositionResponse = CreatePrintFormResponse;
export type SyncPrintFormPositionResponse = CreatePrintFormResponse;
export type SyncPrintFormParameterAdapter = CreatePrintFormResponse;

export interface CreatePrintFormParams extends UserId, Module {
	reportId: number;
	name: string;
	comment: string;
}

export interface UpdatePrintFormParams extends CreatePrintFormParams {}

export interface FetchPrintFormPositionParams extends UserId, Module {
	printFormId: number;
}

export enum PrintFormTextAlign {
	Left = 1,
	Right = 2,
	Center = 3,
}

export type PrintFormTextAlignKey = keyof typeof PrintFormTextAlign;

export type PrintFormPositionResponse = {
	ID: number;
	SortOrder: number;
	ReportPositionNumber: string | null;
	RepItemName: string | null;
	RepItemPositionNumber: number | null;
	PositionName: string;
	Bold: number;
	FK_TextAlign: PrintFormTextAlign;
	FK_ReportsTrees: number | null;
	ID_User: string;
	ChangeDT: string;
	HexColor: string;
	FontHexColor: string | null;
	accountingPriority: number; // 0 || 1
	FK_ExternalCalculations_Method: number | null;
	NUMPR: number | null;
	DeviceName: string | null;
	NUMCAN: number | null;
	ChannelName: string | null;
	FK_Methods: number | null;
	MethodName: string | null;
};

export interface PrintFormPosition extends UserId {
	bold: boolean;
	textAlign: PrintFormTextAlign;
	bgColor: string;

	name: string;
	positionNumber: string | null;
	sortOrder: number;
	id: number;
	treeId: number | null;
	lastModified: string;
	treeName: string;
	fontColor: string | null;
	priority: number; // 0 || 1
	priorityMethod: number | null;
	deviceId: number | null;
	deviceName: string | null;
	channelId: number | null;
	channelName: string | null;
	method: number | null;
	methodName: string | null;
}

export interface FetchPrintFormTreeParams extends UserId, Module {
	printFormId: number;
}

export type PrintFormTreeResponse = {
	ID: number;
	FK_Reports: number;
	PID: number | null;
	PositionName: string;
	LEVEL: number;
	ID_RepPosition: number | null;
};

export type PrintFormTree = {
	nodeId: number;
	nodeName: string;
	reportId: number;
	parentNodeId?: number;
	positionId: number | null;
	lvl: number;
	isOpen?: boolean;
};

export interface DeletePrintFormParams extends UserId, Module {
	id: number;
}

export type EmergencyEventsTreeResponse = {
	Код: number;
	КодРодителя: number | null;
	Название: string;
	Уровень: number;
	НомерПоПорядку: number;
	КодПараметра: number | null;
	БазаДанных: number | null;
	НомерГруппыДляКонтроля: number | null;
	НомерГруппыДинамическогоОбъекта: number | null;
	КодЕдиницыИзмеренияУставки: number | null;
	ЕдиницаИзмеренияУставки: number | null;
	РазрешеноРедактирование: boolean;
	LastModified: string;
	КодТипаДанных: number | null;
	ТипДанных: string;
};

export type TransparentEmergencyEventsStatusResponse = {
	КодПараметра: number;
	НазваниеПараметра: string;
	ЕдиницаИзмерения: string;
	МинимальноеЗначение: number | null;
	МаксимальноеЗначение: number | null;
	УставкаПоВремени: number | null;
	Событие: string;
	КодТипаСобытия: number;
	КодАварии: number;
	НомерГруппыДанных: number;
	НачалоПоследнегоСобытия: string;
	КонецПоследнегоСобытия: string;
	НомерРегистратора: number | null;
	ДатаКвитирования: string | null;
	Комментарий: string | null;
	Ответственные: string | null;
	КодПользователяКвитирования: number | null;
	ПользовательКвитирования: string | null;
	gtype: number | null;
	multipleCount: number | null;
};

export type TransparentEmergencyEventsStatusList = {
	parameterCode: number;
	parameterName: string;
	unit: string;
	min: number | null;
	max: number | null;
	setpoint: number | null;
	event: string;
	eventCodeType: number;
	eventCode: number;
	groupId: number;
	lastEventStartDateTime: string;
	lastEventEndDateTime: string;
	kvitDateTime: string | null;
	comment: string | null;
	responsiblePersons: string | null;
	kvitPerson: string | null;
	gtype: number | null;
	multipleCount: number | null;
};

export enum EmergencyEventType {
	NoDataSource,
	Good,
	OutOfMin,
	OutOfMax,
	Failure,
	OutOfMinOrMax,
	Accident,
}

export enum EmergencyEventTypeLabel {
	NoDataSource = 'Нет данных',
	Good = 'Норма',
	OutOfMin = 'Ниже',
	OutOfMax = 'Выше',
	Failure = 'Сбой',
	OutOfMinOrMax = 'Ниже или выше нормы',
	Accident = 'Авария',
}

export enum EmergencyEventTypeColors {
	NoDataSource = '#F4F4F4',
	Good = '#92BC8C',
	OutOfMin = '#C7A6CD',
	OutOfMax = '#F9A823',
	Failure = '#E5E5E5',
	OutOfMinOrMax = '#F39646',
	Accident = '#EB5835',
}

export type TransparentEmergencyEventsCountResponse = {
	Код: number;
	КодРодителя: number | null;
	Название: string;
	КоличествоСобственныхАварий: number;
	КоличествоВнутреннихАварий: number;
};

export type EmergencyEventsTreeItem = {
	id: number;
	parentId: number | undefined;
	displayName: string;
	name: string;
	level: number;
	order: number;
	parameterCode: number | null;
	dataBaseCode: number | null;
	controlGroupNumber: number | null;
	dynamicObjectGroupNumber: number | null;
	setpointsUnitCode: number | null;
	setpointsUnit: number | null;
	canEdit: boolean;
	lastModified: string;
	isLast: boolean;
	isOpen?: boolean;
	dataTypeCode: number | null;
	dataType: string | null;
};

export type AssignedEmergencyEventsNumberResponse = {
	КоличествоСобытий: number;
};

export enum AcknowledgementStatus {
	New = 'new',
	Acknowledged = 'acknowledged',
}

export type AssignedEmergencyEvent = {
	id: number;
	paramName: string;
	valueMin: number | null;
	valueMax: number | null;
	setPoint: string;
	lastEventStartDateString: string;
	lastEventStartDate: Date;
	status: AcknowledgementStatus;
	eventName: string;
	responsibles: string;
	acknowledgementAuthor: string;
	acknowledgementDate: string;
	comment: string;
	groupNumber: number | null;
	unit: string;
};

export type AssignedEmergencyEventResponse = {
	КодПараметра: number;
	НазваниеПараметра: string;
	ЕдиницаИзмерения: string;
	Квитировано: boolean;
	МинимальноеЗначение: number;
	МаксимальноеЗначение: number;
	УставкаПоВремени: number;
	Событие: string;
	КодТипаСобытия: number;
	КодАварии: number;
	НомерГруппыДанных: number;
	НачалоПоследнегоСобытия: string;
	КонецПоследнегоСобытия: string;
	НомерРегистратора: number;
	ДатаКвитирования: string;
	Комментарий: string;
	КодПользователяКвитирования: number;
	Ответственные: string;
	ФИОПользователяКвитирования: string;
};

export enum AcknowledgementStatusFilter {
	All = '0',
	Acknowledged = '1',
	NotAcknowledged = '2',
}

export interface FetchAssignedEmergencyEventParams extends UserId, Module {
	dateFrom: string;
	dateTo: string;
	acknowledgementStatus: AcknowledgementStatusFilter;
}
export interface AcknowledgeAssignedEmergencyEventParams
	extends UserId,
		Module {
	nodeId: number;
	comment: string;
}

export type ParameterCriterionsResponse = {
	Код: number;
	ДатаОт: string;
	ДатаДо: string;
	МинимальноеЗначение: number | null;
	МаксимальноеЗначение: number | null;
	ИнтервалОценки: number | null;
	ТранслироватьВМониторинги: boolean;
	LastModified: string;
	ЕдиницаИзмерения: string;
	НомерГруппыДляКонтроля: number | null;
	НомерГруппыДинамическогоОбъекта: number | null;
};

export type ParameterCriterions = {
	id: number;
	startDateTime: string;
	endDateTime: string;
	min: number | null;
	max: number | null;
	evaluationInterval: number | null;
	broadcastToMonitoring: boolean;
	lastModified: string;
	controlGroupNumber: number | null;
	dynamicObjectGroupNumber: number | null;
	unitName: string;
};

export interface EditParameterCriterionsParams extends UserId, Module {
	id: number;
	parameterId: number;
	min: number | null | string;
	max: number | null | string;
	evaluationInterval: number | null | string;
	startDateTime: string;
	endDateTime: string | null;
	lastModified: string;
}

export interface CreateParameterCriterionsParams extends UserId, Module {
	parameterId: number;
}

export interface DeleteParameterCriterionsParams extends UserId, Module {
	id: number;
	lastModified: string;
}

export type FetchTransparentEmergencyEventsCount = {
	id: number;
	dateTime: string;
	transparentId: number;
};

export interface MoveParameterParams extends UserId, Module {
	id: number;
	lastModified: string;
	sequenceNumber: number;
}

export interface CreateNewParameterParams extends UserId, Module {
	id: number;
	parentId: number | null;
	order: number;
	name: string;
	controlGroupNumber: number | null;
	dynamicObjectGroupNumber: number | null;
	unitId: number | null;
	itHasControlParameter: boolean;
	dataTypeCode: number;
}

export interface SaveParameterParams extends UserId, Module {
	id: number;
	name: string;
	controlGroupNumber: number | null;
	dynamicObjectGroupNumber: number | null;
	unitId: number | null;
	lastModified: string;
	dataTypeCode: number;
}

export type PriorityMethodResponse = {
	ID: number;
	NAME: string;
	Comment: string | null;
	ObjectToSelect: number;
};

export type PriorityMethod = TOption & {
	comment: string;
	objectToSelect: number; // id of modal to open
};

export enum PriorityMethodSource {
	Archive = 'archive',
	Channel = 'channel',
}

export interface MovePrintFormPositionParams extends UserId, Module {
	from: number;
	to: number;
}

export interface CreatePrintFormPositionParams extends UserId, Module {
	id: number;
}

export interface DeletePrintFormPositionParams extends UserId, Module {
	id: number;
}

export interface SavePrintFormPositionSettingsParams extends UserId, Module {
	id: number;
	number: string | null;
	name: string;
	bold: number; // 0 || 1
	textAlign: PrintFormTextAlign;
	bgColor: string; // hex
	fontColor: string | null; // hex
	priority: number; // 0 || 1
	methodId: number | null;
	deviceId: number | null;
	channelId: number | null;
}

export interface UnsyncPrintFormPositionParams extends UserId, Module {
	nodeId: number;
}

export interface SyncPrintFormPositionParams extends UserId, Module {
	reportItemId: number;
	printReportItemId: number;
}

export interface FetchPrintFormParametersParams extends UserId, Module {
	printReportId: number;
}

export interface SyncPrintFormParametersParams extends UserId, Module {
	paramId: number;
	printReportId: number;
}

export interface CommonPrintFormParametersParams extends UserId, Module {
	linkId: number;
}

export interface AddParameterValuePrintFormParams
	extends CommonPrintFormParametersParams {
	name: string;
	dateFrom: string;
	dateTo: string;
}

export type InputFormSelectOptionsResponse = {
	ID: number;
	Name: string;
};

export type InputFormPointSelectOptionsResponse = {
	ID: number;
	NAME: string;
};

export interface FetchDevicesURSV510Params extends UserId, Module {}

export type FetchDevicesResponse = {
	devices: Device[];
	pagination: OptimizedPagination;
};

export type InputFormHeaderResponse = {
	ID: number;
	FieldOrder: number;
	FieldDatasetName: string;
	FieldTitle: string;
	FieldMinWidth: number | null;
	FieldMaxWidth: number | null;
	FieldFixed: string | null;
	FieldType: string;
	IsParentVisible: boolean;
	ParentGroupOrder: number;
	ParentTitle: string | null;
	ParentMinWidth: number | null;
	ParentMaxWidth: number | null;
	BottomFieldDatasetName: string | null;
	FieldComment: string | null;
};

export type AssignedResponsiblePersonsListResponse = {
	SKEY: number;
	Код: number;
	ACC_NAME: string;
	LastModified: string;
};

export type ResponsiblePersonsListResponse = {
	SKEY: number;
	ACC_UID: string;
	ACC_NAME: string;
	ACC_EMAIL: string;
};

export interface AssignResponsiblePersonParams extends UserId, Module {
	skey: number;
	id: number;
}

export interface UnassignResponsiblePersonParams extends UserId, Module {
	recordCode: number;
	lastModified: string;
}

export interface ChangeAssignedResponsiblePersonParams extends UserId, Module {
	recordCode: number;
	skey: number;
	lastModified: string;
}

export enum SelectGroupMode {
	Monitoring = 'Monitoring',
	EmergencyEvents = 'EmergencyEvents',
	DynamicChart = 'DynamicChart',
}

export type SaveNewParameterResponse = {
	КодСозданногоУзла: number;
};

export interface PrintFormParameterResponse
	extends PrintFormParameterValueResponse {
	ID_PrintRepLinkParam: number;
	ID_Param: number;
	Name: string;

	inReport: number;
}

export type SyncPrintFormParameterResponse = {
	['@LogOperation']: { ID: number };
};

export type NotSyncedPrintFormParameterResponse = {
	ID_Param: number;
	Name: string;
};

export interface PrintFormParameterValue {
	valueId: number;
	valueName: string;
	dateFrom: Date;
	dateTo: Date;
	isActive: boolean;
}

export interface PrintFormParameter extends PrintFormParameterValue {
	linkId: number;
	paramId: number;
	paramName: string;
	isInReport: boolean;
	dateFromString: string;
	dateToString: string;
}

export type PrintFormParameterNotSynced = SelectOption;

export enum ReportPath {
	UGE = 'Отчёты УГЭ/',
	OperInform = 'Оперативная справка/',
	Balances = 'Балансы/',
}

export enum ReportDestination {
	Instrumentation = 'ПоказанияПриборов',
	LogBook = 'Журнал учета',
	CorrectionLog = 'Журнал коррекций',
	ConstantLog = 'Журнал констант',
	DevicesStatus = 'Состояние приборов',
	RetrofittingAccountingNodes = 'Дооснащение приборами учета',
	StatisticalProcessing = 'Статистика отклонений',
	PageNaturalGas = 'Природный газ',
}

export interface PrintFormParameterValueResponse {
	ID_Value: number;
	StringValue: string;
	ActiveFrom: string;
	ActiveTo: string;
	isActive: number;
}

export interface ReportUrl extends ReportUrlValues {
	path: string;
	destination?: ReportDestination | ReportType;
}

export interface ReportUrlValues {
	fromDate?: string;
	toDate?: string;
	id?: number;
}

export interface ReplaceReportUrlValuesProps extends ReportUrlValues {
	url: string;
}

export type InputFormSessionResponse = {
	SessionID: number | null;
	MSG: string | null;
};

export type InputFormCreateSessionResponse = {
	SessionID: number | null;
};

export type SwitcherItemType = {
	id: string;
	title: string | React.ReactElement;
};

export interface CreateNodeParams extends UserId, Module {
	deviceId: number;
	nodeName: string;
}

export interface DeleteNodeParams extends UserId, Module {
	nodeId: number;
}

export interface EditNodeParams extends UserId, Module {
	nodeId: number;
	nodeName: string;
	lastModified: string;
}

export interface UpdateChannelNodeParams extends UserId, Module {
	linkId: number;
	newNodeId: number;
	linkLastModified: string;
}

export interface UpdateEquipmentPieceNodeParams extends UserId, Module {
	linkId: number;
	newNodeId: number | null;
	newChannelId: number | null;
	linkLastModified: string;
}

export interface LinkEquipmentPieceParams extends UserId, Module {
	newNodeId: number | null;
	newChannelId: number | null;
	equipmentId: string;
}

export type InputFormPointsHeaderResponse = {
	ID: number;
	FieldOrder: number;
	FieldDatasetName: string;
	FieldTitle: string;
	FieldMinWidth: number | null;
	FieldMaxWidth: number | null;
	FieldFixed: string | null;
	FieldType: string;
	IsEditable: boolean;
	IsParentVisible: boolean;
	ParentGroupOrder: number;
	ParentTitle: string | null;
	ParentMinWidth: number | null;
	ParentMaxWidth: number | null;
	FK_DailyPoints: number;
};

// Form layers
export enum ConfigurationTypes {
	Inspector = 'inspector',
	Layers = 'layers',
}
export interface SystemLayersInfoParams extends UserId, Module {
	systemCode: number;
}

export interface CreateSystemLayerParams extends UserId, Module {
	systemCode: number;
	layerName: string;
	comment: string;
}

export interface UpdateSystemLayerParams extends UserId, Module {
	layerName: string;
	comment: string;
	layerId: number;
	lastModified: string;
}
export interface DeleteSystemLayerParams extends UserId, Module {
	layerId: number;
	lastModified: string;
}
export interface ChangeFormObjectLayerParams extends UserId, Module {
	layerId: number;
	objectId: number;
}
export interface GetFormLayersParams extends UserId, Module {
	formId: number;
}
export interface CreateFormLayerParams extends UserId, Module {
	formId: number;
	layerId: number;
	parentLayerId?: number;
}
export interface ReplaceFormLayerParams extends UserId, Module {
	lastModified: string;
	layerId: number;
	parentLayerId: number;
	prevLayerId: number;
}
export interface DeleteFormLayerParams extends UserId, Module {
	lastModified: string;
	layerId: number;
}
export interface GetSystemLayerFormsParams extends UserId, Module {
	layerId: number;
}

export type SystemLayersResponse = {
	Код: number;
	Название: string;
	Описание: string;
	КодСистемы: number;
	КодВерсии: number;
	LastModified: string;
};
export type SystemLayerFormsResponse = {
	Код: number;
	Название: string;
	КодВерсии: number;
	КоличествоОбъектов: number;
};

export type SystemLayer = {
	id: number;
	name: string;
	comment: string;
	systemCode: number;
	lastModified: string;
};
export type SystemLayerForms = {
	id: number;
	name: string;
	systemCode: number;
	objectsCount: number;
};

export type FormLayersResponse = {
	Код: number;
	КодСлояСистемы: number;
	КодРодительскогоСлоя: number;
	КодФормы: number;
	НомерПоПорядку: number;
	LastModified: string;
	Название: string;
};
export type FormLayer = {
	id: number;
	parentId: number | undefined;
	name: string;
	order: number;
	layerId: number;
	lastModified: string;
	formId: number;
};

export type NSIMeasuringInstrumentsResponse = {
	instruments: NSIMeasuringInstrument[];
	pagination: NSIMeasuringInstrumentsPaginationResponse;
};
export interface AvailableFiltersNSIParams extends UserId, Module {}

export enum NSIParameterType {
	Boolean = 5,
	List = 7,
}

export interface AvailableFiltersNSIResponseItem {
	Код: number;
	КодЗначения: number;
	ТипОбъектаНСИ: number;
	ТипПараметра: NSIParameterType;
	НазваниеПараметра: string;
	Значение: string | null;
}

export interface AvailableFiltersByObjectTypes {
	[key: string]: TreeItem[];
}
export type ColumnTable = {
	accessor: string;
	text: string | number;
	width: number;
	isVisible: boolean;
	renderHeaderCell?: (props: TableCellProps) => React.ReactNode;
};

export type DefaultListResponse = {
	DisplayName: string;
	Val: string;
};
export default {};
export enum EmergencyEventsReportTypes {
	Events = 'Events',
	Criterions = 'Criterions',
}
