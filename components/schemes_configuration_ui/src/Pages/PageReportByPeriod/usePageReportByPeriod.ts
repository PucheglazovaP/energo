import { useMemo } from 'react';
import { format } from 'date-fns';
import { useStore } from 'effector-react';

import { $selectedReportId } from '../../Models/ReferenseByReports';
import { $reports } from '../../Models/Reports';
import { $datePeriod } from '../../Models/ReportsTechnical';
import { getReplacedReportUrlValues } from '../../Utils/reportUrl';

function usePageReportByPeriod() {
	const reports = useStore($reports);
	const selectedReportId = useStore($selectedReportId);
	const { startDate, endDate } = useStore($datePeriod);

	const selectedReport = reports.find(
		(report) => report.id === selectedReportId,
	);
	const reportUrl = useMemo(() => {
		if (!selectedReport) return '';
		return getReplacedReportUrlValues({
			url: selectedReport.url,
			fromDate: format(startDate, 'dd.MM.yyyy'),
			toDate: format(endDate, 'dd.MM.yyyy'),
		});
	}, [selectedReport, startDate, endDate]);

	return {
		reportUrl,
		selectedReport,
	};
}

export default usePageReportByPeriod;
