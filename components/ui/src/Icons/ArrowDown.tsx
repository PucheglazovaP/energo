import clsx from 'clsx';

function ArrowDown({ className }: { className?: string }) {
	return (
		<svg
			width="10"
			height="6"
			viewBox="0 0 10 6"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx('icon', className)}
		>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M1.08785 0.837602C1.31565 0.609797 1.685 0.609797 1.9128 0.837602L5.00033 3.92512L8.08785 0.837602C8.31565 0.609797 8.685 0.609797 8.91281 0.837602C9.14061 1.06541 9.14061 1.43475 8.91281 1.66256L5.4128 5.16256C5.185 5.39037 4.81565 5.39037 4.58785 5.16256L1.08785 1.66256C0.860041 1.43475 0.860041 1.06541 1.08785 0.837602Z"
				fill="#595959"
			/>
		</svg>
	);
}

export default ArrowDown;
