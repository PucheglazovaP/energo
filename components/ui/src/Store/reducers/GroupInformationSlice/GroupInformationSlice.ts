import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Form, Mnemoscheme, System, Version } from './types';

interface GroupInformationState {
	isModalOpen: boolean;
	forms: Form[];
	systems: System[];
	versions: Version[];
	mnemoschemes: Mnemoscheme[];
	isFormsLoading: boolean;
	isSystemsLoading: boolean;
	isVersionsLoading: boolean;
	isMnemoschemesLoading: boolean;
	isTreeOpen: boolean;
}

const initialState: GroupInformationState = {
	isModalOpen: false,
	forms: [],
	systems: [],
	versions: [],
	mnemoschemes: [],
	isFormsLoading: false,
	isSystemsLoading: false,
	isVersionsLoading: false,
	isMnemoschemesLoading: false,
	isTreeOpen: false,
};

export const groupInformationSlice = createSlice({
	name: 'groupInformation',
	initialState,
	reducers: {
		openGroupInformation: (state) => {
			state.isModalOpen = true;
		},
		closeGroupInformation: (state) => {
			state.isModalOpen = false;
		},
		setForms: (state, action: PayloadAction<Form[]>) => {
			state.forms = action.payload;
		},
		setSystems: (state, action: PayloadAction<System[]>) => {
			state.systems = action.payload;
		},
		setVersions: (state, action: PayloadAction<Version[]>) => {
			state.versions = action.payload;
		},
		setMnemoschemes: (state, action: PayloadAction<Mnemoscheme[]>) => {
			state.mnemoschemes = action.payload;
		},
		setFormsIsLoading: (state, action: PayloadAction<boolean>) => {
			state.isFormsLoading = action.payload;
		},
		setSystemsIsLoading: (state, action: PayloadAction<boolean>) => {
			state.isSystemsLoading = action.payload;
		},
		setVersionsIsLoading: (state, action: PayloadAction<boolean>) => {
			state.isVersionsLoading = action.payload;
		},
		setMnnemoschemesIsLoading: (state, action: PayloadAction<boolean>) => {
			state.isMnemoschemesLoading = action.payload;
		},
		toggleCollapseFormItem: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			const chosenForm = state.forms.find((form) => form.id === id);
			if (chosenForm) {
				chosenForm.isCollapsed = !chosenForm.isCollapsed;
			}
		},
		selectFormItem: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			const previousForm = state.forms.find((form) => form.isSelected === true);
			const chosenForm = state.forms.find((form) => form.id === id);
			// Unselect previously chosen form if it's not the same as chosen
			if (previousForm && chosenForm && previousForm.id !== chosenForm.id) {
				previousForm.isSelected = false;
			}
			// Select chosen form
			if (chosenForm) {
				chosenForm.isSelected = !chosenForm.isSelected;
			}
		},
		toggleExpandTree: (state, action: PayloadAction<string | undefined>) => {
			const id = action.payload;
			if (id) {
				const mnemoscheme = state.mnemoschemes.find(
					(mnemoscheme) => mnemoscheme.id === id,
				);
				if (mnemoscheme) {
					mnemoscheme.isExpanded = !mnemoscheme.isExpanded;
				}
			} else {
				const isExpanded = state.mnemoschemes.some(
					(mnemoscheme) => mnemoscheme.isExpanded,
				);
				if (isExpanded) {
					state.mnemoschemes = state.mnemoschemes.map((mnemoscheme) => ({
						...mnemoscheme,
						isExpanded: false,
					}));
				} else {
					state.mnemoschemes = state.mnemoschemes.map((mnemoscheme) => ({
						...mnemoscheme,
						isExpanded: true,
					}));
				}
			}
		},
		expandTreeToItem: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			const chosenMnemoscheme = state.mnemoschemes.find(
				(mnemoscheme) => mnemoscheme.id === id,
			);
			if (chosenMnemoscheme) {
				// If element is on the root, expand it
				// Else, expand every parent element
				if (chosenMnemoscheme.parentId === null) {
					chosenMnemoscheme.isExpanded = true;
				} else {
					let parentId: string | null = chosenMnemoscheme.parentId;
					const treeElements = state.mnemoschemes.reduce((acc) => {
						const parentMnemoscheme = state.mnemoschemes.find(
							(mnemoscheme) => mnemoscheme.id === parentId,
						);
						if (parentMnemoscheme) {
							parentId = parentMnemoscheme.parentId;
							acc.push(parentMnemoscheme);
							return acc;
						}
						return acc;
					}, [] as Mnemoscheme[]);
					treeElements.forEach((elem) => (elem.isExpanded = true));
				}
			}
		},
		toggleIsTreeOpen: (state) => {
			state.isTreeOpen = !state.isTreeOpen;
		},
		selectTreeItem: (state, action: PayloadAction<string>) => {
			const id = action.payload;
			const previousMnemoscheme = state.mnemoschemes.find(
				(mnemoscheme) => mnemoscheme.isSelected,
			);
			const chosenMnemoscheme = state.mnemoschemes.find(
				(mnemoscheme) => mnemoscheme.id === id,
			);
			// Unselect previously chosen mnemoscheme if it's not chosen mnemoscheme
			if (
				previousMnemoscheme &&
				chosenMnemoscheme &&
				previousMnemoscheme.id !== chosenMnemoscheme.id
			) {
				previousMnemoscheme.isSelected = false;
			}
			// Select chosen mnemoscheme
			if (chosenMnemoscheme) {
				chosenMnemoscheme.isSelected = !chosenMnemoscheme.isSelected;
			}
		},
	},
});

export default groupInformationSlice.reducer;
