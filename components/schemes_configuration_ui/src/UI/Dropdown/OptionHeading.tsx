import clsx from 'clsx';

import { OptionHeadingProps } from './types';

import styles from './Dropdown.module.css';

function OptionHeading(props: OptionHeadingProps) {
	const { option } = props;
	return (
		<li
			className={clsx(
				styles.menu__heading,
				option.withSeparator && styles.menu__heading__separator,
			)}
		>
			{option.title}
		</li>
	);
}

export default OptionHeading;
