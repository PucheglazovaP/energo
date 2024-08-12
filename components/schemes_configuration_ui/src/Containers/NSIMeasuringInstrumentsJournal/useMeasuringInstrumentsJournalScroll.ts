import { createRef as useRef, useEffect } from 'react';
import { useStore } from 'effector-react';

import { $nsiMeasuringInstruments } from '../../Models/NSIMeasuringInstruments';
import { setPagination } from '../../Models/NSIMeasuringInstruments/events';

export default function useMeasuringInstrumentsJournalScroll() {
	const { pagination } = useStore($nsiMeasuringInstruments);

	const scrollRef = useRef<HTMLDivElement>();

	useEffect(() => {
		if (pagination.scrollbarPosition) {
			scrollRef.current?.scrollTo({
				top: pagination.scrollbarPosition,
			});
			setTimeout(() => {
				setPagination({ ...pagination, scrollbarPosition: null });
			}, 1000);
		}
	}, [pagination.scrollbarPosition]);

	return scrollRef;
}
