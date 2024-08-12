import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@evraz/ui-kit';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import { convertTrendsToSelect } from '../../Adapters/Select/convertTrendsToSelect';
import { Bin, Plus } from '../../Icons';
import { $activeIds } from '../../Models/ActiveIds';
import { $user } from '../../Models/Auth';
import { $chartProperties } from '../../Models/ChartProperties';
import {
	createSeriesFx,
	deleteSeriesFx,
	fetchFormObjectsParametersQuerysFx,
} from '../../Models/EditMode/effects';
import {
	deleteChartPoints,
	setFormSelectedStatus,
} from '../../Models/EditMode/events';
import { setMultichartActiveId } from '../../Models/MultichartSettings/events';
import { ModuleName } from '../../Shared/Types/moduleName';
import Select from '../../UI/Select';
import { SelectOption } from '../../UI/Select/types';

import styles from './ChartTitleSection.module.css';

function MultichartController() {
	const { multichartActiveId, formId, isFormSelected, objectParameters } =
		useStore($chartProperties);
	const user = useStore($user);
	const { activeVersionId = 0 } = useStore($activeIds);
	const options: SelectOption[] = [
		{
			label: 'Основные настройки формы',
			value: formId || '',
			isSelected: multichartActiveId === formId,
		},
		...convertTrendsToSelect(objectParameters, multichartActiveId),
	];

	const toggleFormSelectedStatus = (value: number, id: number | null) => {
		const isForm: boolean = value === id;
		setFormSelectedStatus(isForm);
	};

	const selectActiveId = (options: SelectOption[]) => {
		const selectedOption = options.find((option) => option.isSelected);
		if (selectedOption) {
			const numericValue: number = Number(selectedOption.value);
			toggleFormSelectedStatus(numericValue, formId);
			setMultichartActiveId(numericValue);
		}
	};

	const deleteTrend = () => {
		if (!user) {
			return;
		}
		deleteSeriesFx({
			objectId: multichartActiveId,
			userId: user.preferredUsername,
			moduleName: ModuleName.MultichartController_deleteSeriesFx,
		}).then((deletedCount) => {
			if (!deletedCount) {
				toast.error('При удалении серии произошла ошибка');
				return;
			}
			deleteChartPoints(multichartActiveId);
		});
	};

	const createTrend = () => {
		createSeriesFx({ formId, versionId: activeVersionId }).then((response) => {
			if (response.err === 1) {
				toast.error(response.textErr);
				return;
			}
			if (response.trendId) {
				if (response.trendId) {
					toggleFormSelectedStatus(response.trendId, formId);
					setMultichartActiveId(response.trendId);
					toast.success('Тренд успешно создан');
					fetchFormObjectsParametersQuerysFx({
						objectId: response.trendId,
						versionCode: multichartActiveId,
					});
				}
			}
		});
	};

	// When active form changed - change multichart activeId
	// (in fact, it will be called only once (on mount))
	useEffect(() => {
		setMultichartActiveId(formId || 0);
	}, [formId]);

	return (
		<div className={styles.multichart_controller}>
			<Select
				className={clsx(styles.button, styles.multichart_select)}
				options={options}
				onSelect={selectActiveId}
			/>
			<span className={styles.multichart_separator} />
			<Button
				className={clsx(styles.button, styles.multichart_button)}
				onClick={createTrend}
			>
				<Plus className={styles.multichart_icon} />
				Добавить
			</Button>
			<Button
				className={clsx(styles.button, styles.multichart_button)}
				onClick={deleteTrend}
				disabled={isFormSelected}
			>
				<Bin className={styles.multichart_icon} />
				Удалить
			</Button>
		</div>
	);
}

export default MultichartController;
