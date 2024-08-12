import { useEffect, useMemo, useState } from 'react';

import { fetchReportLinkListFx } from '../../Models/Report/effects';
import { ReportLinkType } from '../../Shared/Types/report';
import { getReportUrl } from '../../Utils/reportUrl';

function usePageRetrofittingAccountingNodes() {
	const [reportLInk, setUrl] = useState('');
	const url: string = useMemo(() => {
		const resultUrl = getReportUrl({
			path: reportLInk,
		});

		return resultUrl;
	}, [reportLInk]);

	useEffect(() => {
		fetchReportLinkListFx(
			ReportLinkType.BalancesRetrofittingAccountingNodes,
		).then((url) => {
			const result = decodeURI(url).split('&')[0];
			setUrl(result);
		});
	}, []);

	return { url };
}

export default usePageRetrofittingAccountingNodes;
