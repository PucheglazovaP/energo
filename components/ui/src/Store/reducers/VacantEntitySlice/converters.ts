import { VacantEntity, VacantEntityResponse } from './types';

/**
 *
 * @param vacantEntities response vacant entities
 * @returns converted vacant entities to use in app
 */
export function convertVacantEntities(
	vacantEntities: VacantEntityResponse[],
): VacantEntity[] {
	const convertedVacantEntities: VacantEntity[] = vacantEntities.map(
		(entity) => ({
			id: entity.Number.toString(),
			status: entity.etc,
		}),
	);
	return convertedVacantEntities;
}
