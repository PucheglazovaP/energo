import clsx from 'clsx';

import { Option, SelectorProps } from './types';

import styles from './Selector.module.css';

const Selector = ({
	options,
	selectedOption,
	setSelectedOption,
	className,
}: SelectorProps) => {
	return (
		<select
			value={selectedOption}
			onChange={(e) => setSelectedOption(e.target.value)}
			className={clsx(styles.root, className)}
		>
			{options.map((item: Option) => (
				<option key={item.value} value={item.value}>
					{item.displayValue}
				</option>
			))}
		</select>
	);
};

export default Selector;
