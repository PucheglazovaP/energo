import { ListInformationItem } from '../types';

import styles from '../PrintFormsPositionSettings.module.css';

type ListInformationProps = {
	items: ListInformationItem[];
};
function ListInformation(props: ListInformationProps) {
	const { items } = props;

	return (
		<div className={styles.information}>
			{items.map((item) => (
				<div className={styles.information__item} key={item.title}>
					<span className={styles.information__title}>{item.title}</span>
					<span className={styles.information__value}>{item.value}</span>
				</div>
			))}
		</div>
	);
}

export default ListInformation;
