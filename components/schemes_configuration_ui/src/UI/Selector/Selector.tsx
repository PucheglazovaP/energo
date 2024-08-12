import clsx from 'clsx';

import { Option, SelectorProps } from './types';

import styles from './Selector.module.css';

const Selector = ({
	options,
	selectedOption,
	setSelectedOption,
	setSelected = () => {},
	className,
	multipleChoice,
}: SelectorProps) => {
	return (
		<select
			value={multipleChoice ? 'undefined' : selectedOption}
			onChange={(e) => {
				setSelectedOption(e.target.value);
				setSelected(false);
			}}
			className={clsx(styles.root, className)}
		>
			{multipleChoice ? (
				<option value={'undefined'} hidden disabled>
					Не определено
				</option>
			) : (
				''
			)}
			{options.map((item: Option) => (
				<option key={item.value} value={item.value}>
					{item.displayValue}
				</option>
			))}
		</select>
	);
};

export default Selector;
