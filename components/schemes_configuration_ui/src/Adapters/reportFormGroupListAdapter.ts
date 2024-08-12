import { ReportFormGroupListResponse } from '../Shared/types';

export function reportFormGroupListAdapter(body: string) {
	const groupListInReportForm: ReportFormGroupListResponse[] =
		JSON.parse(body).Response.Tables[0].Rows;
	return groupListInReportForm.map((item) => ({
		name: item.НазваниеГруппы,
		groupNumber: item.НомерГруппы,
		order: item.ПорядковыйНомер,
	}));
}
