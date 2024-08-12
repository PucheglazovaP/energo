import React from 'react';

import { ITableBody, ITableColumn } from '../../UI/Table/types';

export interface LinkedParameterTableParamProps {
	data: ITableBody[];
	header: ITableColumn[];
	handleEditLinkedParameter: React.MouseEventHandler<HTMLButtonElement>;
	handleUnbindParameter: React.MouseEventHandler<HTMLButtonElement>;
}
