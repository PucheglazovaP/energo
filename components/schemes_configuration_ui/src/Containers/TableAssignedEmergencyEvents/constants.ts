import { AcknowledgementStatus } from '../../Shared/types';

export const acknowledgementStatusesLabels = new Map<
	AcknowledgementStatus,
	string
>([
	[AcknowledgementStatus.Acknowledged, 'Квитировано'],
	[AcknowledgementStatus.New, 'Новое'],
]);
