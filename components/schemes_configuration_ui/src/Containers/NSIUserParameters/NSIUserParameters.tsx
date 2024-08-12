import { useEffect } from 'react';
import { useStore } from 'effector-react';

import {
	getUserParameterFilesListFx,
	getUserParameterOptionsFx,
	getUserParametersListFx,
} from '../../Models/NSIUserParameters/effects';
import {
	resetUserParameterFilesListModel,
	resetUserParameterOptionsModel,
} from '../../Models/NSIUserParameters/events';
import { ModuleName } from '../../Shared/Types/moduleName';
import WarningMessage from '../../UI/WarningMessage';

import DataTable from './components/DataTable';
import { $userParametersModel } from './model';
import { NSIParameterType, NSIUserParametersProps } from './types';
import { getTableData } from './utils';

import styles from './NSIUserParameters.module.css';

function NSIUserParameters({ unit }: NSIUserParametersProps) {
	const { user, userParameters, userParameterOptions } =
		useStore($userParametersModel);
	const {
		viewMode,
		defaultParameters,
		parametersList,
		staticParametersList,
		allParametersExpanded,
	} = userParameters;

	useEffect(() => {
		if (user !== null) {
			getUserParametersListFx({
				unitId: unit.itemNumber,
				unitTypeId: unit.typeId,
				userId: user.preferredUsername,
				moduleName: ModuleName.NSIUserParameters_getUserParametersListFx,
			}).then((requestedParameters) => {
				requestedParameters.forEach((requestedParameter) => {
					if (requestedParameter.dataType === NSIParameterType.LIST) {
						getUserParameterOptionsFx({
							userId: user.preferredUsername,
							parameterId: requestedParameter.id,
							moduleName:
								ModuleName.NSIUserParameters_getUserParameterOptionsFx,
						});
					}

					if (
						requestedParameter.dataType === NSIParameterType.FILE &&
						requestedParameter.valueId !== null
					) {
						getUserParameterFilesListFx({
							userId: user.preferredUsername,
							valueId: requestedParameter.valueId,
							moduleName:
								ModuleName.NSIUserParameters_getUserParameterFilesListFx,
						});
					}
				});
			});
		}
	}, [user, unit]);

	useEffect(() => {
		return () => {
			resetUserParameterOptionsModel();
			resetUserParameterFilesListModel();
		};
	}, []);

	const tableData =
		parametersList.length !== 0 && user !== null
			? getTableData(
					unit,
					user.preferredUsername,
					viewMode,
					defaultParameters === 'actual'
						? parametersList
						: staticParametersList,
					userParameterOptions,
					allParametersExpanded,
			  )
			: null;

	return tableData !== null ? (
		<DataTable
			className={styles.container}
			headerData={tableData.header}
			bodyData={tableData.body}
			bodyClassName={styles.table_body}
			orientation="row"
		/>
	) : (
		<WarningMessage text="Нет данных для отображения." />
	);
}

export default NSIUserParameters;
