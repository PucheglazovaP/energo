import {
	BackendResponse,
	TransparentEmergencyEventsCountResponse,
} from '../../Shared/types';

export function transparentEmergencyEventsCountAdapter(response: string) {
	const { Response }: BackendResponse = JSON.parse(response);
	const item: TransparentEmergencyEventsCountResponse = (
		Response.Tables[0].Rows as TransparentEmergencyEventsCountResponse[]
	)[0];

	return {
		numberOfOwnEmergencyEvents: item.КоличествоСобственныхАварий,
		numberOfInternalEmergencyEvents: item.КоличествоВнутреннихАварий,
	};
}
