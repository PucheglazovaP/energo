import React, { memo } from 'react';

import ParamsItem from '../../Components/TreeBlockParams/ParamsItem';
import { ParamsList } from '../../Types/ParametersBlockTypes';

import styles from './ParamsContainer.module.scss';

interface ParamsContainerProps {
	header: string;
	sortParams: ParamsList[];
}

function ParamsContainer({ header, sortParams }: ParamsContainerProps) {
	return (
		<div className={styles.paramsContainer}>
			<div className={styles.paramsContainer__header}>{header}</div>
			<div className={styles.paramsContainer__body}>
				{sortParams.map((el, index) => (
					<ParamsItem
						placeholder={el.placeholder}
						value={el.value}
						options={el.options}
						canCopy={el.canCopy}
						dropdown={el.dropdown}
						key={`${el}_${index}`}
						header={header}
						id={`${el}_${index}`}
						isTree={el.isTree}
						listItems={el.listItems}
						withUnderLine={el.withUnderLine}
						readOnly={el.readOnly}
						title={el.title}
					/>
				))}
			</div>
		</div>
	);
}

export default memo(ParamsContainer);
