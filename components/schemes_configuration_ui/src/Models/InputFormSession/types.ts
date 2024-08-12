import { UserId } from '../../Shared/types';
import { Module } from '../../Shared/Types/moduleName';

export type EditInputFormSession = {
	sessionId: number;
	errorMessage: string;
};

export interface GetInputFormSessionAction extends UserId, Module {
	energyResourceId: number;
	date: string;
}
