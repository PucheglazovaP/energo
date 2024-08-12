import {
	AcknowledgementStatus,
	AssignedEmergencyEvent,
	AssignedEmergencyEventResponse,
	BackendResponse,
} from '../../Shared/types';
import { DateFormat, formatDate } from '../../Utils/dateUtils';

function fetchAssignedEmergencyEventsAdapter(
	message: string,
): AssignedEmergencyEvent[] {
	const parsedMessage: BackendResponse = JSON.parse(message);
	const response = parsedMessage.Response.Tables[0]
		.Rows as AssignedEmergencyEventResponse[];

	return response.map((emergencyEvent: AssignedEmergencyEventResponse) => {
		const {
			ДатаКвитирования: acknowledgementDateValue,
			Квитировано: isAcknowledged,
			КодПараметра: id,
			Комментарий: comment,
			МаксимальноеЗначение: valueMax,
			МинимальноеЗначение: valueMin,
			УставкаПоВремени: setPoint,
			НазваниеПараметра: paramName,
			НачалоПоследнегоСобытия: lastEventStartDateValue,
			Событие: eventName,
			Ответственные: responsibles,
			ФИОПользователяКвитирования: acknowledgementAuthor,
			НомерГруппыДанных: groupNumber,
			ЕдиницаИзмерения: unit,
		} = emergencyEvent;

		const lastEventStartDateString = lastEventStartDateValue
			? formatDate(
					new Date(lastEventStartDateValue),
					DateFormat.DefaultDisplayFormat,
			  )
			: '-';

		const acknowledgementDate = acknowledgementDateValue
			? formatDate(
					new Date(acknowledgementDateValue),
					DateFormat.DefaultDisplayFormat,
			  )
			: '-';
		const status = isAcknowledged
			? AcknowledgementStatus.Acknowledged
			: AcknowledgementStatus.New;

		return {
			id,
			paramName,
			valueMin: valueMin,
			valueMax: valueMax,
			setPoint: setPoint === null ? '-' : String(setPoint),
			lastEventStartDateString,
			lastEventStartDate: lastEventStartDateValue
				? new Date(lastEventStartDateValue)
				: new Date(),
			status,
			eventName,
			responsibles,
			acknowledgementDate,
			comment,
			groupNumber,
			acknowledgementAuthor: acknowledgementAuthor || '-',
			unit,
		};
	});
}

export default fetchAssignedEmergencyEventsAdapter;
