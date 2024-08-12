import { MouseEvent } from 'react';

import {
	FormObject,
	FormObjectConfiguration,
	TransparentConfiguration,
} from '../../../Shared/Types/formObject';

export type FormObjectProps = {
	className?: string;
	object: FormObjectConfiguration;
	handleClick?: () => void;
	handleSelect?: (checked: boolean) => void;
	isSelected?: boolean;
	validate?: (transparentData: TransparentConfiguration) => {
		textColor: string;
		backgroundColor: string;
	};
	onContextMenu?: (evt: MouseEvent, obj: FormObject) => void;
	onMouseMove?: (evt: MouseEvent, obj: FormObject) => void;
	onMouseLeave?: (evt: MouseEvent, obj: FormObject) => void;
	onEmergencyButtonClick?: (obj: FormObject) => void;
	isEmergencyEventsModeEnabled?: boolean;
};
