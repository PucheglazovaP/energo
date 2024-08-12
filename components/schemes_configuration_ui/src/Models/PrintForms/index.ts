import { combine, createStore, sample } from 'effector';

import { RegisteredModals } from '../../Shared/modalsConfig';
import {
	PrintFormParameter,
	PrintFormParameterNotSynced,
	PrintFormParameterValue,
	PrintFormPosition,
	PrintFormTree,
	PriorityMethod,
	User,
} from '../../Shared/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import { $user } from '../Auth';
import { openModal } from '../Modal/events';

import { defaultPrintFormSidebarsState } from './constants';
import {
	addPrintFormParameterValueFx,
	createPrintFormPositionFx,
	deletePrintFormParameterValueFx,
	deletePrintFormPositionFx,
	fetchNotSyncedPrintFormParametersFx,
	fetchPrintFormParametersFx,
	fetchPrintFormParameterValuesFx,
	fetchPrintFormPositionsFx,
	fetchPrintFormsFx,
	fetchPrintFormTreeFx,
	fetchPriorityMethodsFx,
	movePrintFormPositionFx,
	savePrintFormPositionSettingsFx,
	syncPrintFormParameterFx,
	syncPrintFormPositionFx,
	unsyncPrintFormParameterFx,
	unsyncPrintFormPositionFx,
	updatePrintFormParameterValueFx,
} from './effects';
import {
	setContextMenuPrintFormId,
	setContextMenuPrintFormPositionId,
	setPrintFormParameters,
	setPrintFormParametersAvailable,
	setPrintFormPositioningNodeId,
	setPrintFormPositioningPositionId,
	setPrintFormPositions,
	setPrintFormPriorityInfo,
	setPrintFormPriorityMethods,
	setPrintForms,
	setPrintFormTree,
	setSelectedPrintFormId,
	setSelectedPrintFormParameterId,
	setSelectedPrintFormParameterLinkId,
	setSelectedPrintFormParameterName,
	setSelectedPrintFormParameterValues,
	setSelectedPrintFormPositionId,
	setSelectedPrintFormTreeNode,
	toggleLeftSidebarState,
	togglePrintFormNode,
	toggleRightSidebarState,
} from './events';
import { PrintForm, PrintFormSidebarsState } from './types';

export const $printForms = createStore<PrintForm[]>([], {
	name: 'Print forms',
});

export const $selectedPrintFormId = createStore<number>(0, {
	name: 'Id of selected print form',
});

export const $contextMenuPrintFormId = createStore<number>(0, {
	name: 'Id of the print form that is called with context menu',
});

export const $contextMenuPrintFormPositionId = createStore<number>(0, {
	name: 'Id of the print form position that is called with context menu',
});

export const $printFormPositions = createStore<PrintFormPosition[]>([], {
	name: 'Print form positions',
});

export const $printFormTree = createStore<PrintFormTree[]>([], {
	name: 'Print form tree',
});

export const $selectedPrintFormPositionId = createStore<number>(0, {
	name: 'Id of selected position in table',
});

export const $printFormPositioningNodeId = createStore<number>(0, {
	name: 'Id of node in the tree that is need to position on',
});

export const $printFormPositioningPositionId = createStore<number>(0, {
	name: 'Id of table row (position) that is need to position on',
});

export const $selectedPrintFormTreeNode = createStore<PrintFormTree | null>(
	null,
	{ name: 'Print form tree node to make action with (sync, unsync)' },
);

export const $printFormPriorityMethods = createStore<PriorityMethod[]>([], {
	name: 'Priority method of position',
});

export const $printFormPriorityInfo = createStore<Partial<PrintFormPosition>>(
	{},
	{
		name: 'Information about chosen device or channel for priority',
	},
);

export const $printFormSidebarsState = createStore<PrintFormSidebarsState>(
	defaultPrintFormSidebarsState,
	{ name: 'Information about open/closed state of page sidebars' },
);

export const $printFormParameters = createStore<PrintFormParameter[]>([], {
	name: 'Parameters of selected print form',
});
export const $selectedPrintFormParameterId = createStore<number>(0, {
	name: 'Id of a parameter selected via context menu',
});
export const $selectedPrintFormParameter = combine(
	$printFormParameters,
	$selectedPrintFormParameterId,
	(parameters, selected) =>
		parameters.find((parameter) => parameter.paramId === selected),
);
export const $printFormParametersAvailable = createStore<
	PrintFormParameterNotSynced[]
>([], {
	name: 'Parameters not synced to current print form',
});

export const $selectedPrintFormPosition = combine(
	$printFormPositions,
	$selectedPrintFormPositionId,
	(positions, selected) =>
		positions.find((position) => position.id === selected),
);

export const $selectedPrintFormParameterLinkId = createStore<number>(0, {
	name: 'Id of a link between print form and parameter',
});

export const $selectedPrintFormParameterName = createStore<string>('', {
	name: 'Name of a selected print form parameter',
});

export const $selectedPrintFormParameterValues = createStore<
	PrintFormParameterValue[]
>([], { name: 'List of all values of a selected print form parameter' });

$printFormParametersAvailable.on(
	setPrintFormParametersAvailable,
	(_state, payload) => payload,
);
$printForms.on(setPrintForms, (_state, payload) => payload);

$selectedPrintFormId.on(setSelectedPrintFormId, (_state, payload) => payload);

$contextMenuPrintFormId.on(setContextMenuPrintFormId, (_state, id) => id);

$contextMenuPrintFormPositionId.on(
	setContextMenuPrintFormPositionId,
	(_state, id) => id,
);

$printFormPositions.on(setPrintFormPositions, (_state, payload) => payload);

$printFormTree.on(setPrintFormTree, (_state, payload) => payload);
$printFormTree.on(togglePrintFormNode, (state, id) =>
	state.map((node) => {
		if (node.nodeId === id) {
			return {
				...node,
				isOpen: !node.isOpen,
			};
		}
		return node;
	}),
);

$selectedPrintFormPositionId.on(
	setSelectedPrintFormPositionId,
	(_state, payload) => payload,
);

$printFormPositioningNodeId.on(
	setPrintFormPositioningNodeId,
	(_state, payload) => payload,
);

$printFormPositioningPositionId.on(
	setPrintFormPositioningPositionId,
	(_state, payload) => payload,
);

$printFormPriorityMethods.on(
	setPrintFormPriorityMethods,
	(_state, methods) => methods,
);

$printFormPriorityInfo.on(
	setPrintFormPriorityInfo,
	(_state, payload) => payload,
);

$selectedPrintFormTreeNode.on(
	setSelectedPrintFormTreeNode,
	(_state, node) => node,
);

$printFormSidebarsState.on(toggleLeftSidebarState, (state) => {
	return { ...state, isLeftSidebarOpen: !state.isLeftSidebarOpen };
});
$printFormSidebarsState.on(toggleRightSidebarState, (state) => {
	return { ...state, isRightSidebarOpen: !state.isRightSidebarOpen };
});

$printFormParameters.on(
	setPrintFormParameters,
	(_state, parameters) => parameters,
);
$selectedPrintFormParameterId.on(
	setSelectedPrintFormParameterId,
	(_state, id) => id,
);

$selectedPrintFormParameterLinkId.on(
	setSelectedPrintFormParameterLinkId,
	(_state, linkId) => linkId,
);
$selectedPrintFormParameterValues.on(
	setSelectedPrintFormParameterValues,
	(_state, parameterValues) => parameterValues,
);
$selectedPrintFormParameterName.on(
	setSelectedPrintFormParameterName,
	(_state, parameterName) => parameterName,
);
sample({
	clock: fetchPrintFormParameterValuesFx.doneData,
	target: setSelectedPrintFormParameterValues,
});
sample({
	clock: [
		addPrintFormParameterValueFx.doneData,
		deletePrintFormParameterValueFx.doneData,
		updatePrintFormParameterValueFx.finally,
	],
	source: { user: $user, linkId: $selectedPrintFormParameterLinkId },
	filter: (src) => !!src.user && !!src.linkId,
	fn: (src) => {
		const { user, linkId } = src;
		if (user) {
			fetchPrintFormParameterValuesFx({
				linkId: Number(linkId),
				userId: user.preferredUsername,
				moduleName:
					ModuleName.Add_update_deletePrintFormParameterValueFx_sample_fetchPrintFormParameterValuesFx,
			});
		}
	},
});
sample({
	clock: [
		addPrintFormParameterValueFx.doneData,
		updatePrintFormParameterValueFx.doneData,
		deletePrintFormParameterValueFx.doneData,
	],
	source: { printReportId: $selectedPrintFormId, user: $user },
	fn: ({ printReportId, user }) => {
		const userName = user?.preferredUsername || '';
		fetchPrintFormParametersFx({
			printReportId,
			userId: userName,
			moduleName:
				ModuleName.Add_update_deletePrintFormParameterValue_sample_fetchPrintFormParametersFx,
		});
	},
});
sample({
	clock: fetchPrintFormsFx.doneData,
	target: setPrintForms,
});
sample({
	clock: setSelectedPrintFormId,
	filter: (_src, clk) => clk !== 0,
	source: $user,
	fn: (src, clk) => {
		const userName = src?.preferredUsername || '';

		fetchPrintFormParametersFx({
			printReportId: clk,
			userId: userName,
			moduleName:
				ModuleName.SetSelectedPrintFormId_sample_fetchPrintFormParametersFx,
		});
		fetchNotSyncedPrintFormParametersFx({
			printReportId: clk,
			userId: userName,
			moduleName:
				ModuleName.SetSelectedPrintFormId_sample_fetchNotSyncedPrintFormParametersFx,
		});
	},
});
sample({
	clock: fetchPrintFormParametersFx.doneData,
	target: setPrintFormParameters,
});
sample({
	clock: fetchNotSyncedPrintFormParametersFx.doneData,
	target: setPrintFormParametersAvailable,
});
sample({
	clock: syncPrintFormParameterFx.doneData,
	target: setSelectedPrintFormParameterLinkId,
});
sample({
	clock: syncPrintFormParameterFx.doneData,
	fn: () => {
		openModal(RegisteredModals.EditPrintFormParameter);
	},
});
sample({
	clock: [
		syncPrintFormParameterFx.doneData,
		unsyncPrintFormParameterFx.doneData,
	],
	source: { user: $user, selectedPrintFormId: $selectedPrintFormId },
	fn: (src) => {
		const { user, selectedPrintFormId } = src;
		const userName = user?.preferredUsername || '';

		fetchPrintFormParametersFx({
			printReportId: selectedPrintFormId,
			userId: userName,
			moduleName:
				ModuleName.Un_syncPrintFormParameterFx_sample_fetchPrintFormParametersFx,
		});
		fetchNotSyncedPrintFormParametersFx({
			printReportId: selectedPrintFormId,
			userId: userName,
			moduleName:
				ModuleName.Un_syncPrintFormParameterFx_sample_fetchNotSyncedPrintFormParametersFx,
		});
	},
});
sample({
	clock: setPrintForms,
	source: $printForms,
	fn: (clk) => {
		if (clk.length > 0) {
			return clk[0].id;
		}
		return 0;
	},
	target: setSelectedPrintFormId,
});

sample({
	clock: fetchPrintFormPositionsFx.doneData,
	target: setPrintFormPositions,
});

sample({
	clock: fetchPrintFormTreeFx.doneData,
	target: setPrintFormTree,
});

// Open tree to the node that need to be position on
sample({
	clock: setPrintFormPositioningNodeId,
	source: $printFormTree,
	fn: (src, clk) => {
		// Node from iterating will begin and node that should be opened with all it's parents
		let nodeToPosition: PrintFormTree | undefined = src.find(
			(node) => node.nodeId === clk,
		);
		// If node is not found, just return the same values
		if (!nodeToPosition) {
			return src;
		}
		// Array to iterate over
		const iterator = [...src];
		// parent node ids
		const nodeIds: number[] = [];
		// iterate over array using LIFO principle to find parent ids
		while (iterator.length) {
			const lastNode: PrintFormTree | undefined = iterator.pop();
			if (lastNode && lastNode.nodeId === nodeToPosition.parentNodeId) {
				nodeToPosition = lastNode;
				nodeIds.push(lastNode.nodeId);
			}
		}
		// Open node if id found in iterator
		const newTree = src.map((node) => {
			if (nodeIds.includes(node.nodeId)) {
				return {
					...node,
					isOpen: true,
				};
			}
			return node;
		});
		return newTree;
	},
	target: setPrintFormTree,
});

sample({
	clock: fetchPriorityMethodsFx.doneData,
	target: setPrintFormPriorityMethods,
});

/* Update table when:
	a. Move is done;
	b. New position created;
	c. Position was deleted;
	d. Position settings saved;
	e. Position unsync with tree node;
	f. Position sync with tree node;
*/
sample({
	clock: [
		movePrintFormPositionFx.doneData,
		createPrintFormPositionFx.doneData,
		deletePrintFormPositionFx.doneData,
		savePrintFormPositionSettingsFx.doneData,
		unsyncPrintFormPositionFx.doneData,
		syncPrintFormPositionFx.doneData,
	],
	source: [$selectedPrintFormId, $user],
	filter: (_src, clk) => clk !== 0,
	fn: (src) => {
		const [printFormId, user] = src as [number, User];
		return {
			printFormId,
			userId: user?.preferredUsername || '',
			moduleName:
				ModuleName.Move_create_delete_save_unsync_syncPrintFormPositionFx_sample_fetchPrintFormPositionsFx,
		};
	},
	target: fetchPrintFormPositionsFx,
});

// Update tree when sync/unsync node
sample({
	clock: [unsyncPrintFormPositionFx.doneData, syncPrintFormPositionFx.doneData],
	source: [$selectedPrintFormId, $user],
	filter: (_src, clk) => clk !== 0,
	fn: (src) => {
		const [selectedPrintFormId, user] = src as [number, User];
		return {
			printFormId: selectedPrintFormId,
			userId: user?.preferredUsername || '',
			moduleName:
				ModuleName.Un_syncPrintFormPositionFx_sample_fetchPrintFormTreeFx,
		};
	},
	target: fetchPrintFormTreeFx,
});
