import { UserId } from '../../../Shared/types';
import { Module } from '../../../Shared/Types/moduleName';

export interface NodesParams extends UserId, Module {
	deviceId: number;
	action: 'add' | 'set';
}
