import { OUTPUT_PARAMETERS } from './queries';
export type OutputParameterKey = keyof typeof OUTPUT_PARAMETERS;

export interface OutputParameter {
	Name: string;
	DbType: string;
	Value: null;
	Direction: string;
	Size: number;
}

export type OutputParameters = {
	[key: string]: OutputParameter;
};
