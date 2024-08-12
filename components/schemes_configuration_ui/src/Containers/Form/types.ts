import { FormObject } from '../../Shared/Types/formObject';

export default interface FormProps {
	className?: string;
}
export interface TooltipProps {
	leftPosition: number;
	topPosition: number;
	formObject: FormObject | null;
}
