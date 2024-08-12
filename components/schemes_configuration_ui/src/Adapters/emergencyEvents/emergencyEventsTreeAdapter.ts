import {
	BackendResponse,
	EmergencyEventsTreeItem,
	EmergencyEventsTreeResponse,
} from '../../Shared/types';

export default function emergencyEventsTreeAdapter(
	result: string,
): EmergencyEventsTreeItem[] {
	const message: BackendResponse = JSON.parse(result);
	const treeResponse = message.Response.Tables[0]
		.Rows as EmergencyEventsTreeResponse[];

	const tree: EmergencyEventsTreeItem[] = treeResponse.map((item) => {
		return {
			id: item.Код,
			order: item.НомерПоПорядку || 1,
			parentId: item.КодРодителя || undefined,
			displayName: item.Название || '',
			name: item.Название || '',
			isLast: !treeResponse.some((form) => form.КодРодителя === item.Код),
			lastModified: item.LastModified,
			canEdit: !!item.РазрешеноРедактирование,
			level: item.Уровень,
			controlGroupNumber: item.НомерГруппыДляКонтроля,
			dataBaseCode: item.БазаДанных,
			parameterCode: item.КодПараметра,
			dynamicObjectGroupNumber: item.НомерГруппыДинамическогоОбъекта,
			setpointsUnitCode: item.КодЕдиницыИзмеренияУставки,
			setpointsUnit: item.ЕдиницаИзмеренияУставки,
			dataTypeCode: item.КодТипаДанных,
			dataType: item.ТипДанных,
		};
	});
	return tree;
}
