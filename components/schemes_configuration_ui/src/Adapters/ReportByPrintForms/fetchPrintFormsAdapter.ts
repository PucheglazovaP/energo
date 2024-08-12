import { addDays, format } from 'date-fns';

import { PrintForm } from '../../Models/PrintForms/types';
import { BackendResponse, PrintFormResponse } from '../../Shared/types';
import { getNumber, getString } from '../../Utils/guards';

export function fetchPrintFormsAdapter(message: string): PrintForm[] {
	const { Response }: BackendResponse = JSON.parse(message);
	const backendForms = Response.Tables[0].Rows as PrintFormResponse[];
	const twoDaysAgo = format(addDays(new Date(), -2), 'dd.MM.yyyy');
	const yesterday = format(addDays(new Date(), -1), 'dd.MM.yyyy');

	const result: PrintForm[] = backendForms.map((form) => {
		const newUrl: string = form.repURL
			.replace('01.01.2000', twoDaysAgo)
			.replace('02.01.2000', yesterday)
			.replace('0000', String(form.ID))
			.concat('&rs:Embed=true');
		return {
			id: getNumber(form.ID, 'ID'),
			reportId: getNumber(form.FK_Reports, 'FK_Reports'),
			userId: getString(form.ID_User, 'ID_user'),
			name: getString(form.Name, 'Name'),
			comment: form.Comment ? form.Comment : '',
			lastModified: form.ChangeDT,
			reportUrl: newUrl,
		};
	});
	return result;
}
