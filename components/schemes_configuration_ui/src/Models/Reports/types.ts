export type Report = {
	id: number;
	changeDateTime: string;
	name: string;
	comment: string;
	url: string;
};

export enum EditTextName {
	Comment = 'comment',
	Name = 'name',
}
