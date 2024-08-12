import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { useStore } from 'effector-react';

import { $electricPower } from '../../Models/ElectricPower';
import { fetchReportLinkListFx } from '../../Models/Report/effects';
import { $datePeriod } from '../../Models/ReportsTechnical';
import { ReportLinkType } from '../../Shared/Types/report';
import { getReportUrl } from '../../Utils/reportUrl';

import { ReportType } from './types';

function usePageElectricPower() {
	const { endDate } = useStore($datePeriod);
	const { selectedReportType } = useStore($electricPower);

	const [url, setUrl] = useState('');

	useEffect(() => {
		switch (selectedReportType) {
			case ReportType.Day: {
				fetchReportLinkListFx(ReportLinkType.OperInformDay).then((url) => {
					const result = decodeURI(url).split('&')[0];
					const resultUrl = getReportUrl({
						path: result,
						fromDate: format(endDate, 'dd.MM.yyyy'),
					});
					setUrl(resultUrl);
				});
				break;
			}
			case ReportType.Month: {
				fetchReportLinkListFx(ReportLinkType.OperInformMonth).then((url) => {
					const result = decodeURI(url).split('&')[0];
					const resultUrl = getReportUrl({
						path: result,
						fromDate: format(endDate, 'dd.MM.yyyy'),
					});
					setUrl(resultUrl);
				});
				break;
			}
			case ReportType.Total: {
				fetchReportLinkListFx(ReportLinkType.OperInformTotal).then((url) => {
					const result = decodeURI(url).split('&')[0];
					const resultUrl = getReportUrl({
						path: result,
						fromDate: format(endDate, 'dd.MM.yyyy'),
					});
					setUrl(resultUrl);
				});
			}
		}
	}, [selectedReportType, endDate]);

	return { url };
}

export default usePageElectricPower;
