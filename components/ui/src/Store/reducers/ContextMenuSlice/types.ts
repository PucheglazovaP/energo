import { Module } from '../../../Shared/types';
import { User } from '../../../Types/UserTypes';

export interface QueryWithFavouritePropsType extends User, Module {
	numbers: string;
}

export interface QueryDeletePropsType extends User, Module {
	number: number;
	lastModified: string;
}
