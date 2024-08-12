import Switcher from '../../UI/Switcher';

import { ParentSectionProps as RadioGroupSectionProps } from './types';

import styles from './FormCreation.module.css';

function RadioGroupSection(props: RadioGroupSectionProps) {
	const { title, options, onChange } = props;
	return (
		<div className={styles.section}>
			<span className={styles.section__title}>{title}</span>
			<div className={styles.section__radio}>
				{options.map((option) => (
					<Switcher
						key={option.value}
						checked={option.checked}
						disabled={option.disabled}
						className={option.disabled ? styles.switcher__disabled : undefined}
						type={'radio'}
						value={option.value}
						name={option.name}
						caption={option.name}
						onChange={onChange}
					/>
				))}
			</div>
		</div>
	);
}

export default RadioGroupSection;
