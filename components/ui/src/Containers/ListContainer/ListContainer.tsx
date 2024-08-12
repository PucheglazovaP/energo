import React from 'react';

import { ListContainerProps } from './types';
import styles from './ListContainer.module.scss';

function ListContainer({ children }: ListContainerProps) {
	return <div className={styles.listContainer}>{children}</div>;
}

export default ListContainer;
