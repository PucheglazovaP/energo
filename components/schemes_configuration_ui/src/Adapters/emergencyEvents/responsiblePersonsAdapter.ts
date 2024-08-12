import { ResponsiblePersons } from '../../Models/NewEmergencyEventParameter/types';
import {
	AssignedResponsiblePersonsListResponse,
	BackendResponse,
	ResponsiblePersonsListResponse,
} from '../../Shared/types';

export function responsiblePersonsAdapter(body: string) {
	const mesage: BackendResponse = JSON.parse(body);
	const responsiblePersons = mesage.Response.Tables[0]
		.Rows as ResponsiblePersonsListResponse[];
	const result: ResponsiblePersons[] = responsiblePersons.map((item) => ({
		id: item.ACC_UID,
		name: item.ACC_NAME,
		email: item.ACC_EMAIL,
		skey: item.SKEY,
		// Select options
		value: item.SKEY,
		label: item.ACC_NAME,
		isSelected: false,
	}));
	return result;
}
export function assignedResponsiblePersonsAdapter(body: string) {
	const mesage: BackendResponse = JSON.parse(body);
	const responsiblePersons = mesage.Response.Tables[0]
		.Rows as AssignedResponsiblePersonsListResponse[];
	const result: ResponsiblePersons[] = responsiblePersons.map((item) => ({
		skey: item.SKEY,
		name: item.ACC_NAME,
		recordCode: item.Код,
		lastModified: item.LastModified,
		// Select options
		value: item.SKEY,
		label: item.ACC_NAME,
		isSelected: false,
	}));
	return result;
}
