import { useStore } from 'effector-react';

import { $modals } from '../../Models/Modal';
import { modalsList } from '../../Shared/modalsConfig';
import Modals from '../../UI/Modals';

function ModalSystem() {
	const openedModalList: string[] = useStore($modals);

	return <Modals openedModalList={openedModalList} modalsList={modalsList} />;
}

export default ModalSystem;
