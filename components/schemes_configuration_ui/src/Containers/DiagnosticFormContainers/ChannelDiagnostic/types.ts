import { ReactNode } from 'react';

import { Cell } from '../../../UI/Table/types';

export type LinkCellProps = Cell & {
	onClick?: (params: AddTabParams) => void;
};

export type LayoutCellProps = {
	children: ReactNode;
	className?: string;
};

export type AddTabParams = {
	channelId: string;
	deviceId: string;
	serverId: string;
};
