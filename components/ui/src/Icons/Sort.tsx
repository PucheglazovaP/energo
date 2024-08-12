import clsx from 'clsx';

function Sort({ className }: { className?: string }) {
	return (
		<svg
			width="14"
			height="15"
			viewBox="0 0 14 15"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx('icon', className)}
		>
			<path
				d="M3.67087 10.2458L6.58754 13.1625C6.81534 13.3903 7.18469 13.3903 7.4125 13.1625L10.3292 10.2458C10.496 10.079 10.5459 9.82808 10.4556 9.6101C10.3653 9.39213 10.1526 9.25 9.91668 9.25H4.08335C3.84741 9.25 3.63471 9.39212 3.54442 9.6101C3.45413 9.82808 3.50404 10.079 3.67087 10.2458Z"
				fill="#FAB82E"
			/>
			<path
				d="M7.4125 1.8376C7.18469 1.6098 6.81534 1.6098 6.58754 1.8376L3.67087 4.75427C3.50404 4.9211 3.45413 5.172 3.54442 5.38998C3.63471 5.60796 3.84741 5.75008 4.08335 5.75008H9.91668C10.1526 5.75008 10.3653 5.60796 10.4556 5.38998C10.5459 5.172 10.496 4.9211 10.3292 4.75427L7.4125 1.8376Z"
				fill="#D8D8D8"
			/>
		</svg>
	);
}

export default Sort;
