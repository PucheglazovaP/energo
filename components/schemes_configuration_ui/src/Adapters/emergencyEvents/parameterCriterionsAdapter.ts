import {
	BackendResponse,
	ParameterCriterions,
	ParameterCriterionsResponse,
} from '../../Shared/types';
import { getNumber } from '../../Utils/guards';

export default function parameterCriterionsAdapter(
	result: string,
): ParameterCriterions[] {
	const message: BackendResponse = JSON.parse(result);
	const response = message.Response.Tables[0]
		.Rows as ParameterCriterionsResponse[];

	const criterions: ParameterCriterions[] = response.map((item) => {
		return {
			id: item.Код,
			startDateTime: item.ДатаОт,
			endDateTime: item.ДатаДо,
			min: item.МинимальноеЗначение
				? getNumber(item.МинимальноеЗначение, 'min')
				: null,
			max: item.МаксимальноеЗначение
				? getNumber(item.МаксимальноеЗначение, 'max')
				: null,
			evaluationInterval: item.ИнтервалОценки
				? getNumber(item.ИнтервалОценки, 'evaluationInterval')
				: null,
			broadcastToMonitoring: item.ТранслироватьВМониторинги,
			lastModified: item.LastModified,
			controlGroupNumber: item.НомерГруппыДляКонтроля,
			dynamicObjectGroupNumber: item.НомерГруппыДинамическогоОбъекта,
			unitName: item.ЕдиницаИзмерения,
		};
	});
	return criterions;
}
