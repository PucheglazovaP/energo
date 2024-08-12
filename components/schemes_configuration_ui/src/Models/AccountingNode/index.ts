import { createStore, sample } from 'effector';

import { User } from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { SelectOption } from '../../UI/Select/types';
import { $user } from '../Auth';
import { $energyResourceId } from '../EnergyResources';
import { getParametersByValueListFx } from '../ParametersByValueReports/effects';

import {
	getAccountingNodeCalculateMethods,
	getAccountingNodeMethods,
	saveAccountingNodeFx,
} from './effects';
import {
	changeAccountingNodeCalculateMethodId,
	changeAccountingNodeCalculateMethods,
	changeAccountingNodeMethodId,
	changeAccountingNodeMethods,
	setAccountingNode,
	setAccountingNodeCalculateMethodActive,
	setAccountingNodeCalculateMethods,
	setAccountingNodeId,
	setAccountingNodeMethodActive,
	setAccountingNodeMethods,
} from './events';
import { AccountingNode, Method } from './types';

export const INITIAL_ACCOUNTING_NODE = {
	parameterId: 0,
	name: '',
	shortName: '',
	methodId: 1,
	calculateMethodId: 1,
	precision: 0,
	hourShift: 0,
	dailyPointGroupsId: null,
	pointId: null,
	linkedDailyPointsId: null,
	visualizationGroupName: '',
	sortOrder: 0,
	comment: '',
	pointName: '',
	methodName: '',
	calcName: '',
	energyResourceId: 0,
	activeFrom: new Date(),
	activeTo: new Date(),
	linkedColumns: 0,
	userId: '',
	changeDT: new Date(),
	lastModified: '',
};

export const $accountingNode = createStore<AccountingNode>(
	INITIAL_ACCOUNTING_NODE,
);

$accountingNode
	.on(setAccountingNode, (_state, data) => {
		return data;
	})
	.on(changeAccountingNodeMethodId, (state, methodId) => {
		return { ...state, methodId };
	})
	.on(changeAccountingNodeCalculateMethodId, (state, calculateMethodId) => {
		return { ...state, calculateMethodId };
	});

export const $accountingNodeId = createStore<number | null>(null);
$accountingNodeId.on(setAccountingNodeId, (_state, currentParameterId) => {
	return currentParameterId;
});

// Методы узла учета
export const $accountingNodeMethods = createStore<Method[]>([]);

$accountingNodeMethods
	.on(setAccountingNodeMethods, (state, methods) => {
		return state.length ? state : methods;
	})
	.on(changeAccountingNodeMethods, (_state, methods) => {
		return [...methods];
	})
	.on(setAccountingNodeMethodActive, (state, methodId) => {
		return state.map((method: SelectOption) => {
			return {
				...method,
				isSelected: method.value === methodId,
			};
		});
	});

// Способы вычисления узла учета
export const $accountingNodeCalculateMethods = createStore<Method[]>([]);

$accountingNodeCalculateMethods
	.on(setAccountingNodeCalculateMethods, (state, calculateMethods) => {
		return state.length ? state : calculateMethods;
	})
	.on(changeAccountingNodeCalculateMethods, (_state, calculateMethods) => [
		...calculateMethods,
	])
	.on(setAccountingNodeCalculateMethodActive, (state, methodId) => {
		return state.map((method: SelectOption) => {
			return {
				...method,
				isSelected: method.value === methodId,
			};
		});
	});

// samples

// Отслеживание отправки запроса на загрузку методов узла учета
sample({
	clock: getAccountingNodeMethods.doneData,
	target: setAccountingNodeMethods,
});

// Отслеживание отправки запроса на загрузку способов вычисления узла учета
sample({
	clock: getAccountingNodeCalculateMethods.doneData,
	target: setAccountingNodeCalculateMethods,
});

sample({
	clock: [saveAccountingNodeFx.doneData],
	source: [$energyResourceId, $user],
	fn: (data) => {
		const [energyResourceId, user] = data as [number, User | null];
		return {
			energyResourceId,
			userId: String(user?.preferredUsername),
			moduleName:
				ModuleName.SaveAccountingNodeFx_sample_getParametersByValueListFx,
		};
	},
	target: getParametersByValueListFx,
});

sample({
	clock: [changeAccountingNodeMethods],
	source: [$accountingNodeMethods],
	fn: (clk) => {
		const [methods] = clk;
		const methodId = methods.find((method) => method.isSelected)?.value;
		return Number(methodId);
	},
	target: changeAccountingNodeMethodId,
});
sample({
	clock: [changeAccountingNodeCalculateMethods],
	source: [$accountingNodeCalculateMethods],
	fn: (clk) => {
		const [calculateMethods] = clk;
		const calculateMethodId = calculateMethods.find(
			(calculateMethod) => calculateMethod.isSelected,
		)?.value;
		return Number(calculateMethodId);
	},
	target: changeAccountingNodeCalculateMethodId,
});
