import {
	AvailableFiltersByObjectTypes,
	AvailableFiltersNSIResponseItem,
	NSIParameterType,
} from '../Shared/types';
import { TreeItem } from '../UI/Tree/types';

const booleanValues: TreeItem[] = [
	{
		id: 1,
		name: 'Да',
		displayName: 'Да',
		type: 'value',
		parentType: 'parameter',
	},
	{
		id: 0,
		name: 'Нет',
		displayName: 'Нет',
		type: 'value',
		parentType: 'parameter',
	},
];

const objectTypesMap = new Map<number, string>([
	[1, 'equipment_piece'],
	[2, 'device'],
	[3, 'nsi_channel'],
	[4, 'node'],
	[5, 'channel_group'],
]);

function getAvailableFiltersNSIAdapter(
	response: string,
): AvailableFiltersByObjectTypes {
	const parsedResponse: AvailableFiltersNSIResponseItem[] =
		JSON.parse(response).Response.Tables[0].Rows;

	const objectTypes = new Map<string, TreeItem[]>(
		parsedResponse.map(({ ТипОбъектаНСИ }) => [
			objectTypesMap.get(ТипОбъектаНСИ) || '',
			[],
		]),
	);

	const parameters = new Map<
		number,
		{
			objectType: string;
			type: number;
			name: string;
			values: TreeItem[];
		}
	>();

	for (let value of parsedResponse) {
		const {
			Значение: valueName,
			Код: id,
			КодЗначения: valueId,
			НазваниеПараметра: name,
			ТипОбъектаНСИ: objectType,
			ТипПараметра: type,
		} = value;
		const parameter = parameters.get(id);

		const newValues =
			type === NSIParameterType.Boolean
				? booleanValues.map((booleanValue) => ({
						...booleanValue,
						parentId: id,
				  }))
				: [
						{
							id: valueId,
							name: valueName || '',
							displayName: valueName || '',
							type: 'value',
							parentType: 'parameter',
							parentId: id,
						},
				  ];
		const oldValues = parameter ? [...parameter.values] : [];

		parameters.set(id, {
			name,
			objectType: objectTypesMap.get(objectType) || '',
			type,
			values: [...oldValues, ...newValues],
		});
	}

	for (let [id, parameter] of parameters) {
		const { objectType } = parameter;
		const objectTypeItem: TreeItem[] | undefined = objectTypes.get(objectType);

		if (objectTypeItem) {
			const item: TreeItem = {
				id,
				name: parameter.name,
				displayName: parameter.name,
				type: 'parameter',
				parentId: 0,
				parentType: 'parameters',
			};
			objectTypes.set(objectType, [
				...objectTypeItem,
				item,
				...parameter.values,
			]);
		}
	}

	const filters: AvailableFiltersByObjectTypes =
		Object.fromEntries(objectTypes);

	return filters;
}

export default getAvailableFiltersNSIAdapter;
