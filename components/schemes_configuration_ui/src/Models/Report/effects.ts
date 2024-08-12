import { createEffect } from 'effector';

import { reportLinkAdapter } from '../../Adapters/ReportsAdapter/reportLinkAdapter';
import { getReportLink } from '../../Const/Queries/reports';
import { rpcQuery } from '../../Utils/requests';

export const fetchReportLinkListFx = createEffect(async (id: number) => {
	const link = await rpcQuery<string>(getReportLink(id), reportLinkAdapter);
	return link;
});
