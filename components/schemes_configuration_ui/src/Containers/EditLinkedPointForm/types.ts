export enum EditLinkedPointFormFrom {
	Points = 'points',
	AccountingNode = 'accountingNode',
	ReportItem = 'reportItem',
}

export interface EditLinkedPointFormProps {
	from: EditLinkedPointFormFrom;
}
