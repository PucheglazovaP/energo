import { useEffect } from 'react';

import { setPicturesDynamic } from '../../Models/PicturesDynamicObject/event';

export function usePicturesDynamic(
	codeForm: number | null,
	codeObject: number,
	nameParameter: string,
) {
	useEffect(() => {
		setPicturesDynamic({
			codeForm: codeForm,
			codeObject: codeObject,
			nameParameter: nameParameter,
		});
	}, []);
}
