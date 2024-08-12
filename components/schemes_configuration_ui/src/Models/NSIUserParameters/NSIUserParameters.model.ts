import { createStore } from 'effector';

import {
	addUserParameter,
	addUserParameterOption,
	changeDefaultParameters,
	changeUserParameterComment,
	changeUserParameterDataType,
	changeUserParameterName,
	changeUserParameterOption,
	changeUserParameterValue,
	changeViewMode,
	deleteUserParameter,
	deleteUserParameterOption,
	resetUserParameterFilesListModel,
	resetUserParameterOptionsModel,
	restoreUserParameterOptions,
	restoreUserParametersList,
	setAllFilesCheckedState,
	setSelectedListId,
	setUserParameterDataTypes,
	setUserParameterFilesList,
	setUserParameterOptions,
	setUserParametersList,
	switchAllUserParametersExpandedState,
	switchFileCheckedState,
	switchUserParameterExpandedState,
	updateUserParametersList,
} from './events';
import {
	NSIUserParameterDataType,
	NSIUserParameterFilesListItem,
	NSIUserParameterOptionsModel,
	NSIUserParametersModel,
} from './types';

export const $nsiUserParameters = createStore<NSIUserParametersModel>({
	viewMode: 'read',
	defaultParameters: 'actual',
	staticParametersList: [],
	parametersList: [],
	allParametersExpanded: true,
	selectedListId: 0,
})
	.on(changeViewMode, (state, viewMode) => {
		return {
			...state,
			viewMode,
		};
	})
	.on(changeDefaultParameters, (state, defaultParameters) => {
		return {
			...state,
			defaultParameters,
		};
	})
	.on(setUserParametersList, (state, parametersList) => {
		return {
			...state,
			staticParametersList: parametersList,
			parametersList,
			allParametersExpanded: true,
		};
	})
	.on(updateUserParametersList, (state, updatedParameter) => {
		return {
			...state,
			parametersList: state.parametersList.map((parameter) => {
				if (parameter.id === updatedParameter.id) {
					return updatedParameter;
				}

				return parameter;
			}),
		};
	})
	.on(addUserParameter, (state, addedParameter) => {
		return {
			...state,
			parametersList: [addedParameter, ...state.parametersList],
		};
	})
	.on(switchUserParameterExpandedState, (state, selectedParameterId) => {
		return {
			...state,
			parametersList: state.parametersList.map((parameter) => {
				if (parameter.id === selectedParameterId) {
					return {
						...parameter,
						expanded: !parameter.expanded,
					};
				}

				return parameter;
			}),
		};
	})
	.on(switchAllUserParametersExpandedState, (state) => {
		return {
			...state,
			parametersList: state.parametersList.map((parameter) => {
				if (parameter.expanded === state.allParametersExpanded) {
					return {
						...parameter,
						expanded: !parameter.expanded,
					};
				}

				return parameter;
			}),
			allParametersExpanded: !state.allParametersExpanded,
		};
	})
	.on(changeUserParameterName, (state, updatedParameterData) => {
		return {
			...state,
			parametersList: state.parametersList.map((parameter) => {
				if (parameter.id === updatedParameterData.id) {
					return {
						...parameter,
						name: updatedParameterData.name,
						touched: true,
					};
				}

				return parameter;
			}),
		};
	})
	.on(changeUserParameterDataType, (state, updatedParameterData) => {
		return {
			...state,
			parametersList: state.parametersList.map((parameter) => {
				if (parameter.id === updatedParameterData.id) {
					return {
						...parameter,
						dataTypeId: updatedParameterData.dataTypeId,
						dataType: updatedParameterData.dataType,
						touched: true,
					};
				}

				return parameter;
			}),
		};
	})
	.on(changeUserParameterComment, (state, updatedParameterData) => {
		return {
			...state,
			parametersList: state.parametersList.map((parameter) => {
				if (parameter.id === updatedParameterData.id) {
					return {
						...parameter,
						comment: updatedParameterData.comment,
						touched: true,
					};
				}

				return parameter;
			}),
		};
	})
	.on(changeUserParameterValue, (state, updatedParameter) => {
		const parametersList = state.parametersList.map((parameter) => {
			if (parameter.id === updatedParameter.id) {
				return {
					...parameter,
					value: updatedParameter.value,
					touched: true,
				};
			}

			return parameter;
		});

		return {
			...state,
			parametersList,
		};
	})
	.on(setSelectedListId, (state, selectedListId) => {
		return {
			...state,
			selectedListId,
		};
	})
	.on(deleteUserParameter, (state, selectedParameterId) => {
		return {
			...state,
			parametersList: state.parametersList.map((parameter) => {
				if (parameter.id === selectedParameterId) {
					return {
						...parameter,
						touched: true,
						deleted: true,
					};
				}

				return parameter;
			}),
		};
	})
	.on(addUserParameterOption, (state, selectedParameterId) => {
		return {
			...state,
			parametersList: state.parametersList.map((parameter) => {
				if (parameter.id === selectedParameterId) {
					return {
						...parameter,
						touched: true,
					};
				}

				return parameter;
			}),
		};
	})
	.on(changeUserParameterOption, (state, { parameterId }) => {
		return {
			...state,
			parametersList: state.parametersList.map((parameter) => {
				if (parameter.id === parameterId) {
					return {
						...parameter,
						touched: true,
					};
				}

				return parameter;
			}),
		};
	})
	.on(deleteUserParameterOption, (state, { parameterId }) => {
		return {
			...state,
			parametersList: state.parametersList.map((parameter) => {
				if (parameter.id === parameterId) {
					return {
						...parameter,
						touched: true,
					};
				}

				return parameter;
			}),
		};
	})
	.on(restoreUserParametersList, (state) => {
		return {
			...state,
			defaultParameters: 'actual',
			parametersList: state.staticParametersList,
			allParametersExpanded: true,
		};
	});

export const $nsiUserParameterOptions =
	createStore<NSIUserParameterOptionsModel>(new Map())
		.on(setUserParameterOptions, (state, optionsData) => {
			const updatedParameterOptions = new Map(state);

			return updatedParameterOptions.set(optionsData.parameterId, {
				staticParameterOptions: optionsData.options,
				parameterOptions: optionsData.options,
			});
		})
		.on(addUserParameterOption, (state, parameterId) => {
			const actualOptionsList = state.get(parameterId);

			const updatedParameterOptions = new Map(state);

			if (actualOptionsList) {
				return updatedParameterOptions.set(parameterId, {
					staticParameterOptions: actualOptionsList.staticParameterOptions,
					parameterOptions: [
						{
							valueId: -(actualOptionsList.parameterOptions.length + 1),
							value: '',
							lastModified: '',
							touched: true,
							deleted: false,
						},
						...actualOptionsList.parameterOptions,
					],
				});
			}

			return updatedParameterOptions.set(parameterId, {
				staticParameterOptions: [],
				parameterOptions: [
					{
						valueId: -1,
						value: '',
						lastModified: '',
						touched: true,
						deleted: false,
					},
				],
			});
		})
		.on(changeUserParameterOption, (state, updatedOptionData) => {
			const actualOptionsList = state.get(updatedOptionData.parameterId);

			const updatedParameterOptions = new Map(state);

			if (actualOptionsList) {
				const updatedOptionsList = actualOptionsList.parameterOptions.map(
					(option) => {
						if (option.valueId === updatedOptionData.valueId) {
							return {
								...option,
								value: updatedOptionData.value,
								touched: true,
							};
						}

						return option;
					},
				);

				return updatedParameterOptions.set(updatedOptionData.parameterId, {
					staticParameterOptions: actualOptionsList.staticParameterOptions,
					parameterOptions: updatedOptionsList,
				});
			}

			return state;
		})
		.on(deleteUserParameterOption, (state, deletedOptionData) => {
			const actualOptionsList = state.get(deletedOptionData.parameterId);

			const updatedParameterOptions = new Map(state);

			if (actualOptionsList) {
				const updatedOptionsList = actualOptionsList.parameterOptions.map(
					(option) => {
						if (option.valueId === deletedOptionData.valueId) {
							return {
								...option,
								touched: true,
								deleted: true,
							};
						}

						return option;
					},
				);

				return updatedParameterOptions.set(deletedOptionData.parameterId, {
					staticParameterOptions: actualOptionsList.staticParameterOptions,
					parameterOptions: updatedOptionsList,
				});
			}

			return state;
		})
		.on(restoreUserParameterOptions, (state, parameterId) => {
			const actualOptionsList = state.get(parameterId);

			const updatedParameterOptions = new Map(state);

			if (actualOptionsList) {
				return updatedParameterOptions.set(parameterId, {
					staticParameterOptions: actualOptionsList.staticParameterOptions,
					parameterOptions: actualOptionsList.staticParameterOptions,
				});
			}

			return state;
		})
		.reset(resetUserParameterOptionsModel);

export const $nsiUserParameterFilesList = createStore<
	Record<number, NSIUserParameterFilesListItem[]>
>([])
	.on(setUserParameterFilesList, (state, filesListData) => {
		return {
			...state,
			[filesListData.valueId]: filesListData.files,
		};
	})
	.on(switchFileCheckedState, (state, updatedFileData) => {
		const updatedFilesList = state[updatedFileData.valueId];

		if (updatedFilesList) {
			return {
				...state,
				[updatedFileData.valueId]: updatedFilesList.map((file) => {
					if (file.id === updatedFileData.fileId) {
						return {
							...file,
							checked: !file.checked,
						};
					}

					return file;
				}),
			};
		}

		return state;
	})
	.on(setAllFilesCheckedState, (state, updatedCheckedStateData) => {
		const updatedFilesList = state[updatedCheckedStateData.valueId];

		if (updatedFilesList) {
			return {
				...state,
				[updatedCheckedStateData.valueId]: updatedFilesList.map((file) => {
					return {
						...file,
						checked: updatedCheckedStateData.checked,
					};
				}),
			};
		}

		return state;
	})
	.reset(resetUserParameterFilesListModel);

export const $nsiUserParameterDataTypes = createStore<
	NSIUserParameterDataType[]
>([]).on(setUserParameterDataTypes, (state, requestedDataTypes) => {
	return requestedDataTypes;
});
