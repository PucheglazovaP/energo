import { memo, useCallback } from 'react';

import { TreeTypes } from '../../Shared/types';
import TreeChannels from '../TreeChannels';
import TreeDevices from '../TreeDevices';
import TreeForms from '../TreeForms';

import { SidebarTreeProps } from './types';

function SidebarTree(props: SidebarTreeProps) {
	const { type } = props;

	const renderTree = useCallback(() => {
		if (!type) {
			return null;
		}
		switch (type) {
			case TreeTypes.Mnemoschemes:
				return <TreeForms />;
			case TreeTypes.Devices:
				return <TreeDevices />;
			case TreeTypes.Channels:
				return <TreeChannels />;
			default:
				return null;
		}
	}, [type]);

	return renderTree();
}

export default memo(SidebarTree);
