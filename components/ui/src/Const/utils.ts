import { IMessage } from '@stomp/stompjs';

import { ParamsList } from '../Types/ParametersBlockTypes';

import { OUTPUT_PARAMETERS } from './queries';
import { OutputParameterKey } from './types';

export function getOutputParameters(...params: OutputParameterKey[]) {
	return params.map((key) => OUTPUT_PARAMETERS[key]);
}

export function getQueryOutputParameters(response: IMessage) {
	return JSON.parse(response.body).Response.OutParameters[0];
}

export function compareNumbers(a: number, b: number) {
	return a - b;
}

export function getParameterValue(
	parameterItems: ParamsList[],
	parameterName: string,
) {
	return parameterItems.find((item) => item.placeholder === parameterName)
		?.value;
}

export function copyToBuffer(text: string) {
	navigator.clipboard.writeText(text);
}
