import AvaibleSystemLayers from './AvaibleSystemLayers';
import CurrentFormTreeLayers from './CurrentFormTreeLayers';

import styles from './FormLayers.module.css';

function FormLayers() {
	return (
		<div className={styles.root}>
			<CurrentFormTreeLayers />
			<AvaibleSystemLayers />
		</div>
	);
}

export default FormLayers;
