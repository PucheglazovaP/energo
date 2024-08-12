import { RefObject, useEffect, useRef, useState } from 'react';
/**
 * @param ref reference to the html element
 * @returns flag that indicates that element is intersecting with the root
 */

export default function useOnScreen<T extends HTMLElement = HTMLDivElement>(
	ref: RefObject<T>,
) {
	const [isIntersecting, setIntersecting] = useState(false);
	const [isUserScrolling, setIsUserScrolling] = useState(false);

	const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	const handleScroll = () => {
		setIsUserScrolling(true);
		if (scrollTimeout.current !== null) {
			clearTimeout(scrollTimeout.current);
		}
		scrollTimeout.current = setTimeout(() => {
			setIsUserScrolling(false);
		}, 500);
	};

	useEffect(() => {
		const observer = new IntersectionObserver(([entry]) => {
			if (!isUserScrolling) {
				setIntersecting(entry.isIntersecting);
			}
		});
		if (ref.current) {
			observer.observe(ref.current);
			const tree = document.getElementById('tree');
			if (tree) tree.addEventListener('scroll', handleScroll);
		}
		return () => {
			observer.disconnect();
			const tree = document.getElementById('tree');
			if (tree) tree.removeEventListener('scroll', handleScroll);
		};
	}, [ref, isUserScrolling]);

	return isIntersecting;
}
