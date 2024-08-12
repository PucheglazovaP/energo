import { combine } from 'effector';

import { $nodeItems } from '../../Models/NodeItems';
import { $nodes } from '../../Models/Nodes';

export const $pageNSIModel = combine($nodes, $nodeItems, (nodes, nodeItems) => {
	return {
		nodesList: nodes.list,
		nodeItemsList: nodeItems.list,
	};
});
