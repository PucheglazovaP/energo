import AccountingNode from '../Containers/AccountingNode/AccountingNode';
import ChartComparison from '../Containers/ChartComparison';
import ColumnChartSection from '../Containers/ColumnChartSection';
import ConfirmFormDeletion from '../Containers/ConfirmFormDeletion';
import ConfirmSystemLayerDeletion from '../Containers/ConfirmSystemLayerDeletion';
import ConfirmSystemLayerEdit from '../Containers/ConfirmSystemLayerEdit';
import CreateReportItem from '../Containers/CreateReportItem';
import CreateSystemLayer from '../Containers/CreateSystemLayer';
import DeleteEmergencyEventParameter from '../Containers/DeleteEmergencyEventParameter';
import DeleteParameter from '../Containers/DeleteParameter/DeleteParameter';
import DeletePoint from '../Containers/DeletePoint';
import DeletePrintForm from '../Containers/DeletePrintForm';
import DeleteReport from '../Containers/DeleteReport';
import DeleteReportItem from '../Containers/DeleteReportItem';
import DeleteVisualizationGroup from '../Containers/DeleteVisualizationGroup/DeleteVisualizationGroup';
import DeviceHealthiness from '../Containers/DeviceHealthiness/DeviceHealthiness';
import DevicesGroupsArchive from '../Containers/DevicesGroupsArchive';
import DynamicChartSection from '../Containers/DynamicChartSection';
import DynamicObjectImages from '../Containers/DynamicObjectImages';
import EditBaseHour from '../Containers/EditBaseHour';
import EditInputForm from '../Containers/EditInputForm';
import EditInputFormBlocking from '../Containers/EditInputFormBlocking';
import EditInputFormResume from '../Containers/EditInputFormResume';
import EditLinkedPointForm from '../Containers/EditLinkedPointForm';
import { EditLinkedPointFormFrom } from '../Containers/EditLinkedPointForm/types';
import EditLogBook from '../Containers/EditLogBook';
import EditPointForm from '../Containers/EditPointForm';
import EditPointLinkedChannels from '../Containers/EditPointLinkedChannels';
import EditReferenceByReportForm from '../Containers/EditReferenceByReportForm';
import EditReportItem from '../Containers/EditReportItem';
import EditVisualizationGroupForm from '../Containers/EditVisualizationGroupForm';
import ChartSection from '../Containers/EmergencyEventsGroupChart';
import FormCreation from '../Containers/FormCreation';
import FormRelations from '../Containers/FormRelations';
import GroupInformation from '../Containers/GroupInformation';
import GroupFormulaModal from '../Containers/GroupInformation/GroupFormulaModal';
import HeatingSeasonAddUpdateModalBody from '../Containers/HeatingSeasons/HeatingSeasonAddUpdateModalBody';
import HeatingSeasonDeleteModalBody from '../Containers/HeatingSeasons/HeatingSeasonDeleteModalBody';
import { HeatingSeasonMode } from '../Containers/HeatingSeasons/types';
import ImagesCollection from '../Containers/ImagesCollection';
import ModalAcknowledgeEmergencyEvents from '../Containers/ModalAcknowledgeEmergencyEvents';
import ModalAssignedEmergencyEvents from '../Containers/ModalAssignedEmergencyEvents';
import ModalChangeChannelNSI from '../Containers/ModalChangeChannelNSI';
import ModalChangeNodeNSI from '../Containers/ModalChangeNodeNSI';
import ModalCreateEditNodeNSI from '../Containers/ModalCreateEditNodeNSI';
import ModalDeleteNodeNSI from '../Containers/ModalDeleteNodeNSI';
import ModalLinkMeasuringInstrumentsNSI from '../Containers/ModalLinkMeasuringInstrumentsNSI';
import ModalMeasuringInstrumentsExtendedFilters from '../Containers/ModalMeasuringInstrumentsExtendedFilters';
import ModalNSITreeExtendedFilters from '../Containers/ModalNSITreeExtendedFilters';
import ModalUnlinkEquipmentPieceNSI from '../Containers/ModalUnlinkEquipmentPieceNSI';
import NewImageWarning from '../Containers/NewImageWarning';
import NSIGroupChangeValues from '../Containers/NSIGroupChangeValues';
import NSIUserParametersConfiguration from '../Containers/NSIUserParametersConfiguration';
import LinkedParameter from '../Containers/ParameterByValueTable/LinkedParameter';
import LinkedPoint from '../Containers/ParameterByValueTable/LinkedPoint';
import VisualizationGroups from '../Containers/ParameterByValueTable/VisualizationGroups';
import ParameterCreation from '../Containers/ParameterCreation';
import PeriodsList from '../Containers/PeriodsList';
import PointChannelsTreeModal from '../Containers/PointChannelsTreeModal';
import ChannelsTreeForEditingFormModal from '../Containers/PointChannelsTreeModal/ChannelsTreeForEditingFormModal';
import { PrintFormEditor } from '../Containers/PrintFormEditor';
import PrintFormParameterEdit from '../Containers/PrintForms/PrintFormParameterEdit';
import PrintFormParametersSync from '../Containers/PrintForms/PrintFormParametersSync';
import PrintFormParametersUnsync from '../Containers/PrintForms/PrintFormParametersUnsync';
import { PrintFormPositionSync } from '../Containers/PrintForms/PrintFormPositionSync';
import { PrintFormPositionUnsync } from '../Containers/PrintForms/PrintFormPositionUnsync';
import { PrintFormReportPreview } from '../Containers/PrintForms/PrintFormReportPreview';
import PrintFormsPriorityMethodSource from '../Containers/PrintForms/PrintFormsPriorityMethodSource/PrintFormsPriorityMethodSource';
import { PublishForm } from '../Containers/PublishForm';
import CreateReport from '../Containers/ReportTable/CreateReport';
import HardwareGroup from '../Containers/TableHardwareGroup';
import TransparentEmergencyEventsParameterSelect from '../Containers/TransparentEmergencyEventsParameterSelect';
import TransparentEmergencyEventsTable from '../Containers/TransparentEmergencyEventsTable/TransparentEmergencyEventsTable';
import { resetDynamicChart } from '../Models/DynamicChart/events';
import { updateObjectParameter } from '../Models/EditMode/events';
import { setSystemLayerEditData } from '../Models/FormLayers/events';
import { closeModal } from '../Models/Modal/events';
import { resetParameterCreationData } from '../Models/NewEmergencyEventParameter/events';
import { ModalInfo } from '../UI/Modals/types';

import { Action, PriorityMethodSource, SelectGroupMode } from './types';

export enum RegisteredModals {
	TransitionTree = 'TransitionTree',
	SelectGroup = 'SelectGroup',
	CreateNewForm = 'CreateNewForm',
	CreateNewFormFromTransparent = 'CreateNewFormFromTransparent',
	CreateNewFormFromDynamicObject = 'CreateNewFormFromDynamicObject',
	NewImageWarning = 'NewImageWarning',
	DynamicChart = 'DynamicChart',
	ConfirmFormDeletion = 'ConfirmDeletion',
	HistogramChart = 'HistogramChart',
	DynamicObjectImages = 'DynamicObjectImages',
	ImagesCollection = 'ImagesCollection',
	CompareWithPeriods = 'CompareWithPeriods',
	PeriodsList = 'PeriodsList',
	DeviceHealthiness = 'DeviceHealthiness',
	EditHeatingSeason = 'EditHeatingSeason',
	AddHeatingSeason = 'AddHeatingSeason',
	DeleteHeatingSeason = 'DeleteHeatingSeason',
	EditPoint = 'EditPoint',
	DeletePoint = 'DeletePoint',
	CreateReport = 'CreateReport',
	EditLinkedPoint = 'EditLinkedPoint',
	EditLinkedPointFromAccountingNode = 'EditLinkedPointFromAccountingNode',
	EditLinkedPointFromReportItem = 'EditLinkedPointFromReportItem',
	EditPointLinkedChannels = 'EditPointLinkedChannels',
	PointChannelsTreeModal = 'PointChannelsTreeModal',
	DevicesGroupsArchive = 'DevicesGroupsArchive',
	GroupInformation = 'GroupInformation',
	GroupFormulaModal = 'GroupFormulaModal',
	LinkedPointModal = 'LinkedPointModal',
	AccountingNodeModal = 'AccountingNodeModal',
	LinkedParameter = 'LinkedParameter',
	DeleteParameter = 'DeleteParameter',
	DeleteVisualizationGroup = 'DeleteVisualizationGroup',
	PublishForm = 'PublishForm',
	VisualizationGroups = 'VisualizationGroups',
	EditReport = 'EditReport',
	DeleteReport = 'DeleteReport',
	CreateReportItem = 'CreateReportItem',
	EditReportItem = 'EditReportItem',
	DeleteReportItem = 'DeleteReportItem',
	ChannelsTreeForEditingFormModal = 'ChannelsTreeForEditingFormModal',
	CreateReportForm = 'CreateReportForm',
	UpdateReportForm = 'UpdateReportForm',
	PickPriorityMethodByArchive = 'PickPriorityMethodByArchive',
	PickPriorityMethodByChannel = 'PickPriorityMethodByChannel',
	EditVisualizationGroupForm = 'EditVisualizationGroupForm',
	PrintFormReportPreview = 'PrintFormReportPreview',
	PrintFormPositionUnsync = 'PrintFormPositionUnsync',
	EditParameter = 'EditParameter',
	ControlParameterSelectGroup = 'ControlParameterSelectGroup',
	DeleteEmergencyEventParameter = 'DeleteEmergencyEventParameter',
	PrintFormPositionSync = 'PrintFormPositionSync',
	NSIGroupChangeValues = 'NSIGroupChangeValues',
	PrintFormParameterSync = 'PrintFormParameterSync',
	PrintFormParameterUnsync = 'PrintFormParameterUnsync',
	EditInputFormBlocking = 'EditInputFormBlocking',
	EditInputFormResume = 'EditInputFormResume',
	EditPrintFormParameter = 'EditPrintFormParameter',
	EditInputForm = 'EditInputForm',
	EditLogBook = 'EditLogBook',
	EmergencyEventsTree = 'EmergencyEventsTree',
	TransparentEmergencyEventsTable = 'TransparentEmergencyEventsTable',
	EmergencyEventsGroupChart = 'EmergencyEventsGroupChart',
	AssignedEmergencyEvents = 'AssignedEmergencyEvents',
	NSIUserParametersConfiguration = 'NSIUserParametersConfiguration',
	AcknowledgeAssignedEmergencyEvents = 'AcknowledgeAssignedEmergencyEvents',
	CreateNodeNSI = 'CreateNodeNSI',
	EditNodeNSI = 'EditNodeNSI',
	DeleteNodeNSI = 'DeleteNodeNSI',
	ChangeNodeNSI = 'ChangeNodeNSI',
	LinkEquipmentToChannelNSI = 'LinkEquipmentToChannelNSI',
	UnlinkEquipmentNSI = 'UnlinkEquipmentNSI',
	LinkMeasuringInstrumentsNSI = 'LinkMeasuringInstrumentsNSI',
	MeasuringInstrumentsExtendedFilters = 'MeasuringInstrumentsExtendedFilters',
	TreeNSIExtendedFilters = 'TreeNSIExtendedFilters',
	CreateSystemLayer = 'CreateSystemLayer',
	ConfirmSystemLayerDeletion = 'ConfirmSystemLayerDeletion',
	ConfirmSystemLayerEdit = 'ConfirmSystemLayerEdit',
	DeletePrintForm = 'DeletePrintForm',
	DynamicChartSelectGroup = 'DynamicChartSelectGroup',
	EditBaseHour = 'EditBaseHour',
}

export const modalsList: Record<string, ModalInfo> = {
	[RegisteredModals.TransitionTree]: {
		title: 'Выбор формы перехода',
		hasCloseButton: true,
		body: (
			<FormRelations
				onConfirm={(
					treeItemId,
					displayName,
					parameterCode,
					versionCode,
					objectId,
				) => {
					updateObjectParameter({
						objectId,
						value: displayName,
						parameterCode,
						parameterName: 'goton',
						versionCode,
						pairedParameterName: 'gotonCode',
						pairedParameterValue: treeItemId,
					});
					closeModal(RegisteredModals.TransitionTree);
				}}
			/>
		),
		onCloseFn: () => {
			closeModal(RegisteredModals.TransitionTree);
		},
		width: 400,
		height: 440,
	},
	[RegisteredModals.EmergencyEventsTree]: {
		title: 'Параметры аварийных событий',
		hasCloseButton: true,
		body: (
			<TransparentEmergencyEventsParameterSelect
				onConfirm={(
					treeItemId,
					displayName,
					parameterCode,
					versionCode,
					objectId,
				) => {
					updateObjectParameter({
						objectId,
						value: displayName,
						parameterCode,
						parameterName: 'metricName',
						versionCode,
						pairedParameterName: 'metricId',
						pairedParameterValue: treeItemId,
					});
					closeModal(RegisteredModals.EmergencyEventsTree);
				}}
			/>
		),
		onCloseFn: () => {
			closeModal(RegisteredModals.EmergencyEventsTree);
		},
		width: 400,
		height: 440,
	},
	[RegisteredModals.SelectGroup]: {
		title: 'Выбор группы данных',
		hasCloseButton: true,
		body: <HardwareGroup mode={SelectGroupMode.Monitoring} />,
		onCloseFn: () => {
			closeModal(RegisteredModals.SelectGroup);
		},
		width: 1040,
		height: 440,
	},
	[RegisteredModals.DynamicChartSelectGroup]: {
		title: 'Выбор группы данных',
		hasCloseButton: true,
		body: <HardwareGroup mode={SelectGroupMode.DynamicChart} />,
		onCloseFn: () => {
			closeModal(RegisteredModals.DynamicChartSelectGroup);
		},
		width: 1040,
		height: 440,
	},

	[RegisteredModals.ControlParameterSelectGroup]: {
		title: 'Выбор группы данных',
		hasCloseButton: true,
		body: <HardwareGroup mode={SelectGroupMode.EmergencyEvents} />,
		onCloseFn: () => {
			closeModal(RegisteredModals.ControlParameterSelectGroup);
		},
		width: 1040,
		height: 440,
	},
	[RegisteredModals.CreateNewForm]: {
		title: 'Создать новую форму',
		hasCloseButton: true,
		width: 506,
		height: 528,
		onCloseFn: () => closeModal(RegisteredModals.CreateNewForm),
		body: <FormCreation from={'tree'} />,
	},
	[RegisteredModals.CreateNewFormFromTransparent]: {
		title: 'Создать новую форму',
		hasCloseButton: true,
		width: 506,
		height: 528,
		onCloseFn: () => closeModal(RegisteredModals.CreateNewFormFromTransparent),
		body: <FormCreation from={'transparent'} />,
	},
	[RegisteredModals.CreateNewFormFromDynamicObject]: {
		title: 'Создать новую форму',
		hasCloseButton: true,
		width: 506,
		height: 528,
		onCloseFn: () =>
			closeModal(RegisteredModals.CreateNewFormFromDynamicObject),
		body: <FormCreation from={'dynamicObject'} />,
	},
	[RegisteredModals.NewImageWarning]: {
		title: 'Файл с таким названием уже существует',
		hasCloseButton: true,
		width: 1040,
		onCloseFn: () => closeModal(RegisteredModals.NewImageWarning),
		body: <NewImageWarning />,
	},
	[RegisteredModals.DynamicChart]: {
		title: 'Динамический мультиграфик',
		hasCloseButton: true,
		width: 1540,
		height: 790,
		onCloseFn: () => {
			resetDynamicChart();
			closeModal(RegisteredModals.DynamicChart);
		},
		body: <DynamicChartSection />,
	},
	[RegisteredModals.ConfirmFormDeletion]: {
		title: '',
		hasCloseButton: true,
		width: 320,
		onCloseFn: () => closeModal(RegisteredModals.ConfirmFormDeletion),
		body: <ConfirmFormDeletion />,
	},
	[RegisteredModals.ConfirmSystemLayerDeletion]: {
		title: '',
		hasCloseButton: true,
		width: 420,
		onCloseFn: () => closeModal(RegisteredModals.ConfirmSystemLayerDeletion),
		body: <ConfirmSystemLayerDeletion />,
	},
	[RegisteredModals.ConfirmSystemLayerEdit]: {
		title: '',
		hasCloseButton: true,
		width: 420,
		onCloseFn: () => {
			setSystemLayerEditData(null);
			closeModal(RegisteredModals.ConfirmSystemLayerEdit);
		},
		body: <ConfirmSystemLayerEdit />,
	},
	[RegisteredModals.HistogramChart]: {
		title: 'Гистограмма',
		hasCloseButton: true,
		width: 1540,
		height: 790,
		onCloseFn: () => closeModal(RegisteredModals.HistogramChart),
		body: <ColumnChartSection />,
	},
	[RegisteredModals.DynamicObjectImages]: {
		title: 'Изображения динамического объекта',
		hasCloseButton: true,
		width: 640,
		height: 610,
		onCloseFn: () => closeModal(RegisteredModals.DynamicObjectImages),
		body: <DynamicObjectImages />,
	},
	[RegisteredModals.ImagesCollection]: {
		title: 'Добавить изображение',
		hasCloseButton: true,
		width: 640,
		height: 610,
		onCloseFn: () => closeModal(RegisteredModals.ImagesCollection),
		body: <ImagesCollection />,
	},
	[RegisteredModals.CompareWithPeriods]: {
		title: 'Сравнение серий',
		hasCloseButton: true,
		width: 1540,
		height: 790,
		onCloseFn: () => closeModal(RegisteredModals.CompareWithPeriods),
		body: <ChartComparison />,
	},
	[RegisteredModals.PeriodsList]: {
		title: 'Серии к сравнению',
		hasCloseButton: true,
		width: 540,
		height: 600,
		onCloseFn: () => closeModal(RegisteredModals.PeriodsList),
		body: <PeriodsList />,
	},
	[RegisteredModals.DeviceHealthiness]: {
		title: 'Информация о работоспособности приборов в группе',
		hasCloseButton: true,
		width: 1880,
		height: 730,
		onCloseFn: () => closeModal(RegisteredModals.DeviceHealthiness),
		body: <DeviceHealthiness />,
	},
	[RegisteredModals.EditHeatingSeason]: {
		title: 'Отопительный сезон',
		hasCloseButton: true,
		width: 260,
		height: 265,
		onCloseFn: () => closeModal(RegisteredModals.EditHeatingSeason),
		body: (
			<HeatingSeasonAddUpdateModalBody modalMode={HeatingSeasonMode.Edit} />
		),
		isOverflowVisible: true,
	},
	[RegisteredModals.AddHeatingSeason]: {
		title: 'Новый отопительный сезон',
		hasCloseButton: true,
		width: 300,
		height: 274,
		onCloseFn: () => closeModal(RegisteredModals.AddHeatingSeason),
		body: <HeatingSeasonAddUpdateModalBody modalMode={HeatingSeasonMode.Add} />,
		isOverflowVisible: true,
	},
	[RegisteredModals.DeleteHeatingSeason]: {
		title: 'Удаление отопительного сезона',
		hasCloseButton: true,
		width: 340,
		height: 239,
		onCloseFn: () => closeModal(RegisteredModals.DeleteHeatingSeason),
		body: <HeatingSeasonDeleteModalBody />,
	},
	[RegisteredModals.EditPoint]: {
		title: 'Базовая точка учета',
		hasCloseButton: false,
		width: 1800,
		onCloseFn: () => closeModal(RegisteredModals.EditPoint),
		body: <EditPointForm />,
	},
	[RegisteredModals.EditVisualizationGroupForm]: {
		title: 'Группа визуализации',
		hasCloseButton: false,
		width: 1000,
		onCloseFn: () => closeModal(RegisteredModals.EditVisualizationGroupForm),
		body: <EditVisualizationGroupForm />,
	},
	[RegisteredModals.DeletePoint]: {
		title: '',
		hasCloseButton: true,
		width: 380,
		onCloseFn: () => closeModal(RegisteredModals.DeletePoint),
		body: <DeletePoint />,
	},
	[RegisteredModals.DeleteParameter]: {
		hasCloseButton: true,
		width: 380,
		onCloseFn: () => closeModal(RegisteredModals.DeleteParameter),
		body: <DeleteParameter />,
	},
	[RegisteredModals.DeleteVisualizationGroup]: {
		hasCloseButton: true,
		width: 380,
		onCloseFn: () => closeModal(RegisteredModals.DeleteVisualizationGroup),
		body: <DeleteVisualizationGroup />,
	},
	[RegisteredModals.EditLinkedPoint]: {
		title: 'Связанная точка учета',
		hasCloseButton: false,
		width: 1800,
		height: 890,
		onCloseFn: () => closeModal(RegisteredModals.EditLinkedPoint),
		body: <EditLinkedPointForm from={EditLinkedPointFormFrom.Points} />,
	},
	[RegisteredModals.EditLinkedPointFromAccountingNode]: {
		title: 'Связанная точка учета',
		hasCloseButton: false,
		width: 1800,
		height: 890,
		onCloseFn: () =>
			closeModal(RegisteredModals.EditLinkedPointFromAccountingNode),
		body: <EditLinkedPointForm from={EditLinkedPointFormFrom.AccountingNode} />,
	},
	[RegisteredModals.EditPointLinkedChannels]: {
		title: 'Подключенный прибор и канал',
		hasCloseButton: true,
		width: 1800,
		height: 890,
		onCloseFn: () => closeModal(RegisteredModals.EditPointLinkedChannels),
		body: <EditPointLinkedChannels />,
	},
	[RegisteredModals.PointChannelsTreeModal]: {
		title: 'Приборы и каналы',
		hasCloseButton: false,
		width: 950,
		height: 890,
		onCloseFn: () => closeModal(RegisteredModals.PointChannelsTreeModal),
		body: <PointChannelsTreeModal />,
		isOverflowVisible: true,
	},
	[RegisteredModals.ChannelsTreeForEditingFormModal]: {
		title: 'Выбрать канал',
		hasCloseButton: false,
		width: 950,
		height: 890,
		onCloseFn: () =>
			closeModal(RegisteredModals.ChannelsTreeForEditingFormModal),
		body: <ChannelsTreeForEditingFormModal />,
		isOverflowVisible: true,
	},
	[RegisteredModals.CreateReport]: {
		title: 'Сформировать отчет',
		hasCloseButton: true,
		width: 260,
		onCloseFn: () => closeModal(RegisteredModals.CreateReport),
		body: <CreateReport />,
		isOverflowVisible: true,
	},
	[RegisteredModals.LinkedPointModal]: {
		title: 'Связанная точка учета',
		hasCloseButton: true,
		width: 800,
		onCloseFn: () => closeModal(RegisteredModals.LinkedPointModal),
		body: <LinkedPoint />,
		isOverflowVisible: true,
	},
	[RegisteredModals.DevicesGroupsArchive]: {
		title: 'Архив приборов',
		hasCloseButton: true,
		width: 800,
		onCloseFn: () => closeModal(RegisteredModals.DevicesGroupsArchive),
		body: <DevicesGroupsArchive />,
		isOverflowVisible: true,
	},
	[RegisteredModals.GroupInformation]: {
		title: 'Информация по группе',
		hasCloseButton: true,
		width: 1200,
		height: 517,
		onCloseFn: () => closeModal(RegisteredModals.GroupInformation),
		body: <GroupInformation />,
	},
	[RegisteredModals.GroupFormulaModal]: {
		title: 'Формула',
		hasCloseButton: true,
		width: 800,
		/* 		height: 517, */
		onCloseFn: () => closeModal(RegisteredModals.GroupFormulaModal),
		body: <GroupFormulaModal />,
		isOverflowVisible: true,
	},
	[RegisteredModals.AccountingNodeModal]: {
		title: 'Узел учета',
		hasCloseButton: false,
		width: 1900,
		onCloseFn: () => closeModal(RegisteredModals.AccountingNodeModal),
		body: <AccountingNode />,
		isOverflowVisible: true,
	},
	[RegisteredModals.LinkedParameter]: {
		title: 'Связанный параметр',
		hasCloseButton: false,
		onCloseFn: () => closeModal(RegisteredModals.LinkedParameter),
		body: <LinkedParameter />,
		isOverflowVisible: false,
	},
	[RegisteredModals.PublishForm]: {
		title: '',
		hasCloseButton: true,
		width: 380,
		height: 270,
		body: <PublishForm />,
		onCloseFn: () => closeModal(RegisteredModals.PublishForm),
	},
	[RegisteredModals.VisualizationGroups]: {
		title: 'Группы визуализации',
		hasCloseButton: true,
		onCloseFn: () => closeModal(RegisteredModals.VisualizationGroups),
		body: <VisualizationGroups />,
		isOverflowVisible: true,
	},
	[RegisteredModals.EditReport]: {
		title: 'Отчетная форма',
		hasCloseButton: false,
		width: 560,
		onCloseFn: () => closeModal(RegisteredModals.EditReport),
		body: <EditReferenceByReportForm />,
	},
	[RegisteredModals.DeleteReport]: {
		title: '',
		hasCloseButton: true,
		width: 380,
		onCloseFn: () => closeModal(RegisteredModals.DeleteReport),
		body: <DeleteReport />,
	},
	[RegisteredModals.CreateReportItem]: {
		title: 'Отчетная позиция',
		hasCloseButton: false,
		width: 560,
		onCloseFn: () => closeModal(RegisteredModals.CreateReportItem),
		body: <CreateReportItem />,
	},
	[RegisteredModals.CreateReportForm]: {
		title: 'Печатная форма отчета',
		hasCloseButton: false,
		width: 560,
		body: <PrintFormEditor action={Action.Create} />,
		onCloseFn: () => closeModal(RegisteredModals.CreateReportForm),
	},
	[RegisteredModals.EditReportItem]: {
		title: 'Отчетная позиция',
		hasCloseButton: false,
		width: 1880,
		body: <EditReportItem />,
		onCloseFn: () => closeModal(RegisteredModals.EditReportItem),
	},
	[RegisteredModals.EditLinkedPointFromReportItem]: {
		title: 'Связанная точка учета',
		hasCloseButton: false,
		width: 1800,
		height: 890,
		onCloseFn: () => closeModal(RegisteredModals.EditLinkedPointFromReportItem),
		body: <EditLinkedPointForm from={EditLinkedPointFormFrom.ReportItem} />,
	},
	[RegisteredModals.DeleteReportItem]: {
		title: '',
		hasCloseButton: true,
		width: 380,
		onCloseFn: () => closeModal(RegisteredModals.DeleteReportItem),
		body: <DeleteReportItem />,
	},
	[RegisteredModals.UpdateReportForm]: {
		title: 'Печатная форма отчета',
		hasCloseButton: false,
		width: 560,
		body: <PrintFormEditor action={Action.Update} />,
		onCloseFn: () => closeModal(RegisteredModals.UpdateReportForm),
	},
	[RegisteredModals.PickPriorityMethodByArchive]: {
		title: 'Приборы типа "УРСВ 510"',
		hasCloseButton: false,
		width: 950,
		body: (
			<PrintFormsPriorityMethodSource from={PriorityMethodSource.Archive} />
		),
		onCloseFn: () => closeModal(RegisteredModals.PickPriorityMethodByArchive),
	},
	[RegisteredModals.PickPriorityMethodByChannel]: {
		title: 'Приборы и каналы',
		hasCloseButton: false,
		width: 950,
		body: (
			<PrintFormsPriorityMethodSource from={PriorityMethodSource.Channel} />
		),
		onCloseFn: () => closeModal(RegisteredModals.PickPriorityMethodByChannel),
	},
	[RegisteredModals.PrintFormReportPreview]: {
		title: 'Превью отчета',
		hasCloseButton: true,
		width: 950,
		height: 950,
		body: <PrintFormReportPreview />,
		onCloseFn: () => closeModal(RegisteredModals.PrintFormReportPreview),
	},
	[RegisteredModals.PrintFormPositionUnsync]: {
		title: '',
		hasCloseButton: true,
		width: 380,
		onCloseFn: () => closeModal(RegisteredModals.PrintFormPositionUnsync),
		body: <PrintFormPositionUnsync />,
	},
	[RegisteredModals.EditParameter]: {
		title: 'Узел дерева',
		hasCloseButton: true,
		width: 506,
		height: 670,
		onCloseFn: () => {
			closeModal(RegisteredModals.EditParameter);
			resetParameterCreationData();
		},
		body: <ParameterCreation />,
	},
	[RegisteredModals.DeleteEmergencyEventParameter]: {
		title: '',
		hasCloseButton: true,
		width: 380,
		onCloseFn: () => closeModal(RegisteredModals.DeleteEmergencyEventParameter),
		body: <DeleteEmergencyEventParameter />,
	},
	[RegisteredModals.PrintFormPositionSync]: {
		title: '',
		hasCloseButton: true,
		width: 380,
		onCloseFn: () => closeModal(RegisteredModals.PrintFormPositionSync),
		body: <PrintFormPositionSync />,
	},
	[RegisteredModals.NSIGroupChangeValues]: {
		title: 'Замена значения',
		body: <NSIGroupChangeValues />,
		hasCloseButton: false,
		width: 400,
		isOverflowVisible: true,
		onCloseFn: () => closeModal(RegisteredModals.NSIGroupChangeValues),
	},
	[RegisteredModals.PrintFormParameterSync]: {
		title: 'Параметр отчетной формы',
		body: <PrintFormParametersSync />,
		hasCloseButton: false,
		width: 500,
		isOverflowVisible: true,
		onCloseFn: () => closeModal(RegisteredModals.PrintFormParameterSync),
	},
	[RegisteredModals.PrintFormParameterUnsync]: {
		title: ' ',
		body: <PrintFormParametersUnsync />,
		hasCloseButton: false,
		width: 380,
		isOverflowVisible: true,
		onCloseFn: () => closeModal(RegisteredModals.PrintFormParameterUnsync),
	},
	[RegisteredModals.EditInputFormBlocking]: {
		title: '',
		body: <EditInputFormBlocking />,
		hasCloseButton: true,
		width: 380,
		isOverflowVisible: true,
		onCloseFn: () => closeModal(RegisteredModals.EditInputFormBlocking),
	},
	[RegisteredModals.EditInputFormResume]: {
		title: '',
		body: <EditInputFormResume />,
		hasCloseButton: true,
		width: 380,
		isOverflowVisible: true,
		onCloseFn: () => closeModal(RegisteredModals.EditInputFormResume),
	},
	[RegisteredModals.EditPrintFormParameter]: {
		title: 'Значения параметра отчетной формы',
		body: <PrintFormParameterEdit />,
		hasCloseButton: false,
		width: 700,
		isOverflowVisible: true,
		onCloseFn: () => closeModal(RegisteredModals.EditPrintFormParameter),
	},
	[RegisteredModals.EditInputForm]: {
		title: 'Редактирование формы ввода',
		body: <EditInputForm />,
		hasCloseButton: false,
		isOverflowVisible: true,
		height: 1000,
		onCloseFn: () => closeModal(RegisteredModals.EditInputForm),
	},
	[RegisteredModals.TransparentEmergencyEventsTable]: {
		title: 'Аварийные события',
		body: <TransparentEmergencyEventsTable />,
		width: 1700,
		height: 900,
		hasCloseButton: true,
		onCloseFn: () =>
			closeModal(RegisteredModals.TransparentEmergencyEventsTable),
	},
	[RegisteredModals.EmergencyEventsGroupChart]: {
		title: 'График',
		body: <ChartSection />,
		width: 1700,
		height: 1000,
		hasCloseButton: true,
		hasTitle: false,
		onCloseFn: () => closeModal(RegisteredModals.EmergencyEventsGroupChart),
	},
	[RegisteredModals.AssignedEmergencyEvents]: {
		title: 'Назначенные аварийные события',
		body: <ModalAssignedEmergencyEvents />,
		hasCloseButton: true,
		onCloseFn: () => closeModal(RegisteredModals.AssignedEmergencyEvents),
	},
	[RegisteredModals.EditLogBook]: {
		body: <EditLogBook />,
		hasTitle: false,
		isOverflowVisible: true,
		onCloseFn: () => closeModal(RegisteredModals.EditLogBook),
	},

	[RegisteredModals.NSIUserParametersConfiguration]: {
		title: 'Конфигуратор параметров',
		body: <NSIUserParametersConfiguration />,
		hasCloseButton: false,
		width: 740,
		isOverflowVisible: true,
		onCloseFn: () =>
			closeModal(RegisteredModals.NSIUserParametersConfiguration),
	},
	[RegisteredModals.AcknowledgeAssignedEmergencyEvents]: {
		title: 'Квитировать аварийные события',
		body: <ModalAcknowledgeEmergencyEvents />,
		hasCloseButton: true,
		onCloseFn: () =>
			closeModal(RegisteredModals.AcknowledgeAssignedEmergencyEvents),
	},
	[RegisteredModals.CreateNodeNSI]: {
		title: 'Узел учета',
		body: <ModalCreateEditNodeNSI />,
		hasCloseButton: false,
		width: 400,
		onCloseFn: () => closeModal(RegisteredModals.CreateNodeNSI),
	},
	[RegisteredModals.EditNodeNSI]: {
		title: 'Узел учета',
		body: <ModalCreateEditNodeNSI isEditMode />,
		hasCloseButton: false,
		width: 400,
		onCloseFn: () => closeModal(RegisteredModals.EditNodeNSI),
	},
	[RegisteredModals.DeleteNodeNSI]: {
		title: '',
		body: <ModalDeleteNodeNSI />,
		hasCloseButton: true,
		onCloseFn: () => closeModal(RegisteredModals.DeleteNodeNSI),
	},
	[RegisteredModals.ChangeNodeNSI]: {
		title: 'Смена узла учета',
		body: <ModalChangeNodeNSI />,
		hasCloseButton: true,
		width: 460,
		isOverflowVisible: true,
		onCloseFn: () => closeModal(RegisteredModals.ChangeNodeNSI),
	},
	[RegisteredModals.LinkEquipmentToChannelNSI]: {
		title: 'Привязка к каналу',
		body: <ModalChangeChannelNSI />,
		hasCloseButton: true,
		width: 460,
		isOverflowVisible: true,
		onCloseFn: () => closeModal(RegisteredModals.LinkEquipmentToChannelNSI),
	},
	[RegisteredModals.UnlinkEquipmentNSI]: {
		title: '',
		body: <ModalUnlinkEquipmentPieceNSI />,
		hasCloseButton: true,
		isOverflowVisible: true,
		width: 400,
		onCloseFn: () => closeModal(RegisteredModals.UnlinkEquipmentNSI),
	},
	[RegisteredModals.LinkMeasuringInstrumentsNSI]: {
		title: 'Привязать оборудование к дереву',
		body: <ModalLinkMeasuringInstrumentsNSI />,
		hasCloseButton: true,
		isOverflowVisible: true,
		width: 1200,
		onCloseFn: () => closeModal(RegisteredModals.LinkMeasuringInstrumentsNSI),
	},
	[RegisteredModals.MeasuringInstrumentsExtendedFilters]: {
		title: 'Фильтр',
		body: <ModalMeasuringInstrumentsExtendedFilters />,
		hasCloseButton: true,
		isOverflowVisible: true,
		width: 600,
		onCloseFn: () =>
			closeModal(RegisteredModals.MeasuringInstrumentsExtendedFilters),
	},
	[RegisteredModals.TreeNSIExtendedFilters]: {
		title: 'Фильтр',
		body: <ModalNSITreeExtendedFilters />,
		hasCloseButton: true,
		isOverflowVisible: true,
		width: 600,
		onCloseFn: () => closeModal(RegisteredModals.TreeNSIExtendedFilters),
	},
	[RegisteredModals.CreateSystemLayer]: {
		title: 'Слой',
		body: <CreateSystemLayer />,
		hasCloseButton: true,
		width: 600,
		onCloseFn: () => {
			setSystemLayerEditData(null);
			closeModal(RegisteredModals.CreateSystemLayer);
		},
	},
	[RegisteredModals.DeletePrintForm]: {
		title: '',
		hasCloseButton: true,
		width: 380,
		onCloseFn: () => closeModal(RegisteredModals.DeletePrintForm),
		body: <DeletePrintForm />,
	},
	[RegisteredModals.EditBaseHour]: {
		title: 'Базовый час учета',
		hasCloseButton: true,
		width: 280,
		onCloseFn: () => closeModal(RegisteredModals.EditBaseHour),
		body: <EditBaseHour />,
	},
};
