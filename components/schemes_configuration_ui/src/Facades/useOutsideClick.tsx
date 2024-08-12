import { useCallback, useEffect, useRef } from 'react';

const useOutsideClick = <T extends Element = HTMLDivElement>(
	condition: boolean,
	callback: (e?: Event) => void,
) => {
	const nodeRef = useRef<T>(null);

	const clickHandler = useCallback<(e: Event) => void>(
		(e) => {
			if (
				(e.target instanceof HTMLElement || e.target instanceof SVGElement) &&
				!nodeRef.current?.contains(e.target)
			) {
				callback(e);
				window.removeEventListener('click', clickHandler);
			}
		},
		[callback],
	);

	const escHandler = useCallback<(e: KeyboardEvent) => void>(
		(e) => {
			if (e.key === 'Escape') {
				callback(e);
				window.removeEventListener('keydown', escHandler);
			}
		},
		[callback],
	);

	useEffect(() => {
		if (condition) {
			window.addEventListener('click', clickHandler);
			window.addEventListener('keydown', escHandler);
		}

		return () => {
			window.removeEventListener('click', clickHandler);
			window.removeEventListener('keydown', escHandler);
		};
	}, [condition, escHandler, clickHandler]);

	return nodeRef;
};

export default useOutsideClick;
