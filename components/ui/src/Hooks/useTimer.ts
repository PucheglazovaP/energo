import { useCallback, useEffect, useRef, useState } from 'react';
import {
	compareAsc,
	differenceInMilliseconds,
	Duration,
	intervalToDuration,
} from 'date-fns';

function toSeconds(ms: number): number {
	return Math.ceil(ms / 1000);
}

function useTimer(startTime: Date, isReverse: boolean = false) {
	const [duration, setDuration] = useState<Duration>({});

	const previousTimeRef = useRef<number>();
	const requestTimeRef = useRef<number>();

	const [start, end] =
		isReverse && compareAsc(startTime, new Date()) === -1
			? [new Date(), new Date()]
			: [startTime, new Date()];

	const timer = useCallback(() => {
		const timeDifference: number = Math.abs(
			differenceInMilliseconds(Date.now(), startTime),
		);

		if (previousTimeRef.current !== toSeconds(timeDifference)) {
			setDuration(intervalToDuration({ start, end }));
			previousTimeRef.current = toSeconds(timeDifference);
		}

		requestTimeRef.current = requestAnimationFrame(timer);
	}, [end, start, startTime]);

	useEffect(() => {
		if (requestTimeRef.current != null) {
			cancelAnimationFrame(requestTimeRef.current);
		}
		requestTimeRef.current = requestAnimationFrame(timer);
		return () => {
			requestTimeRef.current && cancelAnimationFrame(requestTimeRef.current);
		};
	}, [startTime, timer]);

	return duration;
}

export default useTimer;
