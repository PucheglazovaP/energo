import React from 'react';

import { ITableBody, ITableColumn } from '../../UI/Table/types';

export interface VisualizationGroupParamProps {
	data: ITableBody[];
	header: ITableColumn[];
	handleEditVisualizationGroup: React.MouseEventHandler<HTMLButtonElement>;
	handleUnbindVisualizationGroup: React.MouseEventHandler<HTMLButtonElement>;
}
