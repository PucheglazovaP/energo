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
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M11.083 1.85002C10.943 1.85002 10.8043 1.8776 10.6749 1.9312C10.5455 1.98481 10.4279 2.06337 10.3288 2.16241L2.56337 9.92787L1.99773 12.0019L4.07175 11.4362L11.8372 3.67079C11.9362 3.57174 12.0148 3.45417 12.0684 3.32476C12.122 3.19536 12.1496 3.05667 12.1496 2.9166C12.1496 2.77653 12.122 2.63784 12.0684 2.50844C12.0148 2.37903 11.9362 2.26145 11.8372 2.16241C11.7382 2.06337 11.6206 1.98481 11.4912 1.9312C11.3618 1.8776 11.2231 1.85002 11.083 1.85002ZM10.2284 0.853345C10.4993 0.741114 10.7897 0.68335 11.083 0.68335C11.3763 0.68335 11.6667 0.741114 11.9376 0.853345C12.2086 0.965577 12.4548 1.13008 12.6622 1.33745C12.8695 1.54483 13.034 1.79102 13.1463 2.06197C13.2585 2.33292 13.3163 2.62333 13.3163 2.9166C13.3163 3.20987 13.2585 3.50027 13.1463 3.77123C13.034 4.04218 12.8695 4.28837 12.6622 4.49574L4.78717 12.3707C4.71538 12.4425 4.62611 12.4943 4.52817 12.521L1.31984 13.396C1.11788 13.4511 0.901897 13.3938 0.753876 13.2457C0.605855 13.0977 0.548497 12.8817 0.603576 12.6798L1.47858 9.47145C1.50529 9.37351 1.55709 9.28424 1.62888 9.21245L9.50388 1.33745C9.71125 1.13008 9.95744 0.965577 10.2284 0.853345Z"
				className={styles.icon_path}
			/>
		</svg>
	);
}

export default Edit;
