import {
	ButtonContainer,
	ControlParameterGroupButtonContainer,
	DynamicChartGroupButtonContainer,
	RenderHardwareGroupColumnFilterButton,
	RenderHardwareGroupColumnFilterChannel,
	RenderHardwareGroupColumnFilterEd,
	RenderHardwareGroupColumnFilterEWork,
	RenderHardwareGroupColumnFilterMethod,
	RenderHardwareGroupColumnFilterName,
	RenderHardwareGroupColumnFilterNumber,
} from '../Containers/TableHardwareGroup/tableRenderCells';
import { GroupListItem } from '../Models/HardwareGroup/types';
import { SelectGroupMode } from '../Shared/types';

export default function devicesHardwareGroup(
	devices: GroupListItem[],
	mode: SelectGroupMode,
) {
	return [
		[
			[
				{
					name: 'number',
					value: '№',
					renderCell: RenderHardwareGroupColumnFilterNumber,
				},
				{
					name: '№ eWork',
					value: 'eWork',
					renderCell: RenderHardwareGroupColumnFilterEWork,
				},
				{
					name: 'name',
					value: 'Наименование',
					renderCell: RenderHardwareGroupColumnFilterName,
				},
				{
					name: 'Ед. изм.',
					value: 'Ед. изм.',
					renderCell: RenderHardwareGroupColumnFilterEd,
				},
				{
					name: 'метод',
					value: 'Метод',
					renderCell: RenderHardwareGroupColumnFilterMethod,
				},
				{
					name: 'количество каналов',
					value: 'количество каналов',
					renderCell: RenderHardwareGroupColumnFilterChannel,
				},
				{
					name: 'обновить',
					value: 'обновить',
					renderCell: RenderHardwareGroupColumnFilterButton,
				},
			],
			...devices.map((e: GroupListItem) => [
				{ name: 'number', value: e.number },
				{ name: '№ eWork', value: e.EWorkNumber },
				{ name: 'name', value: e.name },
				{ name: 'Ед. изм.', value: e.unitName },
				{ name: 'метод', value: e.method },
				{ name: 'количество каналов', value: e.channelsCount },
				{
					name: 'выбрать',
					value: '',
					renderCell: () => {
						switch (mode) {
							case SelectGroupMode.Monitoring:
								return ButtonContainer(e.number, e.name);
							case SelectGroupMode.EmergencyEvents:
								return ControlParameterGroupButtonContainer(
									e.number,
									e.name,
									e.unitId,
								);
							case SelectGroupMode.DynamicChart:
								return DynamicChartGroupButtonContainer(e.number, e.name);
							default:
								return ButtonContainer(e.number, e.name);
						}
					},
				},
			]),
		],
	];
}
