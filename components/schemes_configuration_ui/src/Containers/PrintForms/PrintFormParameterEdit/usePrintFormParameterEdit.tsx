import { useEffect, useMemo } from 'react';
import { addDays } from 'date-fns';
import { useStore } from 'effector-react';

import { $user } from '../../../Models/Auth';
import { closeModal } from '../../../Models/Modal/events';
import {
	$selectedPrintFormParameterLinkId,
	$selectedPrintFormParameterName,
	$selectedPrintFormParameterValues,
} from '../../../Models/PrintForms';
import {
	addPrintFormParameterValueFx,
	fetchPrintFormParameterValuesFx,
} from '../../../Models/PrintForms/effects';
import { checkIsMaxDate } from '../../../Shared/checkIsMaxDate';
import { RegisteredModals } from '../../../Shared/modalsConfig';
import { PrintFormParameterValue, User } from '../../../Shared/types';
import { ModuleName } from '../../../Shared/Types/moduleName';
import { DateFormat, formatDate } from '../../../Utils/dateUtils';
import PrintFormParameterValueForm from '../PrintFormParameterValueForm';

function usePrintFormParameterEdit() {
	const paramName: string = useStore($selectedPrintFormParameterName);
	const linkId: number = useStore($selectedPrintFormParameterLinkId);
	const user: User | null = useStore($user);
	const paramValues: PrintFormParameterValue[] = useStore(
		$selectedPrintFormParameterValues,
	);
	const paramValuesSorted = useMemo(() => {
		return paramValues
			.slice()
			.sort(function (
				valueA: PrintFormParameterValue,
				valueB: PrintFormParameterValue,
			) {
				return +valueB.dateFrom - +valueA.dateTo;
			});
	}, [paramValues]);

	const isAddValueButtonDisabled: boolean = useMemo(() => {
		if (paramValuesSorted.length > 0) {
			return checkIsMaxDate(paramValuesSorted[0].dateTo);
		}
		return false;
	}, [paramValuesSorted]);

	const { defaultDateFrom, defaultDateTo } = useMemo(() => {
		if (paramValuesSorted.length > 0) {
			return {
				defaultDateFrom: formatDate(
					addDays(paramValuesSorted[0].dateTo, 1),
					DateFormat.DisplayDatabaseFormat,
				),
				defaultDateTo: formatDate(
					addDays(paramValuesSorted[0].dateTo, 2),
					DateFormat.DisplayDatabaseFormat,
				),
			};
		}
		return {
			defaultDateFrom: formatDate(new Date(), DateFormat.DisplayDatabaseFormat),
			defaultDateTo: formatDate(
				addDays(new Date(), 1),
				DateFormat.DisplayDatabaseFormat,
			),
		};
	}, [paramValuesSorted]);

	const valuesList: JSX.Element[] = useMemo(() => {
		return paramValues.map((paramValue: PrintFormParameterValue) => (
			<div key={paramValue.valueId}>
				<PrintFormParameterValueForm {...paramValue} />
			</div>
		));
	}, [paramValues]);

	function handleValueAdd() {
		if (user && linkId) {
			addPrintFormParameterValueFx({
				userId: user.preferredUsername,
				linkId: Number(linkId),
				name: 'Новое значение параметра',
				dateFrom: defaultDateFrom,
				dateTo: defaultDateTo,
				moduleName:
					ModuleName.UsePrintFormParameterEdit_addPrintFormParameterValueFx,
			});
		}
	}
	function handleConfirm() {
		closeModal(RegisteredModals.EditPrintFormParameter);
	}
	useEffect(() => {
		if (user && linkId) {
			fetchPrintFormParameterValuesFx({
				linkId: Number(linkId),
				userId: user.preferredUsername,
				moduleName:
					ModuleName.UsePrintFormParameterEdit_fetchPrintFormParameterValuesFx,
			});
		}
	}, [linkId, user]);

	return {
		paramName,
		valuesList,
		isAddValueButtonDisabled,
		handleConfirm,
		handleValueAdd,
	};
}

export default usePrintFormParameterEdit;
