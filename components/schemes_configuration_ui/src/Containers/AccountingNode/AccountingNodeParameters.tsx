import React, { memo } from 'react';
import clsx from 'clsx';

import Input from '../../UI/Input';
import Select from '../../UI/Select';

import { AccountingNodeEditTextValue } from './types';
import useAccountingNodeParameters from './useAccountingNodeParameters';

import styles from './AccountingNode.module.css';

function AccountingNodeParameters() {
	const {
		accountingNode,
		methods,
		calculateMethods,
		handleChangeAccountingNodeMethods,
		handleChangeAccountingNodeCalculateMethods,
		handleChangeTextValue,
	} = useAccountingNodeParameters();
	const { name, shortName, precision, hourShift } = accountingNode;

	return (
		<div className={styles.parameters_container}>
			<div className={styles.accounting_node_parameters}>
				<Input
					isRequired
					label="Полное наименование"
					placeholder={'Полное наименование'}
					name={AccountingNodeEditTextValue.Name}
					value={name}
					onChange={(e) =>
						handleChangeTextValue(e, AccountingNodeEditTextValue.Name)
					}
					className={clsx(styles.input, styles.accounting_node_parameter)}
				/>
				<Input
					isRequired
					label="Короткое наименование"
					placeholder="Короткое наименование"
					name={AccountingNodeEditTextValue.ShortName}
					value={shortName}
					onChange={(e) =>
						handleChangeTextValue(e, AccountingNodeEditTextValue.ShortName)
					}
					className={clsx(styles.input, styles.accounting_node_parameter)}
				/>
				<Select
					options={methods}
					onSelect={handleChangeAccountingNodeMethods}
					className={clsx(styles.selector, styles.accounting_node_parameter)}
					label={'Метод вычисления'}
					isRequired
				/>

				<Select
					options={calculateMethods}
					onSelect={handleChangeAccountingNodeCalculateMethods}
					className={clsx(styles.selector, styles.accounting_node_parameter)}
					label={'Способ вычисления'}
					isRequired
				/>

				<Input
					isRequired
					label="Округление"
					placeholder="Округление"
					name={AccountingNodeEditTextValue.Precision}
					value={precision}
					onChange={(e) =>
						handleChangeTextValue(e, AccountingNodeEditTextValue.Precision)
					}
					className={clsx(styles.input, styles.accounting_node_parameter)}
				/>
				<Input
					isRequired
					label="Сдвиг в часах"
					placeholder="Сдвиг в часах"
					name={AccountingNodeEditTextValue.HourShift}
					value={hourShift}
					onChange={(e) =>
						handleChangeTextValue(e, AccountingNodeEditTextValue.HourShift)
					}
					className={clsx(styles.input, styles.accounting_node_parameter)}
				/>
			</div>
		</div>
	);
}

export default memo(AccountingNodeParameters);
