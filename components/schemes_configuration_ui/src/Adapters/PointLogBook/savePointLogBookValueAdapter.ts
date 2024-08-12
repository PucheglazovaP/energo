import {
	PointLogBookBodyList,
	PointLogBookBodyListResponse,
} from '../../Models/PointsLogBook/types';
import { BackendResponse } from '../../Shared/types';
import { checkJson } from '../InputForm/inputFormDataAdapter';

export function savePointLogBookValueAdapter(
	response: string,
): PointLogBookBodyList[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as PointLogBookBodyListResponse[];
	const updatedPointLogBookBodyList: PointLogBookBodyList[] = data.map(
		(param) => ({
			date: param.date,
			correctionValue: checkJson(param.correctionValue),
			correctionValueComment: checkJson(param.correctionValueComment),
			constantValue: checkJson(param.constantValue),
			constantValueComment: checkJson(param.constantValueComment),
			mainAggr: checkJson(param.mainAggr),
			mainDaily: checkJson(param.mainDaily),
			mainCnt: checkJson(param.mainCnt),
			avgTemp: checkJson(param.avgTemp),
			avgPress: checkJson(param.avgPress),
			avgBPTemp: checkJson(param.avgBPTemp),
			avgBPPress: checkJson(param.avgBPPress),
			avgHeatTemp: checkJson(param.avgHeatTemp),
			avgHeatPress: checkJson(param.avgHeatPress),
			avgHeatCond: checkJson(param.avgHeatCond),
			avgCalory: checkJson(param.avgCalory),
			normDaily: checkJson(param.normDaily),
			normKG: checkJson(param.normKG),
			normDG: checkJson(param.normDG),
			normPart: checkJson(param.normPart),
			kgCalcAVG: checkJson(param.kgCalcAVG),
			kgCalcCNT: checkJson(param.kgCalcCNT),
			khpSteam: checkJson(param.khpSteam),
			khpWAB: checkJson(param.khpWAB),
			khpKC3Boiler: checkJson(param.khpKC3Boiler),
			khpUSTKSteam: checkJson(param.khpUSTKSteam),
		}),
	);

	return updatedPointLogBookBodyList;
}
