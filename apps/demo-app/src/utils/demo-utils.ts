import { MosaicNode, MosaicPath } from '@lonli-lokli/react-mosaic-component';

// Helper to find the path to the first leaf node in the tree
export const findFirstLeafPath = (
  node: MosaicNode<number> | null,
): MosaicPath => {
  if (node === null || typeof node === 'number') {
    return [];
  }
  if (node.type === 'split') {
    return [0, ...findFirstLeafPath(node.children[0])];
  }
  if (node.type === 'tabs') {
    return [
      node.activeTabIndex,
      ...findFirstLeafPath(node.tabs[node.activeTabIndex]),
    ];
  }
  return [];
};

// Create new node with timestamp
export const createNode = () => Date.now();
