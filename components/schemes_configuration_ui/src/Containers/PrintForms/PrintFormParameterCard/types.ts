import React, { MouseEvent } from 'react';

import { PrintFormParameter } from '../../../Shared/types';

export interface PrintFormParameterCardProps extends PrintFormParameter {
	onContextMenu: (evt: MouseEvent<HTMLDivElement>) => void;
	isParameterSelected: boolean;
	className?: string;
	style?: React.CSSProperties;
}
