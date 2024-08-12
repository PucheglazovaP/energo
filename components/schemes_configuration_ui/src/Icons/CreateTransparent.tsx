import clsx from 'clsx';

function CreateTransparent({ className }: { className?: string }) {
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
				d="M12.8799 7.38246H3.12652C2.13985 7.38246 1.33984 6.57579 1.33984 5.59579V3.84246C1.33984 2.85579 2.14652 2.05579 3.12652 2.05579H12.8799C13.8665 2.05579 14.6665 2.86246 14.6665 3.84246V5.59579C14.6665 6.57579 13.8599 7.38246 12.8799 7.38246Z"
				stroke="#B1B1B2"
				strokeWidth="1.3"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M6.5 10.0559H3.12652C2.14652 10.0559 1.33984 10.8559 1.33984 11.8426V13.5959C1.33984 14.5759 2.13985 15.3826 3.12652 15.3826H6.5"
				stroke="#B1B1B2"
				strokeWidth="1.3"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<line
				x1="12.0504"
				y1="10.3658"
				x2="12.0504"
				y2="15.0658"
				stroke="#B1B1B2"
				strokeWidth="1.3"
				strokeLinecap="round"
			/>
			<line
				x1="14.35"
				y1="12.7658"
				x2="9.65"
				y2="12.7658"
				stroke="#B1B1B2"
				strokeWidth="1.3"
				strokeLinecap="round"
			/>
		</svg>
	);
}

export default CreateTransparent;
