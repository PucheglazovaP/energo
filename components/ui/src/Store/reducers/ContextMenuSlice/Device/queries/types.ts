import { Module } from '../../../../../Shared/types';
import { User } from '../../../../../Types/UserTypes';

export interface CreateDevicesQuery extends User, Module {
	name: string;
	number: number;
	comment: string;
	server: number;
	count?: number;
}

export interface UpdateDevice extends User, Module {
	number: number;
	name: string;
	comment: string;
	lastModified: string;
}
