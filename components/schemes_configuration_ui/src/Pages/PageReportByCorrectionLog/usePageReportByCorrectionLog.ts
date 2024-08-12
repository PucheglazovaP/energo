import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useStore } from 'effector-react';

import { EnergyResource } from '../../Models/EnergyResources/types';
import { fetchReportLinkListFx } from '../../Models/Report/effects';
import { $datePeriod } from '../../Models/ReportsTechnical';
import { ReportLinkType } from '../../Shared/Types/report';
import { getReportUrl } from '../../Utils/reportUrl';

function usePageReportByCorrectionLog(energyResources: EnergyResource[]) {
	const { startDate, endDate } = useStore($datePeriod);
	const [reportLInk, setUrl] = useState('');
	const url: string = useMemo(() => {
		const energyResourceId = energyResources.find(
			(resource) => resource.isSelected,
		)?.value;

		const resultUrl = getReportUrl({
			path: reportLInk,
			fromDate: format(startDate, 'dd.MM.yyyy'),
			toDate: format(endDate, 'dd.MM.yyyy'),
			id: energyResourceId,
		});

		return resultUrl;
	}, [energyResources, endDate, startDate, reportLInk]);

	useEffect(() => {
		fetchReportLinkListFx(ReportLinkType.UGECorrectionLog).then((url) => {
			const result = decodeURI(url).split('&')[0];
			setUrl(result);
		});
	}, []);

	return { url };
}

export default usePageReportByCorrectionLog;
