import { EditLinkedPointFormFrom } from './types';
import { useConfirmationsFromReportItem } from './useConfirmationFromReportItem';
import { useConfirmationsFromAccountingNode } from './useConfirmationsFromAccountingNode';
import { useConfirmationsFromPoints } from './useConfirmationsFromPoints';

export function useEditLinkedPointConfirmations(
	from: EditLinkedPointFormFrom,
	selectedPoint: number | null,
) {
	const { submitFromPoints, closeModalFromPoints } =
		useConfirmationsFromPoints(selectedPoint);
	const { submitFromAccountingNode, closeModalFromAccountingNode } =
		useConfirmationsFromAccountingNode(selectedPoint);

	const { submitFromReportItems, closeModalFromReportItems } =
		useConfirmationsFromReportItem(selectedPoint);

	if (from === EditLinkedPointFormFrom.Points)
		return {
			handleSubmit: submitFromPoints,
			handleCloseModal: closeModalFromPoints,
		};

	if (from === EditLinkedPointFormFrom.ReportItem)
		return {
			handleSubmit: submitFromReportItems,
			handleCloseModal: closeModalFromReportItems,
		};

	return {
		handleSubmit: submitFromAccountingNode,
		handleCloseModal: closeModalFromAccountingNode,
	};
}
