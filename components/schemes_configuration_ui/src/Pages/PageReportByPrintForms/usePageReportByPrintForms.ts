import { useMemo } from 'react';
import { format } from 'date-fns';
import { useStore } from 'effector-react';

import { $printForms, $selectedPrintFormId } from '../../Models/PrintForms';
import { $datePeriod } from '../../Models/ReportsTechnical';
import { getReplacedReportUrlValues } from '../../Utils/reportUrl';

function usePageReportByPrintForms() {
	const { startDate, endDate } = useStore($datePeriod);
	const selectedPrintFormId = useStore($selectedPrintFormId);
	const printForms = useStore($printForms);
	const selectedPrintForm = printForms.find(
		(form) => form.id === selectedPrintFormId,
	)!;

	const reportUrl = useMemo(() => {
		if (!selectedPrintFormId) return '';
		return getReplacedReportUrlValues({
			url: selectedPrintForm.reportUrl,
			fromDate: format(startDate, 'dd.MM.yyyy'),
			toDate: format(endDate, 'dd.MM.yyyy'),
		});
	}, [startDate, endDate, selectedPrintForm, selectedPrintFormId]);

	return {
		reportUrl,
		selectedPrintFormId,
	};
}

export default usePageReportByPrintForms;
