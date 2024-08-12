import {
	AcknowledgeAssignedEmergencyEventParams,
	AssignResponsiblePersonParams,
	ChangeAssignedResponsiblePersonParams,
	CreateNewParameterParams,
	CreateParameterCriterionsParams,
	DeleteParameterCriterionsParams,
	EditParameterCriterionsParams,
	FetchAssignedEmergencyEventParams,
	FetchTransparentEmergencyEventsCount,
	MoveParameterParams,
	SaveParameterParams,
	UnassignResponsiblePersonParams,
	UserId,
} from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';

export function getEmergencyEventsTreeQuery() {
	return {
		Sql: '[MonitoringModePower].[EmEvents].[Get_ДеревоРазделовИПараметров]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@СтартовыйУзел',
				DbType: 'Int',
				Value: null,
				Direction: 'Input',
			},
			{
				Name: '@ВключаяЭлектроснабжение',
				DbType: 'Boolean',
				Value: 'True',
				Direction: 'Input',
			},
			{
				Name: '@ВключаяЛистья',
				DbType: 'Boolean',
				Value: 'True',
				Direction: 'Input',
			},
		],
	};
}
export function getParameterCriterions(paramCode: number) {
	return {
		Sql: '[MonitoringModePower].[EmEvents].[Get_КритерииПараметра]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодПараметра',
				DbType: 'Int',
				Value: paramCode,
				Direction: 'Input',
			},
		],
	};
}
export function createParameterCriterion({
	parameterId,
	userId,
	moduleName = ModuleName.Test,
}: CreateParameterCriterionsParams) {
	return {
		Sql: '[MonitoringModePower].[EmEvents].[Ins_СоздатьКритерийПараметра]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодПараметра',
				DbType: 'Int',
				Value: parameterId,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'Int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function editParameterCriterion({
	id,
	userId,
	parameterId,
	min,
	max,
	evaluationInterval,
	startDateTime,
	endDateTime,
	lastModified,
	moduleName = ModuleName.Test,
}: EditParameterCriterionsParams) {
	return {
		Sql: '[MonitoringModePower].[EmEvents].[Upd_ИзменитьКритерийПараметра]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодКритерия',
				DbType: 'Int',
				Value: id,
				Direction: 'Input',
			},
			{
				Name: '@КодПараметра',
				DbType: 'Int',
				Value: parameterId,
				Direction: 'Input',
			},
			{
				Name: '@МинимальноеЗначение',
				DbType: 'Float',
				Value: min,
				Direction: 'Input',
			},
			{
				Name: '@МаксимальноеЗначение',
				DbType: 'Float',
				Value: max,
				Direction: 'Input',
			},
			{
				Name: '@ИнтервалОценки',
				DbType: 'Int',
				Value: evaluationInterval,
				Direction: 'Input',
			},
			{
				Name: '@ДатаНачалаДействияУставок',
				DbType: 'DateTime',
				Value: startDateTime,
				Direction: 'Input',
			},
			{
				Name: '@ДатаОкончанияДействияУставок',
				DbType: 'DateTime',
				Value: endDateTime,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'Int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function deleteParameterCriterion({
	id,
	userId,
	lastModified,
	moduleName = ModuleName.Test,
}: DeleteParameterCriterionsParams) {
	return {
		Sql: '[MonitoringModePower].[EmEvents].[Del_УдалитьКритерийПараметра]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодКритерия',
				DbType: 'Int',
				Value: id,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'Int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function moveParameter({
	id,
	userId,
	lastModified,
	sequenceNumber,
	moduleName = ModuleName.Test,
}: MoveParameterParams) {
	return {
		Sql: '[MonitoringModePower].[EmEvents].[Upd_ИзменитьПорядковыйНомерУзла]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодУзла',
				DbType: 'Int',
				Value: id,
				Direction: 'Input',
			},
			{
				Name: '@УвеличитьПорядковыйНомер',
				DbType: 'Int',
				Value: sequenceNumber,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'Int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function getResponsiblePersons() {
	return {
		Sql: '[MonitoringModePower].[EmEvents].[Get_СписокОтветственных]',
		CommandType: 'StoredProcedure',
		Parameters: [],
	};
}
export function getAssignedResponsiblePersons(parameterId: number) {
	return {
		Sql: '[MonitoringModePower].[EmEvents].[Get_СписокНазначенныхОтветственных]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодУзла',
				DbType: 'Int',
				Value: parameterId,
				Direction: 'Input',
			},
		],
	};
}
export function assignResponsiblePerson({
	userId,
	skey,
	id,
	moduleName = ModuleName.Test,
}: AssignResponsiblePersonParams) {
	return {
		Sql: '[MonitoringModePower].[EmEvents].[Ins_НазначитьОтветственного]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@SKEY',
				DbType: 'Int',
				Value: skey,
				Direction: 'Input',
			},
			{
				Name: '@КодУзла',
				DbType: 'Int',
				Value: id,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'Int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function unassginResponsiblePerson({
	userId,
	recordCode,
	lastModified,
	moduleName = ModuleName.Test,
}: UnassignResponsiblePersonParams) {
	return {
		Sql: '[MonitoringModePower].[EmEvents].[Del_УдалитьОтветственного]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодЗаписи',
				DbType: 'Int',
				Value: recordCode,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'Int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function changeAssignedResponsiblePerson({
	userId,
	recordCode,
	skey,
	lastModified,
	moduleName = ModuleName.Test,
}: ChangeAssignedResponsiblePersonParams) {
	return {
		Sql: '[MonitoringModePower].[EmEvents].[Upd_ЗаменитьОтветственного]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодЗаписи',
				DbType: 'Int',
				Value: recordCode,
				Direction: 'Input',
			},
			{
				Name: '@SKEY',
				DbType: 'Int',
				Value: skey,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'Int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function saveNewParameter({
	id,
	userId,
	parentId,
	order,
	controlGroupNumber,
	dynamicObjectGroupNumber,
	unitId,
	itHasControlParameter,
	name,
	dataTypeCode = 0,
	moduleName = ModuleName.Test,
}: CreateNewParameterParams) {
	return {
		Sql: '[MonitoringModePower].[EmEvents].[Ins_СоздатьУзелДерева]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодРодителя',
				DbType: 'Int',
				Value: parentId,
				Direction: 'Input',
			},
			{
				Name: '@КодТекущегоУзла',
				DbType: 'Int',
				Value: id,
				Direction: 'Input',
			},
			{
				Name: '@ВставитьПоОтношениюКТекущемуУзлу',
				DbType: 'Int',
				Value: order,
				Direction: 'Input',
			},
			{
				Name: '@Название',
				DbType: 'String',
				Value: name,
				Direction: 'Input',
			},
			{
				Name: '@КонтролируемыйПараметр',
				DbType: 'Boolean',
				Value: itHasControlParameter,
				Direction: 'Input',
			},
			{
				Name: '@НомерГруппыДляКонтроля',
				DbType: 'Int',
				Value: controlGroupNumber,
				Direction: 'Input',
			},
			{
				Name: '@НомерГруппыДинамическогоОбъекта',
				DbType: 'Int',
				Value: dynamicObjectGroupNumber,
				Direction: 'Input',
			},
			{
				Name: '@КодЕдиницыИзмеренияУставки',
				DbType: 'Int',
				Value: unitId,
				Direction: 'Input',
			},
			{
				Name: '@КодТипаДанных',
				DbType: 'Int',
				Value: dataTypeCode,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'Int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function saveParameter({
	id,
	userId,
	controlGroupNumber,
	dynamicObjectGroupNumber,
	unitId,
	name,
	lastModified,
	dataTypeCode = 0,
	moduleName = ModuleName.Test,
}: SaveParameterParams) {
	return {
		Sql: '[MonitoringModePower].[EmEvents].[Upd_ИзменитьУзелДерева]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодУзла',
				DbType: 'Int',
				Value: id,
				Direction: 'Input',
			},
			{
				Name: '@Название',
				DbType: 'String',
				Value: name,
				Direction: 'Input',
			},
			{
				Name: '@НомерГруппыДляКонтроля',
				DbType: 'Int',
				Value: controlGroupNumber,
				Direction: 'Input',
			},
			{
				Name: '@НомерГруппыДинамическогоОбъекта',
				DbType: 'Int',
				Value: dynamicObjectGroupNumber,
				Direction: 'Input',
			},
			{
				Name: '@КодЕдиницыИзмеренияУставки',
				DbType: 'Int',
				Value: unitId,
				Direction: 'Input',
			},
			{
				Name: '@КодТипаДанных',
				DbType: 'Int',
				Value: dataTypeCode,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'Int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function deleteParameter({
	id,
	userId,
	lastModified,
	moduleName = ModuleName.Test,
}: DeleteParameterCriterionsParams) {
	return {
		Sql: '[MonitoringModePower].[EmEvents].[Del_УдалитьУзелДерева]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодУзла',
				DbType: 'Int',
				Value: id,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@LastModified',
				DbType: 'Guid',
				Value: lastModified,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'Int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function fetchAssignedEmergencyEventsNumberQuery({ userId }: UserId) {
	return {
		Sql: 'MonitoringModePower.EmEvents.Get_НаличиеНазначенныхАварийныхСобытий',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
		],
	};
}
export function fetchAssignedEmergencyEventsQuery({
	userId,
	dateFrom,
	dateTo,
	acknowledgementStatus,
}: FetchAssignedEmergencyEventParams) {
	return {
		Sql: 'MonitoringModePower.EmEvents.Get_НазначенныеАварийныеСобытия',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@fromd',
				DbType: 'Datetime',
				Value: dateFrom,
				Direction: 'Input',
			},
			{
				Name: '@tod',
				DbType: 'Datetime',
				Value: dateTo,
				Direction: 'Input',
			},
			{
				Name: '@kvit_status',
				DbType: 'Int',
				Value: acknowledgementStatus,
				Direction: 'Input',
			},
		],
	};
}
export function acknowledgeAssignedEmergencyEventQuery({
	userId,
	nodeId,
	comment,
	moduleName = ModuleName.Test,
}: AcknowledgeAssignedEmergencyEventParams) {
	return {
		Sql: 'MonitoringModePower.EmEvents.Upd_СквитироватьСобытияУзла',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@ID_User',
				DbType: 'String',
				Value: userId,
				Direction: 'Input',
			},
			{
				Name: '@КодУзла',
				DbType: 'Int',
				Value: nodeId,
				Direction: 'Input',
			},
			{
				Name: '@Комментарий',
				DbType: 'String',
				Value: comment,
				Direction: 'Input',
			},
			{
				Name: '@Module_name',
				DbType: 'String',
				Value: moduleName,
				Direction: 'Input',
			},
			{
				Name: '@Err',
				DbType: 'Int',
				Value: null,
				Direction: 'Output',
				Size: '64',
			},
			{
				Name: '@TextErr',
				DbType: 'String',
				Value: null,
				Direction: 'Output',
				Size: '2000',
			},
		],
	};
}
export function getTransparentEmergencyEventsCount({
	id,
	dateTime,
}: FetchTransparentEmergencyEventsCount) {
	return {
		Sql: '[MonitoringModePower].[EmEvents].[Get_СостояниеУзла]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодУзла',
				DbType: 'Int',
				Value: id,
				Direction: 'Input',
			},
			{
				Name: '@ВключаяЭлектроснабжение',
				DbType: 'Boolean',
				Value: true,
				Direction: 'Input',
			},
			{
				Name: '@ВключаяКвитированные',
				DbType: 'Boolean',
				Value: true,
				Direction: 'Input',
			},
			{
				Name: '@ДатаВремя',
				DbType: 'DateTime',
				Value: dateTime,
				Direction: 'Input',
			},
		],
	};
}
export function getTransparentEmergencyEventsStatus(id: number) {
	return {
		Sql: '[MonitoringModePower].[EmEvents].[Get_СостояниеПараметровРаздела]',
		CommandType: 'StoredProcedure',
		Parameters: [
			{
				Name: '@КодРаздела',
				DbType: 'Int',
				Value: id,
				Direction: 'Input',
			},
		],
	};
}
