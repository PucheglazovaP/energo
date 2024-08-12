import {
	HeatingSeason,
	HeatingSeasonModification,
} from '../../Models/HeatingSeasons/types';
import { BackendResponse } from '../../Shared/types';

export function getHeatingSeasonsAdapter(response: string): HeatingSeason[] {
	const { Response }: BackendResponse = JSON.parse(response);
	const data = Response.Tables[0].Rows as HeatingSeason[];
	const heatingSeasons: HeatingSeason[] = data.map((season) => ({
		...season,
		modifications: JSON.parse(
			String(season.modifications),
		) as HeatingSeasonModification[],
	}));
	return heatingSeasons;
}
