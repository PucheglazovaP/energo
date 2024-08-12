import { Tag } from './types';

const replaceSymbol: Map<number, string> = new Map();

replaceSymbol.set('*'.charCodeAt(0), '×');
replaceSymbol.set(Tag.LTE, '≤');
replaceSymbol.set(Tag.GTE, '≥');

export default replaceSymbol;
