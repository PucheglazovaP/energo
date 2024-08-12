import React from 'react';

import { StatusIndicatorConfiguration } from '../../../Shared/Types/formObject';

export type EditStatusIndicatorProps = {
	objectValue: StatusIndicatorConfiguration;
	handleClick?: (
		event: React.MouseEvent<SVGForeignObjectElement, MouseEvent>,
	) => void;
	isSelected: boolean;
	onContextMenu?: (
		evt: React.MouseEvent,
		obj: StatusIndicatorConfiguration,
	) => void;
};
export type StatusIndicatorProps = {
	objectValue: StatusIndicatorConfiguration;
};
