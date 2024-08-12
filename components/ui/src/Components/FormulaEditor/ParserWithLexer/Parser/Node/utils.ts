import { NodeParam } from "./types";
import Node from ".";

export function isNodePropertyChange<T>(nodeProps: NodeParam<T>): boolean {
  if (typeof nodeProps.value === "object" || Array.isArray(nodeProps.value)) {
    return JSON.stringify(nodeProps.value) !==
      JSON.stringify(nodeProps.defaultValue);
  }
  return nodeProps.value !== nodeProps.defaultValue;
}

export function hasLeafs(nodes: Node[]): boolean {
  return !nodes.some((node) => node.children.length !== 0);
}

export function isNoChidls(node: Node): boolean {
  return node.children.length === 0 && node.leafs.length === 0;
}
