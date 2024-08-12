import { MouseEvent, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import useInterval from '../../Facades/useIntreval';
import { $activeForm, $activeFormLayers } from '../../Models/ActiveForm';
import {
	fetchObjectValues,
	setDateTime,
	setTransparentSelectedStatus,
} from '../../Models/ActiveForm/events';
import { $activeIds } from '../../Models/ActiveIds';
import { $user } from '../../Models/Auth';
import { setChartIds } from '../../Models/DynamicChart/events';
import { setContextMenuObject } from '../../Models/FormContextMenu/events';
import { openModal } from '../../Models/Modal/events';
import { $navigation } from '../../Models/Navigation';
import { changeFormRoute } from '../../Models/NavigationHistory/events';
import { setMetricId } from '../../Models/TransparentEmergencyEventsInfo/events';
import { getFormInfoById } from '../../Models/TreeForms/events';
import { RegisteredModals } from '../../Shared/modalsConfig';
import {
	FormObject as TFormObject,
	TransparentConfiguration,
} from '../../Shared/Types/formObject';
import ContextMenu from '../../UI/ContextMenu';
import FormObject from '../../UI/FormObjects/FormObject';
import Spinner from '../../UI/Spinner';
import { updateSearchParams } from '../../Utils/searchParams';

import FormObjectTooltip from './FormObjectTooltip';
import FormProps from './types';
import useContextMenu from './useContextMenu';
import { validateTransprarent } from './utils';

import styles from './Form.module.css';

function Form({ className }: FormProps) {
	const {
		formBackground,
		formTransparentObjects,
		formDynamicObjects,
		isLoading,
		isEmergencyEventsModeEnabled,
		isFormProportionsSaved,
		statusIndicators,
	} = useStore($activeForm);
	const user = useStore($user);
	const { activeVersion } = useStore($activeIds);
	const { checkedFormLayers } = useStore($activeFormLayers);

	const { position, setPosition, items } = useContextMenu();
	const location = useLocation();
	const { treeType } = useStore($navigation);
	const [, setSearchParams] = useSearchParams();

	const onContextMenu = (evt: MouseEvent, obj: TFormObject) => {
		setContextMenuObject(obj);
		setPosition({ x: evt.pageX, y: evt.pageY });
	};

	const [hoveredObject, setHoveredObject] = useState<TFormObject | null>(null);
	const [isTooltipVisible, setShowTooltip] = useState(false);
	const [tooltipPosition, setTooltipPosition] = useState<{
		x: number;
		y: number;
	}>({ x: 0, y: 0 });

	const formObjects = useMemo(() => {
		return [
			...formTransparentObjects,
			...formDynamicObjects,
			...statusIndicators,
		]
			.sort((a, b) => a.orderNumber - b.orderNumber)
			.filter((item) => checkedFormLayers.includes(item.layerId));
	}, [
		formTransparentObjects,
		formDynamicObjects,
		checkedFormLayers,
		statusIndicators,
	]);

	const handleMouseEnter = (evt: MouseEvent, obj: TFormObject) => {
		setShowTooltip(true);
		setHoveredObject(obj);
		setTooltipPosition({ x: evt.pageX, y: evt.pageY });
	};

	const handleMouseLeave = () => {
		setShowTooltip(false);
		setHoveredObject(null);
	};
	const handleEmergencyButtonClick = (obj: TFormObject) => {
		openModal(RegisteredModals.TransparentEmergencyEventsTable);
		setMetricId(obj.metricId);
	};

	const handleTransparentSelect = (
		isChecked: boolean,
		transparent: TransparentConfiguration,
	) => {
		setTransparentSelectedStatus({
			objectId: transparent.id,
			isSelected: isChecked,
		});
		if (transparent.groupId)
			setChartIds({
				isChecked,
				groupNumber: transparent.groupId,
				name: transparent.groupName || '',
			});
		else
			isChecked && toast.warn('У данного транспаранта нет привязанной группы');
	};
	const handleFormObjectClick = (item: TFormObject) => {
		if (!user) return;
		if (item.isLinkEnabled) {
			if (item.link != '') window.open(item.link);
			else toast.error('URL для объекта не указан');
		} else if (item.gotonCode) {
			changeFormRoute(location.pathname + location.search);
			setShowTooltip(false);
			getFormInfoById({
				versionCode: activeVersion?.code || 90,
				formId: item.gotonCode,
				userId: user.preferredUsername,
			});
			const updatedSearchParams = updateSearchParams(new URLSearchParams(), {
				versionId: activeVersion?.code || 90,
				treeType,
				formId: item.gotonCode,
			});
			setSearchParams(updatedSearchParams);
		}
	};

	const isTransparentTooltipEnabled = (): boolean => {
		return (
			isTooltipVisible &&
			!!hoveredObject &&
			!!hoveredObject.groupId &&
			hoveredObject.objectType === 'Транспарант'
		);
	};

	useInterval(() => {
		setDateTime(new Date());
		fetchObjectValues();
	}, 60000);

	return (
		<div className={clsx(styles.root, className)}>
			{isLoading ? (
				<Spinner className={styles.loading} />
			) : (
				<div
					style={{
						position: 'relative',
						width: 'auto',
						height: '100%',
						display: 'flex',
						justifyContent: 'center',
					}}
				>
					<svg
						height={'100%'}
						className={clsx(
							styles.form,
							isFormProportionsSaved && styles.form__proportions_saved,
						)}
						viewBox={`0 0 791 528`}
						preserveAspectRatio="none"
						/* preserveAspectRatio="xMaxYMax meet" */
						id="scheme"
						xmlnsXlink="http://www.w3.org/1999/xlink"
					>
						<image
							xlinkHref={formBackground}
							width="100%"
							height="100%"
							x="0"
							y="0"
							preserveAspectRatio="none"
							/* preserveAspectRatio="xMaxYMax meet" */
						/>
						{formObjects.map((item, index) => {
							return (
								<FormObject
									key={`${item.id}-${index}`}
									object={item}
									handleClick={() => {
										handleFormObjectClick(item as TFormObject);
									}}
									handleSelect={(isChecked) =>
										handleTransparentSelect(
											isChecked,
											item as TransparentConfiguration,
										)
									}
									isSelected={(item as TransparentConfiguration).isSelected}
									validate={validateTransprarent}
									onContextMenu={onContextMenu}
									onMouseMove={handleMouseEnter}
									onMouseLeave={handleMouseLeave}
									onEmergencyButtonClick={handleEmergencyButtonClick}
									isEmergencyEventsModeEnabled={isEmergencyEventsModeEnabled}
								/>
							);
						})}
					</svg>
				</div>
			)}
			{position && (
				<ContextMenu
					items={items}
					position={position}
					setPosition={setPosition}
				/>
			)}
			{isTransparentTooltipEnabled() && (
				<FormObjectTooltip
					topPosition={tooltipPosition.y}
					leftPosition={tooltipPosition.x}
					formObject={hoveredObject}
				/>
			)}
		</div>
	);
}

export default Form;
