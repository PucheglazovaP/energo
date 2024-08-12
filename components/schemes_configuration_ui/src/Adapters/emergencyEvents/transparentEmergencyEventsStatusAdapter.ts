import {
	BackendResponse,
	TransparentEmergencyEventsStatusList,
	TransparentEmergencyEventsStatusResponse,
} from '../../Shared/types';

export default function transparentEmergencyEventsStatusAdapter(
	result: string,
): TransparentEmergencyEventsStatusList[] {
	const message: BackendResponse = JSON.parse(result);
	const events = message.Response.Tables[0]
		.Rows as TransparentEmergencyEventsStatusResponse[];
	const items: TransparentEmergencyEventsStatusList[] = events
		.filter((item) => item.КонецПоследнегоСобытия == null)
		.map((item) => {
			return {
				parameterCode: item.КодПараметра,
				parameterName: item.НазваниеПараметра,
				unit: item.ЕдиницаИзмерения,
				min: item.МинимальноеЗначение,
				max: item.МаксимальноеЗначение,
				setpoint: item.УставкаПоВремени,
				event: item.Событие,
				eventCodeType: item.КодТипаСобытия,
				eventCode: item.КодАварии,
				groupId: item.НомерГруппыДанных,
				lastEventStartDateTime: item.НачалоПоследнегоСобытия,
				lastEventEndDateTime: item.КонецПоследнегоСобытия,
				kvitDateTime: item.ДатаКвитирования,
				comment: item.Комментарий,
				responsiblePersons: item.Ответственные,
				gtype: item.gtype,
				multipleCount: item.multipleCount || 0,
				kvitPerson: item.ПользовательКвитирования || 'Не квитировано',
			};
		});
	return items;
}
