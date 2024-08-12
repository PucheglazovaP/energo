import { useEffect, useMemo } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { fetchDevicesURSV510Fx } from '../../Models/Devices/effects';
import { $printFormSidebarsState } from '../../Models/PrintForms';
import { ModuleName } from '../../Shared/Types/moduleName';
import { DoubleVerticalResizerSizes } from '../../UI/DoubleVerticalResizer/types';

import { DEFAULT_SIDEBAR_SIZES } from './constants';

function usePageReferenceByForms() {
	const { isLeftSidebarOpen, isRightSidebarOpen } = useStore(
		$printFormSidebarsState,
	);
	const user = useStore($user);

	const {
		leftElementMinWidth,
		rightElementMinWidth,
		leftElementDefaultWidth,
		rightElementDefaultWidth,
		leftElementMaxWidth,
		rightElementMaxWidth,
	}: DoubleVerticalResizerSizes = useMemo(() => {
		const sizes: DoubleVerticalResizerSizes = { ...DEFAULT_SIDEBAR_SIZES };
		if (!isLeftSidebarOpen) {
			sizes.leftElementMinWidth = 0;
			sizes.leftElementDefaultWidth = 0;
			sizes.leftElementMaxWidth = 0;
		}
		if (!isRightSidebarOpen) {
			sizes.rightElementMinWidth = 0;
			sizes.rightElementDefaultWidth = 0;
			sizes.rightElementMaxWidth = 0;
		}
		return sizes;
	}, [isLeftSidebarOpen, isRightSidebarOpen]);

	useEffect(() => {
		if (user) {
			fetchDevicesURSV510Fx({
				userId: user.preferredUsername,
				moduleName: ModuleName.UsePageReferenceByForms_fetchDevicesURSV510Fx,
			});
		}
	}, []);

	return {
		isLeftSidebarOpen,
		isRightSidebarOpen,
		leftElementMinWidth,
		rightElementMinWidth,
		leftElementDefaultWidth,
		rightElementDefaultWidth,
		leftElementMaxWidth,
		rightElementMaxWidth,
	};
}

export default usePageReferenceByForms;
