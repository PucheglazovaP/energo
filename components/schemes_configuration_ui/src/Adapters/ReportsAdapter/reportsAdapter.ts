import { Report } from '../../Models/Reports/types';
import { BackendResponse, ReportsResponse } from '../../Shared/types';

export function reportsAdapter(response: string): Report[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as ReportsResponse[];
	const reports = data.map((report) => ({
		id: report.ID,
		changeDateTime: report.ChangeDT,
		name: report.Name,
		comment: report.Comment,
		url: report.RepURL.replace('0000', String(report.ID)).concat(
			'&rs:Embed=true',
		),
	}));
	return reports;
}
