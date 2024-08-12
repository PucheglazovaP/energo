import { FormObjectParameters } from '../Models/EditMode/types';

/**
 * Get form object parameter value from the form parameters array
 * by given name
 */
export function getParameterValue(params: FormObjectParameters[]) {
	const parameters: FormObjectParameters[] = params;
	return (name: string) =>
		parameters.find((param) => param.parameterName === name)?.value;
}
