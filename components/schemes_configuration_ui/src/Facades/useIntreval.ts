import { useEffect, useRef } from 'react';

// Dan's useInterval hook https://overreacted.io/making-setinterval-declarative-with-react-hooks/
function useInterval(callback: any, delay: number) {
	const savedCallback = useRef<any>();

	// Remember the latest callback.
	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		function tick() {
			if (savedCallback) savedCallback.current();
		}
		if (delay !== null) {
			let id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}
export default useInterval;
