import { memo, useMemo } from 'react';
import clsx from 'clsx';

import SelectTag from './SelectTag';
import { SelectFieldProps } from './types';
import styles from './Select.module.scss';

function SelectField(props: SelectFieldProps) {
	const { options, onRemove, isMultiple, placeholder } = props;

	const selectedOptions = useMemo(() => {
		return options.filter((option) => option.isSelected);
	}, [options]);
	const renderTags = () => {
		return (
			<div className={clsx(styles.select__field, styles.select__tags)}>
				{selectedOptions.map((tag) => (
					<SelectTag key={tag.value} option={tag} onRemove={onRemove} />
				))}
			</div>
		);
	};
	const renderText = () => {
		return (
			<div
				className={clsx(
					styles.select__field,
					!selectedOptions.length && styles.select__placeholder,
				)}
			>
				{selectedOptions.length ? selectedOptions[0].label : placeholder}
			</div>
		);
	};

	return isMultiple && selectedOptions.length ? renderTags() : renderText();
}

export default memo(SelectField);
