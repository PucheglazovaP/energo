import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useStore } from 'effector-react';

import { fetchReportLinkListFx } from '../../Models/Report/effects';
import { $datePeriod } from '../../Models/ReportsTechnical';
import { ReportLinkType } from '../../Shared/Types/report';
import { getReportUrl } from '../../Utils/reportUrl';

function usePageReportByInstrumentation(energyResourceId: number) {
	const { endDate } = useStore($datePeriod);
	const [reportLInk, setUrl] = useState('');
	const url: string = useMemo(() => {
		const resultUrl = getReportUrl({
			path: reportLInk,
			fromDate: format(endDate, 'dd.MM.yyyy'),
			id: energyResourceId,
		});

		return resultUrl;
	}, [energyResourceId, endDate, reportLInk]);

	useEffect(() => {
		fetchReportLinkListFx(ReportLinkType.UGEInstrumentation).then((url) => {
			const result = decodeURI(url).split('&')[0];
			setUrl(result);
		});
	}, []);

	return { url };
}

export default usePageReportByInstrumentation;
