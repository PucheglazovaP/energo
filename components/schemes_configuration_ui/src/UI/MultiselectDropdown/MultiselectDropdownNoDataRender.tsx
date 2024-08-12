import styles from './MultiselectDropdown.module.css';

function MultiselectDropdownNoDataRender() {
	return function Render() {
		return <div className={styles.no_data}>Нет данных</div>;
	};
}

export default MultiselectDropdownNoDataRender;
