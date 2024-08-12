import { useCallback, useEffect } from 'react';
import { useStore } from 'effector-react';

import {
	$isOpenSidePanel,
	$selectedReportId,
} from '../../Models/ReferenseByReports';
import { toggleIsOpenSidePanel } from '../../Models/ReferenseByReports/events';
import { $reports } from '../../Models/Reports';
import { fetchReportsListFx } from '../../Models/Reports/effects';

function usePageReferenceByReports() {
	const selectedReportId = useStore($selectedReportId);
	const reports = useStore($reports);
	const isOpen = useStore($isOpenSidePanel);
	const currentReport = reports.find(
		(report) => report.id === selectedReportId,
	);

	const handleToggleIsOpenSidePanel = useCallback(() => {
		toggleIsOpenSidePanel();
	}, []);

	useEffect(() => {
		fetchReportsListFx();
	}, []);

	return {
		isOpen,
		currentReport,
		handleToggleIsOpenSidePanel,
	};
}

export default usePageReferenceByReports;
