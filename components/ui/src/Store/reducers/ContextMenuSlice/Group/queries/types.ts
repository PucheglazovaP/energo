import { Module } from '../../../../../Shared/types';
import { User } from '../../../../../Types/UserTypes';

export interface CreateGroupsQuery extends User, Module {
	name: string;
	number: number;
	unit: number;
	method: number;
	typeStorage: number;
	server: number;
	count?: number;
	numberEwork?: number | null;
}

export interface CreateGroupCopyQuery extends User, Module {
	name: string;
	numberNew: number;
	numberSource: number;
}

export interface UpdateGroup extends User, Module {
	groupNumber: number;
	groupName: string;
	fkUnits: number;
	fkTypeStorage: number;
	fkMethods: number;
	lastModified: string;
	eWork: number | null;
	isFormula: boolean;
	isFormulaActive: boolean;
}
