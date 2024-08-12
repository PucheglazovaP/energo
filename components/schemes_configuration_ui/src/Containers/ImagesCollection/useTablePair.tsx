import React, { useEffect, useState, useTransition } from 'react';
import { useStore } from 'effector-react';

import { $user } from '../../Models/Auth';
import { Image } from '../../Models/ImagesCollection/types';
import { $imagesCollectionForm } from '../../Models/ImagesCollectionForm';
import { loadPreviewImage } from '../../Models/ImagesCollectionParameters/effects';
import {
	switchImage,
	toggleImage,
} from '../../Models/ImagesCollectionParameters/events';
import { CollectionType } from '../../Models/ImagesCollectionParameters/types';
import { ModuleName } from '../../Shared/Types/moduleName';
import Checkbox from '../../UI/Checkbox';
import Input from '../../UI/Input';
import Switcher from '../../UI/Switcher';
import { TableCell } from '../../UI/TablePair/types';

import styles from './ImagesCollection.module.css';

function useTablePair() {
	const { list, type, checkedImagesIds } = useStore($imagesCollectionForm);
	const [filteredList, setFilteredList] = useState<Image[]>(list);
	const user = useStore($user);
	const [, startTransition] = useTransition();

	const renderToggler = (image: Image) => {
		const isImageChecked = checkedImagesIds.includes(image.id);
		switch (type) {
			case CollectionType.multiple:
				return (
					<Checkbox
						name={image.id.toString()}
						title=""
						checked={isImageChecked}
						onChange={() => toggleImage(image.id)}
						className={styles.checkbox}
					/>
				);
			case CollectionType.single:
				return (
					<Switcher
						checked={isImageChecked}
						onChange={() => switchImage(image.id)}
						type="radio"
					/>
				);
		}
	};

	const onChangeSearch = (evt: React.ChangeEvent<HTMLInputElement>) => {
		startTransition(() => {
			const newFilteredImages = list.filter((img) =>
				img.name.toLowerCase().includes(evt.target.value.toLowerCase()),
			);
			setFilteredList(newFilteredImages);
		});
	};

	const createHeaderRow = (): TableCell[] => {
		return [
			{
				name: 'id',
				value: '',
				renderCell: () => <span className={styles.header_id}>{'\u2003'}</span>,
			},
			{
				name: 'name',
				value: '',
				renderCell: () => (
					<Input
						className={styles.search}
						isSearch
						type="search"
						placeholder="Имя файла"
						name="Имя файла"
						onChange={onChangeSearch}
					/>
				),
			},
		];
	};

	const data: TableCell[][] = [
		createHeaderRow(),
		...filteredList.map((image) => [
			{
				name: 'id',
				value: '',
				renderCell: () => renderToggler(image),
			},
			{
				name: 'name',
				value: '',
				width: 350,
				renderCell: () => (
					<button
						className={styles.name}
						onClick={() => {
							if (user)
								loadPreviewImage({
									id: image.id,
									userId: user.preferredUsername,
									moduleName: ModuleName.UseTablePair_loadPreviewImage,
								});
						}}
					>
						{image.name}
					</button>
				),
			},
		]),
	];

	useEffect(() => {
		setFilteredList(list);
	}, [list]);

	return { data };
}

export default useTablePair;
