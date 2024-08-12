import {
	ParentRadioGroup,
	RadioGroup,
} from '../../Containers/FormCreation/types';
import { UserId } from '../../Shared/types';
import { Module } from '../../Shared/Types/moduleName';
import { SelectOption } from '../../UI/Select/types';

export enum FormPosition {
	ABOVE = 0,
	UNDER = 1,
	END = 2,
}

export enum FormOperation {
	NEW = 'new',
	COPY = 'copy',
	COPY_WITH_CHILDREN = 'copy_with_children',
}

export type NewForm = {
	types: FormType[];
	name: string;
	parents: ParentRadioGroup[];
	positions: RadioGroup[];
	typesIsLoading: boolean;
	operation: FormOperation;
	copiedId: number;
	withChildren: boolean;
};

export type FormTypeResponse = {
	КодТипаФормы: number;
	Комментарий: string;
	НазваниеТипаФормы: string;
	НомертипаФормы: number;
};

export interface FormType extends SelectOption {
	code: number;
	comment: string;
	name: string;
	number: number;
}

export interface FormActionParams extends UserId, Module {
	name: string;
	formTypeCode: number;
	parentCode: number | null;
	formCode: number;
	position: number;
	versionCode: number | null;
	objectId?: number;
	withChildren?: boolean;
}
