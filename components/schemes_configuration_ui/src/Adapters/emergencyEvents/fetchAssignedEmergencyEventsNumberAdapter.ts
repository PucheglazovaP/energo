import {
	AssignedEmergencyEventsNumberResponse,
	BackendResponse,
} from '../../Shared/types';

function fetchAssignedEmergencyEventsNumberAdapter(message: string): number {
	const parsedMessage: BackendResponse = JSON.parse(message);
	const response = parsedMessage.Response.Tables[0]
		.Rows as AssignedEmergencyEventsNumberResponse[];

	return response[0]['КоличествоСобытий'] || 0;
}

export default fetchAssignedEmergencyEventsNumberAdapter;
