import clsx from 'clsx';

function DeleteObject({ className }: { className?: string }) {
	return (
		<svg
			width="16"
			height="17"
			viewBox="0 0 16 17"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx('icon', className)}
		>
			<path
				d="M7.37231 7.93726L4.40234 4.96729"
				stroke="#B1B1B2"
				strokeWidth="1.5"
				strokeMiterlimit="10"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M7.34302 4.99731L4.37305 7.96729"
				stroke="#B1B1B2"
				strokeWidth="1.5"
				strokeMiterlimit="10"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M14.5 10.2158H12C10.125 10.2158 9.5 10.8408 9.5 12.7158V15.2158L14.5 10.2158Z"
				stroke="#B1B1B2"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M14.5 10.0158V6.76582C14.5 3.51582 13.2 2.21582 9.95 2.21582H6.05C2.8 2.21582 1.5 3.51582 1.5 6.76582V10.6658C1.5 13.9158 2.8 15.2158 6.05 15.2158H9.3"
				stroke="#B1B1B2"
				strokeWidth="1.5"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export default DeleteObject;
