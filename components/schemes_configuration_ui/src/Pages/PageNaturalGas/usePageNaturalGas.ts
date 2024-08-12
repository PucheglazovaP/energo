import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useStore } from 'effector-react';

import { fetchReportLinkListFx } from '../../Models/Report/effects';
import { $datePeriod } from '../../Models/ReportsTechnical';
import { ReportLinkType } from '../../Shared/Types/report';
import { getReportUrl } from '../../Utils/reportUrl';

function usePageNaturalGas(energyResourceId: number) {
	const { startDate, endDate } = useStore($datePeriod);

	const [reportLInk, setUrl] = useState('');

	const url: string = useMemo(() => {
		const resultUrl = getReportUrl({
			// TODO изменить назначение отчета
			path: reportLInk,
			fromDate: format(startDate, 'dd.MM.yyyy'),
			toDate: format(endDate, 'dd.MM.yyyy'),
			id: energyResourceId,
		});

		return resultUrl;
	}, [energyResourceId, endDate, startDate, reportLInk]);

	useEffect(() => {
		fetchReportLinkListFx(ReportLinkType.UGENaturalGas).then((url) => {
			const result = decodeURI(url).split('&')[0];
			setUrl(result);
		});
	}, []);

	return { url };
}

export default usePageNaturalGas;
