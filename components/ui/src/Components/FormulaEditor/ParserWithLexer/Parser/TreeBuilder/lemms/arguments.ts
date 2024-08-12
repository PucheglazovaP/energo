import { Token } from '../../Lexer/types';
import Node from '../../Node';
import { LemmNextFunction } from '../types';

export default function createArgumentNode(
	initialToken: Token | null,
	next: LemmNextFunction,
): Node {
	const argumentNode: Node = new Node();
	if (initialToken != null) {
		argumentNode.prependLeaf(initialToken);
	}
	next();
	return argumentNode;
}
