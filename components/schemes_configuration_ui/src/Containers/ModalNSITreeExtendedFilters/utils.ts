import { parameterTypesLabels } from './constants';

export function getParameterLabel(parameterType: string): string {
	return parameterTypesLabels.get(parameterType) || '';
}
