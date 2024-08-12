import { RefObject, useCallback, useEffect, useState } from 'react';

export default function useFocus(htmlElementRef: RefObject<HTMLElement>) {
	const [isFocus, setFocus] = useState(false);

	const toggleFocus = useCallback(
		(e: Event) => {
			setFocus(
				(htmlElementRef &&
					htmlElementRef.current?.contains(e.target as Node)) ||
					false,
			);
		},
		[htmlElementRef],
	);

	const blur = useCallback(() => setFocus(false), []);

	useEffect(() => {
		window.addEventListener('mouseup', toggleFocus);
		window.addEventListener('blur', blur);
		return () => {
			setFocus(false);
			window.removeEventListener('mouseup', toggleFocus);
			window.removeEventListener('blur', blur);
		};
	}, [blur, toggleFocus]);

	return isFocus;
}
