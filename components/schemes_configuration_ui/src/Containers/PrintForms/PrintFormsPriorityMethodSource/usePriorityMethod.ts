import { PriorityMethodSource } from '../../../Shared/types';

import usePriorityMethodByArchive from './usePriorityMethodByArchive';
import usePriorityMethodByChannel from './usePriorityMethodByChannel';

function usePriorityMethod(from: PriorityMethodSource) {
	const priorityMethodByArchive = usePriorityMethodByArchive();
	const priorityMethodByChannel = usePriorityMethodByChannel();

	if (from === PriorityMethodSource.Archive) {
		return {
			...priorityMethodByArchive,
		};
	}

	return {
		...priorityMethodByChannel,
	};
}

export default usePriorityMethod;
