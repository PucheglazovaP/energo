export function setPosition(element: HTMLDivElement) {
	const componentRect = element.getBoundingClientRect();
	const viewportHeight =
		window.innerHeight || document.documentElement.clientHeight;
	const top = componentRect.top;
	const bottom = componentRect.bottom;
	const isPartiallyVisible = top < 0 || bottom > viewportHeight;
	if (isPartiallyVisible) {
		element.style.bottom = `100%`;
		element.style.top = 'auto';
	}
}
