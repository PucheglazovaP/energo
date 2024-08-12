import { RefObject, useEffect, useState } from 'react';

export default function useOnScreen(ref: RefObject<HTMLDivElement>) {
	const [isIntersecting, setIntersecting] = useState(false);

	const observer = new IntersectionObserver(([entry]) => {
		setIntersecting(!entry.isIntersecting);
	});

	useEffect(() => {
		if (ref.current) observer.observe(ref.current);
		return () => {
			observer.disconnect();
		};
	}, []);

	return isIntersecting;
}
