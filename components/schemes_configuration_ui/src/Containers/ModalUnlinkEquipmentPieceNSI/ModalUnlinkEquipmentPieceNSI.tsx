import { Delete } from '../../UI/Confirmation';

import useUnlinkEquipmentPieceNSI from './useUnlinkEquipmentPieceNSI';

function ModalUnlinkEquipmentPieceNSI() {
	const { title, handleClose, handleConfirm } = useUnlinkEquipmentPieceNSI();

	return (
		<Delete title={title} onClose={handleClose} onDelete={handleConfirm} />
	);
}

export default ModalUnlinkEquipmentPieceNSI;
