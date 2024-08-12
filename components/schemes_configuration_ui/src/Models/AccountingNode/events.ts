import { createEvent } from 'effector';

import { SelectOption } from '../../UI/Select/types';

import { AccountingNode, Method } from './types';

export const setAccountingNode = createEvent<AccountingNode>();
export const changeAccountingNodeMethodId = createEvent<number>();
export const changeAccountingNodeCalculateMethodId = createEvent<number>();

export const setAccountingNodeMethods = createEvent<Method[]>();
export const changeAccountingNodeMethods = createEvent<Method[]>();
export const setAccountingNodeMethodActive = createEvent<number>();

export const setAccountingNodeCalculateMethods = createEvent<Method[]>();
export const changeAccountingNodeCalculateMethods =
	createEvent<SelectOption[]>();
export const setAccountingNodeCalculateMethodActive = createEvent<number>();

export const setAccountingNodeId = createEvent<number | null>(
	'set AccountingNodeId',
);
