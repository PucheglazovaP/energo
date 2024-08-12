import clsx from 'clsx';

import ParamsContainer from '../../Containers/ParamsContainer/ParamsContainer';
import { useParametersBlock } from '../../Hooks/ParametersBlock/useParametersBlock';
import { useParametersBlockOperation } from '../../Hooks/ParametersBlock/useParametersBlockOperation';

import ParamsHeader from './ParamsHeader';

import style from './TreeBlockParams.module.css';

interface TableParamsProps {
	isActive: boolean;
	onAction(): void;
}

function TreeBlockParams({ isActive = false, onAction }: TableParamsProps) {
	const { parametersData, isCreating } = useParametersBlock();
	const { confirmFunction, cancelFunction } =
		useParametersBlockOperation(parametersData);

	return (
		<div
			className={
				isActive
					? clsx(style.tableParams, style.activeParams)
					: clsx(style.tableParams, style.disabledParams)
			}
		>
			<ParamsHeader title={'Блок параметров'} onAction={onAction} />
			<div className={style.paramsBody}>
				<div className={style.paramsBody__content}>
					{parametersData?.map((el, index) => (
						<ParamsContainer
							header={el.header}
							sortParams={el.sortParams}
							key={`${el}_${index}`}
						/>
					))}
				</div>
				{isCreating && (
					<div className={style.paramsBody__buttons}>
						<button
							className={clsx(style.button, style.button__cancelBtn)}
							onClick={cancelFunction}
						>
							Отмена
						</button>
						<button
							className={clsx(style.button, style.button__saveBtn)}
							onClick={confirmFunction}
						>
							Сохранить
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default TreeBlockParams;
