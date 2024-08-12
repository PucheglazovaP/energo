import { MouseEventHandler } from 'react';

export interface AnalyticRangesProps {
	onCreateRange: MouseEventHandler<HTMLButtonElement>;
	isButtonDisabled: boolean;
}
