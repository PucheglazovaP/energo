import {
	InputFormPointCell,
	InputFormPointCellResponse,
	InputFormPointsDataset,
	InputFormPointsDatasetResponse,
} from '../../Models/InputFormPoints/types';
import { BackendResponse } from '../../Shared/types';

export function checkJson(
	value: string | null | undefined,
): InputFormPointCell | null {
	if (value) {
		try {
			JSON.parse(value);
		} catch (e) {
			return null;
		}

		const parsedValue = JSON.parse(value)[0] as InputFormPointCellResponse;
		return {
			value: parsedValue.val,
			isEditable: parsedValue.editable,
			isVisible: parsedValue.visible,
			needRefreshBase: parsedValue.needRefreshBase,
			needRefreshAll: parsedValue.needRefreshAll,
			pointId: parsedValue.fK_DailyPoints,
			isBlocked: parsedValue.blockEdit,
			fontColor: parsedValue.fontColor,
			backgroundColor: parsedValue.backgroundColor,
			borderColor: parsedValue.borderColor,
		};
	}

	return null;
}

export function inputFormPointsDataAdapter(
	response: string,
): InputFormPointsDataset {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as InputFormPointsDatasetResponse[];
	const dataset: InputFormPointsDataset[] = data.map((item) => {
		return {
			energyResourceId: item.FK_EnergyResources,
			externalT: checkJson(item.externalT),
			externalP: checkJson(item.externalP),
			skrub5DGCal: checkJson(item.skrub5DGCal),
			skrub6DGCal: checkJson(item.skrub6DGCal),
			skrub7DGCal: checkJson(item.skrub7DGCal),
			avgCal: checkJson(item.avgCal),
			tempCal: checkJson(item.tempCal),
			percFN: checkJson(item.percFN),
			order2KGCal: checkJson(item.order2KGCal),
			order3KGCal: checkJson(item.order3KGCal),
			order2volumeKGCal: checkJson(item.order2volumeKGCal),
			order3volumeKGCal: checkJson(item.order3volumeKGCal),
			volumeKG: checkJson(item.volumeKG),
			avgCalKG: checkJson(item.avgCalKG),
			partKG: checkJson(item.partKG),
			volumeDG: checkJson(item.volumeDG),
			avgCalDG: checkJson(item.avgCalDG),
			partDG: checkJson(item.partDG),
			volumePG: checkJson(item.volumePG),
			avgCalPG: checkJson(item.avgCalPG),
			partPG: checkJson(item.partPG),
			directionTK9: checkJson(item.directionTK9),
			directionTK10: checkJson(item.directionTK10),
			directionTK11: checkJson(item.directionTK11),
		};
	});

	return dataset[0];
}
