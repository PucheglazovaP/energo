import {
	InputFormDataset,
	InputFormDatasetResponse,
} from '../../Models/InputForm/types';
import { BackendResponse } from '../../Shared/types';

export function checkJson(value: string | null | undefined) {
	if (value) {
		try {
			JSON.parse(value);
		} catch (e) {
			return value;
		}

		return typeof value === 'number' ? value : JSON.parse(value)[0];
	}

	return value;
}

export function inputFormDataAdapter(response: string): InputFormDataset[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as InputFormDatasetResponse[];
	const dataset: InputFormDataset[] = data.map((item) => {
		return {
			id: item.id,
			level: item.level,
			dpgSortOrder: item.dpgSortOrder,
			pid: item.pid,
			aVGValue: checkJson(item.aVGValue),
			aVGValueText: checkJson(item.aVGValueText),
			constantValue: checkJson(item.constantValue),
			constantValueComment: checkJson(item.constantValueComment),
			correctionValue: checkJson(item.correctionValue),
			correctionValueComment: checkJson(item.correctionValueComment),
			normSumMonth: checkJson(item.normSumMonth),
			shortName: checkJson(item.shortName),
			sumMonth: checkJson(item.sumMonth),
			todayDG: checkJson(item.todayDG),
			todayKG: checkJson(item.todayKG),
			todayNormVAL: checkJson(item.todayNormVAL),
			todayVAL: checkJson(item.todayVAL),
			todayVALCNT: checkJson(item.todayVALCNT),
			yesterdayConstantValue: checkJson(item.yesterdayConstantValue),
			yesterdayCorrectionValue: checkJson(item.yesterdayCorrectionValue),
			yesterdayDG: checkJson(item.yesterdayDG),
			yesterdayKG: checkJson(item.yesterdayKG),
			yesterdayNormVAL: checkJson(item.yesterdayNormVAL),
			yesterdayVAL: checkJson(item.yesterdayVAL),
			yesterdayVALCNT: checkJson(item.yesterdayVALCNT),
			dGSumm: checkJson(item.dGSumm),
			kGSumm: checkJson(item.kGSumm),
			eXT01_TodayVAL: checkJson(item.eXT01_TodayVAL),
			eXT01_YesterdayVAL: checkJson(item.eXT01_YesterdayVAL),
			baseCCN: checkJson(item.baseCCN),
		};
	});

	return dataset;
}
