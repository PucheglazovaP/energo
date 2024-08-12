import React from 'react';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';

import { ButtonsSubmitProps } from './types';

import styles from './FormulaEditor.module.css';

function ButtonsSubmit({
	className,
	style,
	onSubmit,
	onCancel,
}: ButtonsSubmitProps) {
	return (
		<div className={clsx(styles.submit_container, className)} style={style}>
			<Button onClick={onCancel}>Отмена</Button>
			<Button onClick={onSubmit}>Сохранить</Button>
		</div>
	);
}

export default ButtonsSubmit;
