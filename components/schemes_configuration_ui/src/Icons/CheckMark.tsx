import clsx from 'clsx';

function CheckMark({ className }: { className?: string }) {
	return (
		<svg
			width="12"
			height="9"
			viewBox="0 0 12 9"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx('icon', className)}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M11.0791 1.0876C11.307 1.31541 11.307 1.68475 11.0791 1.91256L4.66248 8.32923C4.43467 8.55703 4.06533 8.55703 3.83752 8.32923L0.920854 5.41256C0.693049 5.18475 0.693049 4.81541 0.920854 4.5876C1.14866 4.3598 1.51801 4.3598 1.74581 4.5876L4.25 7.09179L10.2542 1.0876C10.482 0.859797 10.8513 0.859797 11.0791 1.0876Z"
				fill="black"
			/>
		</svg>
	);
}
export default CheckMark;
