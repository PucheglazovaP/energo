import clsx from 'clsx';

import styles from './Icons.module.css';

function Edit({ className }: { className?: string }) {
	return (
		<svg
			width="14"
			height="14"
			viewBox="0 0 14 14"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx('icon', className)}
		>
			<g clipPath="url(#clip0_6827_25022)">
				<path
					className={styles.icon_path}
					fillRule="evenodd"
					clipRule="evenodd"
					d="M13.4154 6.99992C13.4154 10.5437 10.5425 13.4166 6.9987 13.4166C3.45487 13.4166 0.582031 10.5437 0.582031 6.99992C0.582031 3.45609 3.45487 0.583252 6.9987 0.583252C10.5425 0.583252 13.4154 3.45609 13.4154 6.99992ZM6.9987 4.08325C6.67653 4.08325 6.41537 4.34442 6.41537 4.66659C6.41537 4.98875 6.67653 5.24992 6.9987 5.24992H7.00453C7.3267 5.24992 7.58787 4.98875 7.58787 4.66659C7.58787 4.34442 7.3267 4.08325 7.00453 4.08325H6.9987ZM7.58203 6.99992C7.58203 6.67775 7.32086 6.41659 6.9987 6.41659C6.67653 6.41659 6.41537 6.67775 6.41537 6.99992V9.33325C6.41537 9.65542 6.67653 9.91659 6.9987 9.91659C7.32086 9.91659 7.58203 9.65542 7.58203 9.33325V6.99992Z"
				/>
			</g>
			<defs>
				<clipPath id="clip0_6827_25022">
					<rect width="14" height="14" fill="white" />
				</clipPath>
			</defs>
		</svg>
	);
}

export default Edit;
