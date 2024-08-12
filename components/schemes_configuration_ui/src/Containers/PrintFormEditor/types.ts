import { ChangeEvent } from 'react';

import { Action } from '../../Shared/types';

export type PrintFormEditorAction = Action.Create | Action.Update;

export type PrintFormEditorProps = {
	action: PrintFormEditorAction;
};

export type PrintFormEditorController = {
	formByPeriodName: string;
	name: string;
	comment: string;
	onSave(): void;
	onCancel(): void;
	onChangeName?(evt: ChangeEvent<HTMLInputElement>): void;
	onChangeComment?(evt: ChangeEvent<HTMLInputElement>): void;
};
