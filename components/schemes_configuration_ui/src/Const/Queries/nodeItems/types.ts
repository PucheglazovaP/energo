import { UserId } from '../../../Shared/types';
import { Module } from '../../../Shared/Types/moduleName';

export enum NodeItemsActions {
	Add = 'add',
	Set = 'set',
	None = 'none',
}
export interface NodeItemsParams extends UserId, Module {
	nodeId: number;
	action: NodeItemsActions;
}
