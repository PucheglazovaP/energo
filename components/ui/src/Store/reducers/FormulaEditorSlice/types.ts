import { Module } from '../../../Shared/types';
import { User } from '../../../Types/UserTypes';

export interface FormulaCopyQuery extends User {
	number: number;
	numberSource: number | null;
	lastModified: string;
}
export interface GetFormula {
	number: number;
}
export interface UpdateFormula extends User {
	number: number;
	formulaList: FormulaElement[];
	lastModified: string;
}

export interface UpdateActiveFormula extends User, Module {
	number: number;
	lastModified: string;
	activeFormula: boolean;
}

export interface FormulaElement {
	FK_Group?: number;
	ID_Channel?: number | null;
	ID_Group?: number | null;
	Oper?: string | null;
	Ord: number;
}
