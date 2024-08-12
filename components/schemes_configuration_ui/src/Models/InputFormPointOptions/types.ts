import { UserId } from '../../Shared/types';
import { Module } from '../../Shared/Types/moduleName';

export type InputFormPointOptions = {
	id: number;
	name: string;
};

export interface InputFormOptionsParams extends UserId, Module {}
