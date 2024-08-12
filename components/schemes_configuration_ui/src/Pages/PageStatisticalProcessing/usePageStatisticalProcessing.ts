import { useEffect, useMemo, useState } from 'react';
import { format } from 'date-fns';
import { useStore } from 'effector-react';

import { DEFAULT_CHANNEL_NUMBER } from '../../Models/ChannelsList';
import { fetchReportLinkListFx } from '../../Models/Report/effects';
import { $datePeriod } from '../../Models/ReportsTechnical';
import { ReportLinkType } from '../../Shared/Types/report';
import { getReportUrl } from '../../Utils/reportUrl';

function usePageStatisticalProcessing(
	channelNumber: number = DEFAULT_CHANNEL_NUMBER,
) {
	const { startDate, endDate } = useStore($datePeriod);
	const [reportLInk, setUrl] = useState('');
	const url: string = useMemo(() => {
		const resultUrl = getReportUrl({
			path: reportLInk,
			fromDate: format(startDate, 'dd.MM.yyyy'),
			toDate: format(endDate, 'dd.MM.yyyy'),
			id: channelNumber,
		});

		return resultUrl;
	}, [channelNumber, endDate, startDate, reportLInk]);

	useEffect(() => {
		fetchReportLinkListFx(ReportLinkType.BalancesStatisticalProcessing).then(
			(url) => {
				const result = decodeURI(url).split('&')[0];
				setUrl(result);
			},
		);
	}, []);

	return url;
}

export default usePageStatisticalProcessing;
