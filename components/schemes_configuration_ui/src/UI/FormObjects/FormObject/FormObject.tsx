import {
	DynamicObjectConfiguration,
	ObjectTypes,
	StatusIndicatorConfiguration,
	TransparentConfiguration,
} from '../../../Shared/Types/formObject';
import DynamicObject from '../DynamicObject/DynamicObject';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import Transparent from '../Transparent/Transparent';

import { FormObjectProps } from './types';

function FormObject(props: FormObjectProps) {
	const {
		className,
		object,
		handleClick = () => {},
		handleSelect = () => {},
		isSelected = false,
		validate,
		onContextMenu,
		onMouseMove,
		onMouseLeave,
		onEmergencyButtonClick,
		isEmergencyEventsModeEnabled,
	} = props;

	return (
		<>
			{object.objectType === ObjectTypes.Transparent && (
				<Transparent
					className={className}
					objectValue={object as TransparentConfiguration}
					handleClick={handleClick}
					handleSelect={handleSelect}
					isSelected={isSelected}
					validate={validate}
					onContextMenu={onContextMenu}
					onMouseMove={onMouseMove}
					onMouseLeave={onMouseLeave}
					onEmergencyButtonClick={onEmergencyButtonClick}
					isEmergencyEventsModeEnabled={isEmergencyEventsModeEnabled}
				/>
			)}
			{object.objectType === ObjectTypes.DynamicObject && (
				<DynamicObject
					className={className}
					objectValue={object as DynamicObjectConfiguration}
					handleClick={handleClick}
					onMouseMove={onMouseMove}
					onMouseLeave={onMouseLeave}
				/>
			)}
			{object.objectType === ObjectTypes.StatusIndicator && (
				<StatusIndicator objectValue={object as StatusIndicatorConfiguration} />
			)}
		</>
	);
}

export default FormObject;
