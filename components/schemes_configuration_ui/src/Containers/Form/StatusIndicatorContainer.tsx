import { useMemo } from 'react';
import { useStore } from 'effector-react';

import { $activeForm, $activeFormLayers } from '../../Models/ActiveForm';
import StatusIndicator from '../../UI/FormObjects/StatusIndicator/StatusIndicator';

function StatusIndicatorContainer() {
	const { statusIndicators } = useStore($activeForm);
	const { checkedFormLayers } = useStore($activeFormLayers);

	const formObjects = useMemo(() => {
		return statusIndicators
			.sort((a, b) => a.orderNumber - b.orderNumber)
			.filter((item) => checkedFormLayers.includes(item.layerId));
	}, [statusIndicators, checkedFormLayers]);

	return formObjects.map((item, index) => {
		return <StatusIndicator key={`${item.id}-${index}`} objectValue={item} />;
	});
}

export default StatusIndicatorContainer;
