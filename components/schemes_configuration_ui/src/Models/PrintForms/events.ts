import { createEvent } from 'effector';

import {
	PrintFormParameter,
	PrintFormParameterNotSynced,
	PrintFormParameterValue,
	PrintFormPosition,
	PrintFormTree,
	PriorityMethod,
} from '../../Shared/types';

import { PrintForm } from './types';

export const setPrintForms = createEvent<PrintForm[]>('Set print forms');
export const setSelectedPrintFormId = createEvent<number>(
	'Set selected print form id',
);

export const setContextMenuPrintFormId = createEvent<number>(
	'Set context menu print form id',
);

export const setContextMenuPrintFormPositionId = createEvent<number>(
	'Set context menu print form position id',
);

export const setPrintFormPositions = createEvent<PrintFormPosition[]>(
	'Set print form position',
);

export const setPrintFormTree = createEvent<PrintFormTree[]>(
	'Set print form tree',
);

export const togglePrintFormNode = createEvent<number>(
	'Toggle print form node',
);

export const setSelectedPrintFormPositionId = createEvent<number>(
	'Set selected print form position id',
);

export const setPrintFormPositioningNodeId = createEvent<number>(
	'Set node id to position tree',
);

export const setPrintFormPositioningPositionId = createEvent<number>(
	'Set table row id to position on',
);

export const setPrintFormPriorityMethods = createEvent<PriorityMethod[]>(
	'Set priority methods',
);

export const setPrintFormPriorityInfo = createEvent<Partial<PrintFormPosition>>(
	'Set information about priority',
);

export const setSelectedPrintFormTreeNode = createEvent<PrintFormTree>(
	'Set print form tree node to operate with',
);

export const toggleLeftSidebarState = createEvent<void>(
	'Set left sidebar state to opposite value',
);
export const toggleRightSidebarState = createEvent<void>(
	'Set right sidebar state to opposite value',
);

export const setPrintFormParameters = createEvent<PrintFormParameter[]>(
	'Set parameters of selected print form',
);
export const setSelectedPrintFormParameterId = createEvent<number>(
	'Set id of selected parameter',
);

export const setPrintFormParametersAvailable = createEvent<
	PrintFormParameterNotSynced[]
>('Set list of parameters not synced to current print form');

export const setSelectedPrintFormParameterLinkId = createEvent<number>(
	'Set id of a link between print form and parameter',
);

export const setSelectedPrintFormParameterValues = createEvent<
	PrintFormParameterValue[]
>('Set list of all values of a selected print form parameter');

export const setSelectedPrintFormParameterName = createEvent<string>(
	'Set name of a selected print form parameter',
);
