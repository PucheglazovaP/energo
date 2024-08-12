import { Button } from '@evraz/ui-kit';
import { useStore } from 'effector-react';

import { closeModal } from '../../Models/Modal/events';
import { setAllObjectsValueFx } from '../../Models/NSIUserParameters/effects';
import { changeUserParameterValue } from '../../Models/NSIUserParameters/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import { ModuleName } from '../../Shared/Types/moduleName';
import Select from '../../UI/Select';
import { SelectOption } from '../../UI/Select/types';
import WarningMessage from '../../UI/WarningMessage';

import { $nsiGroupChangeValuesModel } from './model';

import styles from './NSIGroupChangeValues.module.css';

function NSIGroupChangeValues() {
	const { user, userParameters, userParameterOptions } = useStore(
		$nsiGroupChangeValuesModel,
	);
	const { parametersList, staticParametersList, selectedListId } =
		userParameters;

	const actualParameterData = parametersList.find((currentParameter) => {
		return currentParameter.id === selectedListId;
	});

	const staticParameterData = staticParametersList.find((staticParameter) => {
		return staticParameter.id === selectedListId;
	});

	const staticSelectOptions: SelectOption[] = staticParameterData
		? [
				{
					value: String(staticParameterData.value),
					label: String(staticParameterData.value),
					isSelected: true,
				},
		  ]
		: [];

	const handleSelectStaticOption = (staticOptions: SelectOption[]) => {
		// заглушка неактивного селекта, обусловлена обязательным свойством компонента Select.
		console.log(staticOptions);
	};

	let warningMessageText = '';

	const options = userParameterOptions.get(selectedListId);

	const actualSelectOptions: SelectOption[] =
		options && actualParameterData
			? options.parameterOptions.map((option) => {
					const stringifiedId = String(option.valueId);

					if (
						option.value === actualParameterData.value ||
						stringifiedId === actualParameterData.value
					) {
						warningMessageText = `Значение ${staticParameterData?.value} изменится на ${option.value} во всех совпадающих параметрах`;

						return {
							value: stringifiedId,
							label: option.value,
							isSelected: true,
						};
					}

					return {
						value: stringifiedId,
						label: option.value,
						isSelected: false,
					};
			  })
			: [];

	const handleSelectActualOption = (actualOptions: SelectOption[]) => {
		const selectedActualOption = actualOptions.find((actualOption) => {
			return actualOption.isSelected;
		});

		if (selectedActualOption) {
			changeUserParameterValue({
				id: selectedListId,
				value: String(selectedActualOption.value),
			});
		}
	};

	const handleCancelClick = () => {
		closeModal(RegisteredModals.NSIGroupChangeValues);
	};

	const handleConfirmClick = () => {
		if (
			user !== null &&
			staticParameterData &&
			staticParameterData.valueId !== null &&
			actualParameterData
		) {
			setAllObjectsValueFx({
				userId: user.preferredUsername,
				parameterId: selectedListId,
				currentValueId: staticParameterData.valueId,
				futureValueId: Number(actualParameterData.value),
				moduleName: ModuleName.NSIGroupChangeValues_setAllObjectsValueFx,
			}).then(() => {
				closeModal(RegisteredModals.NSIGroupChangeValues);
			});
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.body}>
				<Select
					className={styles.select}
					label="Текущее значение"
					options={staticSelectOptions}
					disabled
					onSelect={handleSelectStaticOption}
				/>
				<Select
					className={styles.select}
					label="Значение замены"
					options={actualSelectOptions}
					onSelect={handleSelectActualOption}
				/>
				<WarningMessage
					className={styles.warning_message}
					text={warningMessageText}
				/>
			</div>
			<div className={styles.footer}>
				<Button onClick={handleCancelClick}>Отмена</Button>
				<Button primary onClick={handleConfirmClick}>
					Подтвердить
				</Button>
			</div>
		</div>
	);
}

export default NSIGroupChangeValues;
