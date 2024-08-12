import React, { useCallback } from 'react';
import { useStore } from 'effector-react';

import {
	$accountingNode,
	$accountingNodeCalculateMethods,
	$accountingNodeMethods,
} from '../../Models/AccountingNode';
import {
	changeAccountingNodeCalculateMethods,
	changeAccountingNodeMethods,
	setAccountingNode,
} from '../../Models/AccountingNode/events';
import { SelectOption } from '../../UI/Select/types';

import { AccountingNodeEditTextValue } from './types';

function useAccountingNodeParameters() {
	const accountingNode = useStore($accountingNode);
	const methods = useStore($accountingNodeMethods);
	const calculateMethods = useStore($accountingNodeCalculateMethods);

	// Изменение значений input
	const handleChangeTextValue = useCallback(
		(
			e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
			fieldName: AccountingNodeEditTextValue,
		) => {
			setAccountingNode({
				...accountingNode,
				[fieldName]: e.target.value,
			});
		},
		[accountingNode],
	);

	// Изменение выбранного метода
	const handleChangeAccountingNodeMethods = useCallback(
		(methods: SelectOption[]) => {
			changeAccountingNodeMethods(methods);
		},
		[],
	);

	// Изменение выбранного способа вычисления
	const handleChangeAccountingNodeCalculateMethods = useCallback(
		(calculateMethods: SelectOption[]) => {
			changeAccountingNodeCalculateMethods(calculateMethods);
		},
		[],
	);
	return {
		accountingNode,
		methods,
		calculateMethods,
		handleChangeTextValue,
		handleChangeAccountingNodeMethods,
		handleChangeAccountingNodeCalculateMethods,
	};
}

export default useAccountingNodeParameters;
