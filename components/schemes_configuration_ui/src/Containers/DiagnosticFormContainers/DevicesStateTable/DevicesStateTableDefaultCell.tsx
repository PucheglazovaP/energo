import { RenderCell } from '../../../UI/Table/types';
import TextLine from '../../../UI/TextLine/TextLine';

import styles from './DevicesStateTable.module.css';

function DevicesStateTableDefaultCell({ data }: RenderCell) {
	const { text } = data;

	return <TextLine className={styles.default_cell_text} textContent={text} />;
}

export default DevicesStateTableDefaultCell;
