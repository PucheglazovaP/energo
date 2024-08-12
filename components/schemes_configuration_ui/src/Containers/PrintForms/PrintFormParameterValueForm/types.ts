import React, { ChangeEvent } from 'react';

import { PrintFormParameterValue } from '../../../Shared/types';

export interface PrintFormParameterValueFormProps
	extends PrintFormParameterValue {
	className?: string;
	style?: React.CSSProperties;
	dateFrom: Date;
	dateTo: Date;
}
export enum ParameterValueActionsTypes {
	Set = 'set',
	ChangeName = 'changeName',
	ChangeDateFrom = 'changeDateFrom',
	ChangeDateTo = 'changeDateTo',
	ChangeIsEndDateExists = 'changeIsEndDateExists',
	ChangeEmptyValueName = 'changeEmptyValueName',
}
export type ParameterValueActions =
	| {
			type: ParameterValueActionsTypes.Set;
			parameterValue: PrintFormParameterValue;
	  }
	| {
			type: ParameterValueActionsTypes.ChangeName;
			evt: ChangeEvent<HTMLTextAreaElement>;
	  }
	| {
			type: ParameterValueActionsTypes.ChangeDateFrom;
			period: Date[];
	  }
	| {
			type: ParameterValueActionsTypes.ChangeDateTo;
			period: Date[];
	  }
	| {
			type: ParameterValueActionsTypes.ChangeIsEndDateExists;
			isEndDateExists: boolean;
	  }
	| {
			type: ParameterValueActionsTypes.ChangeEmptyValueName;
	  };
