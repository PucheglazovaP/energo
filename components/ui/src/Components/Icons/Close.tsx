import clsx from 'clsx';

import { CloseProps } from './types';

function Close(props: CloseProps) {
	const { className, height = '14', width = '14', color = '#7D7D7D' } = props;
	return (
		<svg
			width={width}
			height={height}
			viewBox="0 0 14 14"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={clsx('icon', className)}
		>
			<path
				d="M13 1L1 13"
				stroke={color}
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
			<path
				d="M1 1L13 13"
				stroke={color}
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	);
}

export default Close;
