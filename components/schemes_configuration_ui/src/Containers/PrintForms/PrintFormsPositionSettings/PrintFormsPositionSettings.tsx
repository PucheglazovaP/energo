import { Button, Eye } from '@evraz/ui-kit';

import { PositionAxis } from '../../../Shared/types';
import { ColorPicker } from '../../../UI/ColorPicker';
import Divider from '../../../UI/Divider';
import Dropdown from '../../../UI/Dropdown';
import Input from '../../../UI/Input';
import Switcher from '../../../UI/Switcher';

import ColorParameter from './partials/ColorParameter';
import ListInformation from './partials/ListInformation';
import TextAlignSwitcher from './partials/TextAlignSwitcher';
import TextBoldnessSwitcher from './partials/TextBoldnessSwitcher';
import PrintFormsPositionPreview from './PrintFormsPositionPreview';
import useSettings from './useSettings';

import styles from './PrintFormsPositionSettings.module.css';

function PrintFormsPositionSettings() {
	const {
		position,
		priorityMethods,
		listInformationItems,
		selectedPriorityMethod,
		isActionsDisabled,
		onChangeName,
		onChangeNumber,
		onChangeAlign,
		onChangeBold,
		onChangeBackgroundColor,
		onChangeFontColor,
		onChangePriority,
		onChangePriorityMethod,
		onAddPriority,
		onResetPosition,
		onSavePosition,
		onPreview,
	} = useSettings();

	if (!position) {
		return <span>Позиция не выбрана</span>;
	}

	return (
		<div className={styles.settings}>
			<Input
				label={'Наименование позиции'}
				value={position.name}
				onChange={onChangeName}
				className={styles.input}
			/>
			<Input
				label={'№ позиции'}
				value={position.positionNumber?.toString() || ''}
				onChange={onChangeNumber}
				className={styles.input}
			/>
			<Divider position={PositionAxis.Horizontal} />
			<p className={styles.label}>Превью ячейки</p>
			<PrintFormsPositionPreview
				align={position.textAlign}
				isBold={position.bold}
				color={position.fontColor || '#000000'}
				bgColor={position.bgColor}
				name={position.name}
			/>
			<Divider position={PositionAxis.Horizontal} />
			<ColorParameter title={'Фон ячейки'}>
				<ColorPicker
					onChange={onChangeBackgroundColor}
					initColor={position.bgColor}
				/>
				<span>{position.bgColor}</span>
			</ColorParameter>
			<ColorParameter title={'Цвет текста'}>
				<ColorPicker
					onChange={onChangeFontColor}
					initColor={position.fontColor || '#000000'}
				/>
				<span>{position.fontColor}</span>
			</ColorParameter>
			<div className={styles.font__layout}>
				<TextAlignSwitcher
					selectedId={position.textAlign}
					handleSelect={onChangeAlign}
				/>
				<Divider />
				<TextBoldnessSwitcher
					selectedId={Number(position.bold)}
					handleSelect={onChangeBold}
				/>
			</div>
			<Divider position={PositionAxis.Horizontal} />
			<Switcher
				checked={!!position.priority}
				caption={'Приоритет приборного учета'}
				type="switcher"
				onChange={onChangePriority}
			/>
			{Boolean(position.priority) && (
				<>
					<div className={styles.priority}>
						<Dropdown
							options={priorityMethods}
							setSelectedOption={onChangePriorityMethod}
							selectedOption={selectedPriorityMethod}
							className={styles.priority__dropdown}
						/>
						<Divider position={PositionAxis.Vertical} />
						{position.deviceId || position.channelId ? (
							<Button onClick={onAddPriority}>Редактировать</Button>
						) : (
							<Button onClick={onAddPriority}>Добавить</Button>
						)}
					</div>
					<ListInformation items={listInformationItems} />
				</>
			)}
			<div className={styles.controllers}>
				<Button
					primary
					className={styles.controllers__cancel}
					disabled={isActionsDisabled}
					onClick={onResetPosition}
				>
					Отменить
				</Button>
				<Button
					primary
					className={styles.controllers__apply}
					disabled={isActionsDisabled}
					onClick={onSavePosition}
				>
					Сохранить
				</Button>
				<Button className={styles.controllers__preview} onClick={onPreview}>
					<Eye className={styles.controllers__icon} />
					<span>Превью отчета</span>
				</Button>
			</div>
		</div>
	);
}

export default PrintFormsPositionSettings;
