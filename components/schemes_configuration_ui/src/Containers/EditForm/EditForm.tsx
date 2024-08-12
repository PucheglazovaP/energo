import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import clsx from 'clsx';
import { useStore } from 'effector-react';

import useOutsideClick from '../../Facades/useOutsideClick';
import { $activeForm } from '../../Models/ActiveForm';
import { $user } from '../../Models/Auth';
import { $editMode, $selectedObjectsState } from '../../Models/EditMode';
import {
	createDynamicObject,
	createStatusIndicator,
	createTransparent,
	resetSelection,
	setFormSelectedStatus,
	setObjectSelectedStatus,
	updateObjectParameter,
} from '../../Models/EditMode/events';
import {
	setContextMenuObject,
	setContextMenuObjectById,
	setPasteCoord,
} from '../../Models/FormContextMenu/events';
import { $formLayers } from '../../Models/FormLayers';
import { getCurrentFormLayersFx } from '../../Models/FormLayers/effects';
import { $switchModal } from '../../Models/Modal';
import { $navigation } from '../../Models/Navigation';
import { FormTypes } from '../../Shared/types';
import { FormObject, ObjectTypes } from '../../Shared/Types/formObject';
import ContextMenu from '../../UI/ContextMenu';
import EditableFormObject from '../../UI/FormObjects/EditableFormObject';
import ReshapeRectangle from '../../UI/ReshapeRectangle/ReshapeRectangle';
import { TReshapeRectangle } from '../../UI/ReshapeRectangle/types';
import Spinner from '../../UI/Spinner';
import EditFormPanel from '../EditFormPanel';
import InformationAboutBanners from '../InformationAboutBanners';
import InformationAboutDynamicObjects from '../InformationAboutDynamicObjects';

import useContextMenu from './useContextMenu';
import {
	calculateResizedObjectValue,
	getFormObjectsAtPointClick,
	getReshapeRectangle,
	getWidthParameterName,
} from './utils';

import styles from './EditForm.module.css';

function EditForm() {
	const [reshapeRectanglePos, setReshapeRectanglePos] =
		useState<TReshapeRectangle | null>(null);

	const { id } = useStore($activeForm);
	const isFormLayersLoading = useStore(getCurrentFormLayersFx.pending);
	const {
		formBackground,
		formTransparentObjects,
		formDynamicObjects,
		formType,
		isLoading: isFormLoading,
		objectParameters,
		isCreateTransparentModeEnabled,
		isCreateDynamicObjectModeEnabled,
		isCreateStatusIndicatorEnabled,
		title,
		statusIndicators,
	} = useStore($editMode);
	const { selectedObjects, isFormSelected } = useStore($selectedObjectsState);
	const { checkedFormLayers } = useStore($formLayers);
	const user = useStore($user);
	const { switchModalTransparent, switchModalDynamicObject } =
		useStore($switchModal);
	const { versionId = 0 } = useStore($navigation);

	const isLoading = isFormLoading || isFormLayersLoading;

	const {
		position: contextMenuPosition,
		setPosition: setContextMenuPosition,
		items: contextMenuItems,
		objectsForCopy,
	} = useContextMenu();

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
	const filteredSelectedObjects = selectedObjects.filter((item) =>
		checkedFormLayers.includes(item.layerId),
	);
	// избежание устаревшего замыкания
	const selectedObjectsCopy = useRef(filteredSelectedObjects);
	selectedObjectsCopy.current = filteredSelectedObjects;
	const selectedObjectIds = useMemo(() => {
		return filteredSelectedObjects.map((item) => item.id);
	}, [filteredSelectedObjects]);

	const handleClearPosition = () => {
		setContextMenuObject(null);
		setContextMenuPosition(null);
	};

	const svgRef = useOutsideClick<SVGSVGElement>(
		!!contextMenuPosition,
		handleClearPosition,
	);

	const handleOnSVGClick = (
		event: React.MouseEvent<SVGElement, MouseEvent>,
	) => {
		setContextMenuPosition(null);
		if (!user) {
			return;
		}
		if (svgRef.current) {
			const svg = svgRef.current;
			const { pageX, pageY } = event;
			let point = DOMPoint.fromPoint(svg as unknown as DOMPoint);
			point.x = pageX;
			point.y = pageY;
			const ctm = (svg as SVGSVGElement).getScreenCTM();
			if (
				isCreateTransparentModeEnabled ||
				isCreateDynamicObjectModeEnabled ||
				isCreateStatusIndicatorEnabled
			) {
				if (ctm) {
					const inverse = ctm.inverse();
					const p = point.matrixTransform(inverse);
					if (isCreateTransparentModeEnabled) {
						createTransparent({
							x: Math.round(p.x),
							y: Math.round(p.y),
							userId: user.preferredUsername,
						});
					}
					if (isCreateDynamicObjectModeEnabled) {
						createDynamicObject({
							x: Math.round(p.x),
							y: Math.round(p.y),
							userId: user.preferredUsername,
						});
					}
					if (isCreateStatusIndicatorEnabled)
						createStatusIndicator({
							x: Math.round(p.x),
							y: Math.round(p.y),
							userId: user.preferredUsername,
						});
				}
			} else if (event.shiftKey) {
				if (ctm) {
					const inverse = ctm.inverse();
					const p = point.matrixTransform(inverse);
					const newSelectedObjects = getFormObjectsAtPointClick(
						p.x,
						p.y,
						formObjects,
					);
					if (newSelectedObjects.length > 0) {
						setObjectSelectedStatus({
							objectId: newSelectedObjects[newSelectedObjects.length - 1].id,
							isMultipleSelection: true,
						});
					}
				}
			}
		}
	};

	const onFormContextMenu = useCallback(
		(evt: React.MouseEvent<SVGElement, MouseEvent>) => {
			evt.preventDefault();
			setContextMenuObject(null);
			if (objectsForCopy && objectsForCopy.length > 0) {
				const { pageX, pageY } = evt;
				setContextMenuPosition({ x: pageX, y: pageY });
				const svg = svgRef.current;
				if (svgRef.current) {
					let point = DOMPoint.fromPoint(svg as unknown as DOMPoint);
					point.x = pageX;
					point.y = pageY;
					const ctm = (svg as SVGSVGElement).getScreenCTM();
					if (ctm) {
						const inverse = ctm.inverse();
						const p = point.matrixTransform(inverse);

						setPasteCoord({ x: Math.round(p.x), y: Math.round(p.y) });
					}
				}
			}
		},
		[objectsForCopy],
	);

	const onKeyPress = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			setContextMenuPosition(null);
			resetSelection();
		}
	};

	const handleSelectedObjectContextMenu = (evt: React.MouseEvent) => {
		evt.stopPropagation();
		evt.preventDefault();
		setContextMenuObjectById(selectedObjectsCopy.current[0].id);
		setContextMenuPosition({ x: evt.pageX, y: evt.pageY });
		if (filteredSelectedObjects.length < 2)
			setObjectSelectedStatus({
				objectId: selectedObjectsCopy.current[0].id,
				isMultipleSelection: false,
			});
	};

	const handleContextMenu = (evt: React.MouseEvent, obj: FormObject) => {
		setReshapeRectanglePos(null);
		evt.preventDefault();
		evt.stopPropagation();
		setContextMenuObjectById(obj.id);
		setContextMenuPosition({ x: evt.pageX, y: evt.pageY });
		if (filteredSelectedObjects.length < 2)
			setObjectSelectedStatus({
				objectId: obj.id,
				isMultipleSelection: false,
			});
	};
	// Set reshape rectangle position based on the selected elements
	useEffect(() => {
		const pos: TReshapeRectangle | null = filteredSelectedObjects.length
			? getReshapeRectangle(filteredSelectedObjects)
			: null;
		setReshapeRectanglePos(pos);
		selectedObjectsCopy.current = filteredSelectedObjects;
	}, [selectedObjects]);

	// Gets delta values (old - new) as parameter
	const updateSize = (
		x: number,
		y: number,
		width: number,
		height: number,
		isMultiple: boolean = false,
	) => {
		if (!isMultiple && filteredSelectedObjects.length > 0) {
			const parameters = objectParameters.get(filteredSelectedObjects[0].id);
			const objectType: ObjectTypes = filteredSelectedObjects[0].objectType;
			const widthName = getWidthParameterName(objectType);
			const xParameter = parameters?.find((item) => item.parameterName === 'x');
			const yParameter = parameters?.find((item) => item.parameterName === 'y');
			const heightParameter = parameters?.find(
				(item) => item.parameterName === 'height',
			);
			const widthParameter = parameters?.find(
				(item) => item.parameterName === widthName,
			);

			const newX = calculateResizedObjectValue(xParameter?.value, x);
			const newY = calculateResizedObjectValue(yParameter?.value, y);
			const newWidth = calculateResizedObjectValue(
				widthParameter?.value,
				width,
			);
			const newHeight = calculateResizedObjectValue(
				heightParameter?.value,
				height,
			);

			updateObjectParameter({
				objectId: filteredSelectedObjects[0].id,
				value: newX,
				parameterName: 'x',
				parameterCode: xParameter?.parameterCode,
				versionCode: versionId,
			});
			updateObjectParameter({
				objectId: filteredSelectedObjects[0].id,
				value: newY,
				parameterName: 'y',
				parameterCode: yParameter?.parameterCode,
				versionCode: versionId,
			});
			updateObjectParameter({
				objectId: filteredSelectedObjects[0].id,
				value: newHeight,
				parameterName: 'height',
				parameterCode: heightParameter?.parameterCode,
				versionCode: versionId,
			});
			updateObjectParameter({
				objectId: filteredSelectedObjects[0].id,
				value: newWidth,
				parameterName: widthName,
				parameterCode: widthParameter?.parameterCode,
				versionCode: versionId,
			});
		}
		if (isMultiple) {
			for (const object of filteredSelectedObjects) {
				const parameters = objectParameters.get(object.id);
				const objectType: ObjectTypes = object.objectType;
				const widthName = getWidthParameterName(objectType);
				const xParameter = parameters?.find(
					(item) => item.parameterName === 'x',
				);
				const yParameter = parameters?.find(
					(item) => item.parameterName === 'y',
				);
				const heightParameter = parameters?.find(
					(item) => item.parameterName === 'height',
				);
				const widthParameter = parameters?.find(
					(item) => item.parameterName === widthName,
				);

				const newX = calculateResizedObjectValue(xParameter?.value, x);
				const newY = calculateResizedObjectValue(yParameter?.value, y);
				const newWidth = calculateResizedObjectValue(
					widthParameter?.value,
					width,
				);
				const newHeight = calculateResizedObjectValue(
					heightParameter?.value,
					height,
				);

				updateObjectParameter({
					objectId: object.id,
					value: newX,
					parameterName: 'x',
					parameterCode: xParameter?.parameterCode,
					versionCode: versionId,
				});
				updateObjectParameter({
					objectId: object.id,
					value: newY,
					parameterName: 'y',
					parameterCode: yParameter?.parameterCode,
					versionCode: versionId,
				});
				updateObjectParameter({
					objectId: object.id,
					value: newHeight,
					parameterName: 'height',
					parameterCode: heightParameter?.parameterCode,
					versionCode: versionId,
				});
				updateObjectParameter({
					objectId: object.id,
					value: newWidth,
					parameterName: widthName,
					parameterCode: widthParameter?.parameterCode,
					versionCode: versionId,
				});
			}
		}
	};

	const updateCoord = (
		newXCoord: number,
		newYCoord: number,
		isMultiple: boolean = false,
	) => {
		if (!isMultiple && filteredSelectedObjects.length > 0) {
			const parameters = objectParameters.get(filteredSelectedObjects[0].id);
			const xParameter = parameters?.find((item) => item.parameterName === 'x');
			const yParameter = parameters?.find((item) => item.parameterName === 'y');
			if (newXCoord >= 791 || newXCoord < 0) newXCoord = 0;
			if (newYCoord >= 528 || newYCoord < 0) newYCoord = 0;
			updateObjectParameter({
				objectId: filteredSelectedObjects[0].id,
				value: Math.round(newXCoord),
				parameterName: 'x',
				parameterCode: xParameter?.parameterCode,
				versionCode: versionId,
			});
			updateObjectParameter({
				objectId: filteredSelectedObjects[0].id,
				value: Math.round(newYCoord),
				parameterName: 'y',
				parameterCode: yParameter?.parameterCode,
				versionCode: versionId,
			});
		}
		if (isMultiple) {
			if (!selectedObjectsCopy.current) {
				return;
			}
			const test: TReshapeRectangle | null = selectedObjectsCopy.current.length
				? getReshapeRectangle(selectedObjectsCopy.current)
				: null;
			if (!test) {
				return;
			}
			for (const object of selectedObjectsCopy.current) {
				const parameters = objectParameters.get(object.id);
				const xParameter = parameters?.find(
					(item) => item.parameterName === 'x',
				);
				const yParameter = parameters?.find(
					(item) => item.parameterName === 'y',
				);
				const deltaX: number = Math.round(test.startX - newXCoord);
				const deltaY: number = Math.round(test.startY - newYCoord);
				let x = Math.round(Number(object?.x || 0) - deltaX);
				let y = Math.round(Number(object?.y || 0) - deltaY);
				if (x >= 791 || x < 0) x = 0;
				if (y >= 528 || y < 0) y = 0;
				updateObjectParameter({
					objectId: object.id,
					value: x,
					parameterName: 'x',
					parameterCode: xParameter?.parameterCode,
					versionCode: versionId,
				});
				updateObjectParameter({
					objectId: object.id,
					value: y,
					parameterName: 'y',
					parameterCode: yParameter?.parameterCode,
					versionCode: versionId,
				});
			}
		}
	};

	const onFormClick = useCallback(() => {
		if (!isCreateTransparentModeEnabled && !isFormSelected) {
			setFormSelectedStatus(true); // select form if it's not already selected
		}
	}, [isCreateTransparentModeEnabled, isFormSelected]);

	useEffect(() => {
		window.addEventListener('keydown', onKeyPress);

		return () => {
			window.removeEventListener('keydown', onKeyPress);
		};
	}, []);

	return (
		<div className={clsx(styles.root)}>
			<EditFormPanel className={styles.panel} />
			{switchModalTransparent && (
				<InformationAboutBanners
					codeForm={id}
					codeVersion={versionId}
					title={title}
				/>
			)}
			{switchModalDynamicObject && (
				<InformationAboutDynamicObjects
					codeForm={id}
					codeVersion={versionId}
					title={title}
				/>
			)}
			<div className={styles.scheme}>
				{isLoading && <Spinner className={styles.loading} />}
				{!isLoading && formType === FormTypes.Form && (
					<div className={styles.wrapper}>
						<svg
							style={{
								height: '100%',
							}}
							viewBox={`0 0 791 528`}
							className={styles.form}
							preserveAspectRatio="xMaxYMax meet"
							fillRule="evenodd"
							onClick={(event) => {
								handleOnSVGClick(event);
							}}
							ref={svgRef}
							onContextMenu={onFormContextMenu}
						>
							<image
								xlinkHref={formBackground}
								width="100%"
								height="100%"
								x="0"
								y="0"
								preserveAspectRatio="none"
								/* 							preserveAspectRatio="xMaxYMin slice" */
								onClick={onFormClick}
							/>
							{formObjects.map((item, index) => {
								const isSelected = selectedObjectIds.includes(item.id);
								return (
									<EditableFormObject
										borderClassName={
											selectedObjectIds.length > 1 && isSelected
												? clsx(styles.corner, styles.corner__hidden)
												: undefined
										}
										key={`${item.id}-${index}`}
										object={item}
										isActionsDisabled={isCreateTransparentModeEnabled}
										handleClick={(event) => {
											event.stopPropagation();
											setReshapeRectanglePos(null);
											if (!isCreateTransparentModeEnabled) {
												if (event.shiftKey) {
													setObjectSelectedStatus({
														objectId: item.id,
														isMultipleSelection: true,
													});
												} else {
													setObjectSelectedStatus({
														objectId: item.id,
														isMultipleSelection: false,
													});
												}
											}
										}}
										isSelected={isSelected}
										onContextMenu={handleContextMenu}
										className={styles.form_object}
									/>
								);
							})}
							{reshapeRectanglePos && (
								<ReshapeRectangle
									className={styles.reshape_rectangle}
									startX={reshapeRectanglePos.startX}
									startY={reshapeRectanglePos.startY}
									width={reshapeRectanglePos.width}
									height={reshapeRectanglePos.height}
									handleResizeEnd={(newX, newY, width, height) => {
										updateSize(newX, newY, width, height, true);
									}}
									handleDragEnd={(x, y) => {
										if (
											reshapeRectanglePos.startX !== x ||
											reshapeRectanglePos.startY !== y
										)
											updateCoord(x, y, true);
									}}
									onContextMenu={handleSelectedObjectContextMenu}
									key="rect"
								/>
							)}
							{isFormSelected && (
								<>
									<rect
										x="0"
										y="0"
										width="8"
										height="8"
										fill="white"
										stroke="#9747FF"
										strokeWidth="0.5"
									/>
									<rect
										x="783"
										y="0"
										width="8"
										height="8"
										fill="white"
										stroke="#9747FF"
										strokeWidth="0.5"
									/>
									<rect
										x="0"
										y="520"
										width="8"
										height="8"
										fill="white"
										stroke="#9747FF"
										strokeWidth="0.5"
									/>
									<rect
										x="783"
										y="520"
										width="8"
										height="8"
										fill="white"
										stroke="#9747FF"
										strokeWidth="0.5"
									/>
								</>
							)}
						</svg>
					</div>
				)}
			</div>
			<ContextMenu
				items={contextMenuItems}
				position={contextMenuPosition}
				setPosition={setContextMenuPosition}
			/>
		</div>
	);
}

export default EditForm;
