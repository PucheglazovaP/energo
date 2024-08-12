import { useStore } from 'effector-react';

import { $printForms, $selectedPrintFormId } from '../../../Models/PrintForms';
import ReportPreview from '../../ReportPreview/ReportPreview';

function PrintFormReportPreview() {
	const printForms = useStore($printForms);
	const selectedPrintFormId = useStore($selectedPrintFormId);

	const selectedPrintForm = printForms.find(
		(form) => form.id === selectedPrintFormId,
	)!;

	return <ReportPreview url={selectedPrintForm.reportUrl} />;
}

export default PrintFormReportPreview;
