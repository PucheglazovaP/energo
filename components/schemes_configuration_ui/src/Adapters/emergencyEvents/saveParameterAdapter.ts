import {
	BackendResponse,
	EmergencyEventsTreeResponse,
} from '../../Shared/types';

export function saveNewParameterAdapter(response: string) {
	const { Response }: BackendResponse = JSON.parse(response);
	const item: EmergencyEventsTreeResponse = (
		Response.Tables[0].Rows as EmergencyEventsTreeResponse[]
	)[0];
	return {
		id: item.Код,
		order: item.НомерПоПорядку || 1,
		parentId: item.КодРодителя || undefined,
		displayName: item.Название || '',
		name: item.Название || '',
		isLast: false,
		lastModified: item.LastModified,
		canEdit: !!item.РазрешеноРедактирование,
		level: item.Уровень,
		controlGroupNumber: item.НомерГруппыДляКонтроля,
		dataBaseCode: item.БазаДанных,
		parameterCode: item.КодПараметра,
		dynamicObjectGroupNumber: item.НомерГруппыДинамическогоОбъекта,
		setpointsUnitCode: item.КодЕдиницыИзмеренияУставки,
		setpointsUnit: item.ЕдиницаИзмеренияУставки,
	};
}
