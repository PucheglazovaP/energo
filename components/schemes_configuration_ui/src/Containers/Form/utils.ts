import { TransparentConfiguration } from '../../Shared/Types/formObject';

export function validateTransprarent(transparent: TransparentConfiguration) {
	if (transparent.groupId !== 9999 && transparent.groupId != null) {
		if (
			(transparent.value === 0 || transparent.value == null) &&
			transparent.zeroHighLights
		)
			return { backgroundColor: '#cfcfff', textColor: '#eb5835' };
		if (
			transparent.value != null &&
			transparent.dataMax !== 9999 &&
			transparent.value > transparent.dataMax
		)
			return { backgroundColor: '#ff0000', textColor: '#ffffff' };
		if (
			transparent.value != null &&
			transparent.dataMin !== 9999 &&
			transparent.value < transparent.dataMin
		)
			return { backgroundColor: '#6666ff', textColor: '#ffffff' };
		if (transparent.nulls !== 0)
			return { backgroundColor: '#ffff00', textColor: '#000000' };
		if (transparent.nulls === 0 && transparent.canerr !== '')
			return { backgroundColor: '#ffb0ff', textColor: '#000000' };
	}
	return { backgroundColor: transparent.bkg, textColor: transparent.textColor };
}
