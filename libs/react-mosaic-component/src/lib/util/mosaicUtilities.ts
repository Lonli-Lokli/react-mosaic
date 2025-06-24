import { type Spec } from 'immutability-helper';
import update from 'immutability-helper';
import { clone } from 'lodash-es';
import {
  LegacyMosaicNode,
  LegacyMosaicParent,
  MosaicDirection,
  MosaicKey,
  MosaicNode,
  MosaicPath,
  MosaicSplitNode,
  MosaicTabsNode,
} from '../types';

function alternateDirection<T extends MosaicKey>(
  node: MosaicNode<T>,
  direction: MosaicDirection = 'row',
): MosaicNode<T> {
  if (isSplitNode(node)) {
    const nextDirection = getOtherDirection(direction);
    return {
      type: 'split',
      direction,
      children: node.children.map((child) =>
        alternateDirection(child, nextDirection),
      ),
      splitPercentages: node.splitPercentages,
    };
  } else {
    return node;
  }
}

export enum Corner {
  TOP_LEFT = 1,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
}

/**
 * Returns `true` if `node` is a MosaicSplitNode
 * @param node
 * @returns {boolean}
 */
export function isSplitNode<T extends MosaicKey>(
  node: MosaicNode<T> | null,
): node is MosaicSplitNode<T> {
  return (
    typeof node === 'object' &&
    node !== null &&
    'type' in node &&
    node.type === 'split'
  );
}

export function isTabsNode<T extends MosaicKey>(
  node: MosaicNode<T> | null,
): node is MosaicTabsNode<T> {
  return (
    typeof node === 'object' &&
    node !== null &&
    'tabs' in node &&
    Array.isArray((node as any).tabs)
  );
}

export function getParentNode<T extends MosaicKey>(
  root: MosaicNode<T> | null,
  path: MosaicPath,
): MosaicNode<T> | null {
  return getNodeAtPath(root, getParentPath(path));
}

export function getParentPath(path: MosaicPath): MosaicPath {
  return path.slice(0, -1);
}
/**
 * Creates a balanced binary tree from `leaves` with the goal of making them as equal area as possible
 * @param leaves
 * @param startDirection
 * @returns {MosaicNode<T>}
 */
export function createBalancedTreeFromLeaves<T extends MosaicKey>(
  leaves: MosaicNode<T>[],
  startDirection: MosaicDirection = 'row',
): MosaicNode<T> | null {
  if (leaves.length === 0) {
    return null;
  }

  if (leaves.length === 1) {
    return leaves[0];
  }

  let current: MosaicNode<T>[] = clone(leaves);
  let next: MosaicNode<T>[] = [];

  while (current.length > 1) {
    while (current.length > 0) {
      if (current.length > 1) {
        // Take pairs and create binary splits
        const first = current.shift()!;
        const second = current.shift()!;
        next.push({
          type: 'split',
          direction: 'row',
          children: [first, second],
          splitPercentages: [50, 50],
        });
      } else {
        next.unshift(current.shift()!);
      }
    }
    current = next;
    next = [];
  }
  return alternateDirection(current[0], startDirection);
}

/**
 * Creates a balanced n-ary tree from `leaves` - alternative implementation
 * that creates splits with multiple children when beneficial
 * @param leaves
 * @param startDirection
 * @returns {MosaicNode<T>}
 */
export function createBalancedNaryTreeFromLeaves<T extends MosaicKey>(
  leaves: MosaicNode<T>[],
  startDirection: MosaicDirection = 'row',
  maxChildrenPerSplit = 4,
): MosaicNode<T> | null {
  if (leaves.length === 0) {
    return null;
  }

  if (leaves.length === 1) {
    return leaves[0];
  }

  if (leaves.length <= maxChildrenPerSplit) {
    // Create a single split with all leaves
    const equalPercentage = 100 / leaves.length;
    return {
      type: 'split',
      direction: startDirection,
      children: leaves,
      splitPercentages: Array(leaves.length).fill(equalPercentage),
    };
  }

  // For larger numbers, create a balanced tree structure
  const mid = Math.ceil(leaves.length / 2);
  const left = leaves.slice(0, mid);
  const right = leaves.slice(mid);

  return {
    type: 'split',
    direction: startDirection,
    children: [
      createBalancedNaryTreeFromLeaves(
        left,
        getOtherDirection(startDirection),
        maxChildrenPerSplit,
      )!,
      createBalancedNaryTreeFromLeaves(
        right,
        getOtherDirection(startDirection),
        maxChildrenPerSplit,
      )!,
    ],
    splitPercentages: [50, 50],
  };
}

/**
 * Gets the sibling index of the given child index
 * For n-ary structures, this concept is less clear, so we return adjacent indices
 * @param childIndex
 * @param totalChildren
 * @returns {number[]} Array of sibling indices
 */
export function getOtherChildIndices(
  childIndex: number,
  totalChildren: number,
): number[] {
  const siblings: number[] = [];
  for (let i = 0; i < totalChildren; i++) {
    if (i !== childIndex) {
      siblings.push(i);
    }
  }
  return siblings;
}

/**
 * Gets the opposite of `direction`
 * @param direction
 * @returns {any}
 */
export function getOtherDirection(direction: MosaicDirection): MosaicDirection {
  if (direction === 'row') {
    return 'column';
  } else {
    return 'row';
  }
}

/**
 * Traverses `tree` to find the path to the specified `corner`
 * @param tree
 * @param corner
 * @returns {MosaicPath}
 */
export function getPathToCorner(
  tree: MosaicNode<any>,
  corner: Corner,
): MosaicPath {
  let currentNode: MosaicNode<any> = tree;
  const currentPath: MosaicPath = [];

  while (isSplitNode(currentNode)) {
    let targetIndex: number;

    if (currentNode.direction === 'row') {
      // For row direction, first child is left, last child is right
      if (corner === Corner.TOP_LEFT || corner === Corner.BOTTOM_LEFT) {
        targetIndex = 0; // First child (leftmost)
      } else {
        targetIndex = currentNode.children.length - 1; // Last child (rightmost)
      }
    } else {
      // For column direction, first child is top, last child is bottom
      if (corner === Corner.TOP_LEFT || corner === Corner.TOP_RIGHT) {
        targetIndex = 0; // First child (topmost)
      } else {
        targetIndex = currentNode.children.length - 1; // Last child (bottommost)
      }
    }

    currentPath.push(targetIndex);
    currentNode = currentNode.children[targetIndex];
  }

  return currentPath;
}

/**
 * Gets all leaves of `tree`
 * @param tree
 * @returns {T[]}
 */
export function getLeaves<T extends MosaicKey>(
  tree: MosaicNode<T> | null,
): T[] {
  if (tree == null) {
    return [];
  } else if (isSplitNode(tree)) {
    return tree.children.flatMap((child) => getLeaves(child));
  } else if (isTabsNode(tree)) {
    return tree.tabs;
  } else {
    return [tree];
  }
}

/**
 * Converts a legacy binary-tree MosaicNode to the new n-ary tree format.
 * - `LegacyMosaicParent` is converted to `MosaicSplitNode`.
 * - `splitPercentage` is converted to a `splitPercentages` array.
 *
 * @param legacyNode The node from the old binary tree structure.
 * @returns The equivalent node in the new n-ary tree structure.
 */
export function convertLegacyToNary<T extends MosaicKey>(
  legacyNode: null,
): null;
export function convertLegacyToNary<T extends MosaicKey>(
  legacyNode: LegacyMosaicNode<T> | MosaicNode<T>,
): MosaicNode<T>;
export function convertLegacyToNary<T extends MosaicKey>(
  legacyNode: LegacyMosaicNode<T> | MosaicNode<T> | null,
): MosaicNode<T> | null;
export function convertLegacyToNary<T extends MosaicKey>(
  legacyNode: LegacyMosaicNode<T> | MosaicNode<T> | null,
): MosaicNode<T> | null {
  // Base case: If the node is a leaf (panel), return it as is.

  if (
    typeof legacyNode !== 'object' ||
    legacyNode === null ||
    !('first' in legacyNode)
  ) {
    return legacyNode;
  }

  const parentNode = legacyNode as LegacyMosaicParent<T>;

  const newSplitNode: MosaicSplitNode<T> = {
    type: 'split',
    direction: parentNode.direction,
    children: [
      convertLegacyToNary(parentNode.first),
      convertLegacyToNary(parentNode.second),
    ],
    splitPercentages:
      parentNode.splitPercentage !== undefined
        ? [parentNode.splitPercentage, 100 - parentNode.splitPercentage]
        : undefined, // Let the renderer decide on default (e.g., 50/50)
  };

  return newSplitNode;
}

/**
 * Recursively normalizes a mosaic tree to enforce logical constraints, returning a new tree.
 * - Flattens Split nodes that have only one child.
 * - Flattens Tabs nodes that have only one tab.
 * - Removes empty Split or Tabs nodes completely.
 *
 * This should be run after any operation that might change the tree structure.
 *
 * @param node The mosaic node to normalize.
 * @returns A normalized node, or null if the node becomes empty and should be removed.
 */
export function normalizeMosaicTree<T extends MosaicKey>(
  node: MosaicNode<T> | null,
): MosaicNode<T> | null {
  if (node === null || typeof node !== 'object') {
    return node; // Return leaves (panels) or null as is.
  }

  if (node.type === 'split') {
    // 1. Recursively normalize children and filter out any that become null.
    const normalizedChildren = node.children
      .map((child) => normalizeMosaicTree(child))
      .filter((child): child is MosaicNode<T> => child !== null);

    // 2. Apply rules based on the number of remaining children.
    if (normalizedChildren.length === 0) {
      return null; // This split is empty, so remove it.
    }
    if (normalizedChildren.length === 1) {
      return normalizedChildren[0]; // A split with one child is redundant; return the child itself.
    }

    // 3. Flatten splits with the same direction (merge consecutive splits)
    const flattenedChildren: MosaicNode<T>[] = [];
    const flattenedPercentages: number[] = [];
    let percentagesAreValid = true;

    for (let i = 0; i < normalizedChildren.length; i++) {
      const child = normalizedChildren[i];

      // If this child is a split with the same direction, flatten it
      if (isSplitNode(child) && child.direction === node.direction) {
        // Add all of the child split's children to our flattened list
        flattenedChildren.push(...child.children);

        // Calculate percentages for the flattened children
        if (
          percentagesAreValid &&
          node.splitPercentages &&
          child.splitPercentages
        ) {
          const parentPercentage = node.splitPercentages[i];
          // Scale the child's percentages by the parent's percentage
          const scaledChildPercentages = child.splitPercentages.map(
            (childPerc) => (childPerc * parentPercentage) / 100,
          );
          flattenedPercentages.push(...scaledChildPercentages);
        } else {
          // If we don't have percentages, mark them as invalid
          percentagesAreValid = false;
        }
      } else {
        // This child is not a split with the same direction, keep it as is
        flattenedChildren.push(child);
        if (percentagesAreValid && node.splitPercentages) {
          flattenedPercentages.push(node.splitPercentages[i]);
        } else {
          percentagesAreValid = false;
        }
      }
    }

    // 4. Calculate final split percentages
    let finalSplitPercentages: number[] | undefined;

    const childrenWereFlattened =
      flattenedChildren.length !== normalizedChildren.length;
    const childrenWereRemoved =
      node.children.length !== normalizedChildren.length;

    if (
      percentagesAreValid &&
      flattenedPercentages.length === flattenedChildren.length
    ) {
      // We successfully calculated percentages during flattening
      finalSplitPercentages = flattenedPercentages;
    } else if (
      !childrenWereFlattened &&
      !childrenWereRemoved &&
      node.splitPercentages
    ) {
      // No structural changes, keep original percentages
      finalSplitPercentages = node.splitPercentages;
    } else if (childrenWereRemoved && node.splitPercentages) {
      // Some children were removed, recalculate proportionally
      const remainingPercentages: number[] = [];
      let totalRemainingPercentage = 0;

      // Find the percentages of children that remain
      for (let i = 0; i < normalizedChildren.length; i++) {
        const child = normalizedChildren[i];
        const originalIndex = node.children.findIndex(
          (originalChild) => normalizeMosaicTree(originalChild) === child,
        );
        if (originalIndex >= 0 && node.splitPercentages[originalIndex]) {
          remainingPercentages.push(node.splitPercentages[originalIndex]);
          totalRemainingPercentage += node.splitPercentages[originalIndex];
        } else {
          remainingPercentages.push(0);
        }
      }

      if (totalRemainingPercentage > 0) {
        // Scale remaining percentages to sum to 100
        finalSplitPercentages = remainingPercentages.map(
          (p) => (p / totalRemainingPercentage) * 100,
        );
      } else {
        // Fallback to equal distribution
        const equalPercentage = 100 / flattenedChildren.length;
        finalSplitPercentages = Array(flattenedChildren.length).fill(
          equalPercentage,
        );
      }
    } else {
      // Fallback to equal distribution for all children
      const equalPercentage = 100 / flattenedChildren.length;
      finalSplitPercentages = Array(flattenedChildren.length).fill(
        equalPercentage,
      );
    }

    return {
      ...node,
      children: flattenedChildren,
      splitPercentages: finalSplitPercentages,
    };
  }

  if (node.type === 'tabs') {
    const validTabs = node.tabs;

    if (validTabs.length === 0) {
      return null; // This tab container is empty, remove it.
    }
    if (validTabs.length === 1) {
      return validTabs[0]; // A tab container with one tab is redundant; return the panel itself.
    }

    // Ensure activeTabIndex is valid after potential tab removals.
    const activeTabIndex = Math.max(
      0,
      Math.min(node.activeTabIndex, validTabs.length - 1),
    );
    return { ...node, activeTabIndex };
  }

  return node; // Should not be reached.
}

/**
 * Helper to retrieve a node from the tree at a given path.
 * Correctly traverses both 'split' and 'tabs' nodes.
 *
 * @param tree The root of the tree to search.
 * @param path The path to the desired node.
 * @returns The node at the path, or null if the path is invalid or the node doesn't exist.
 */
export function getNodeAtPath<T extends MosaicKey>(
  tree: MosaicNode<T> | null,
  path: MosaicPath,
): MosaicNode<T> | null {
  if (!tree) {
    return null;
  }

  let current: MosaicNode<T> | null = tree;

  for (const index of path) {
    // If current is a leaf (not an object) or null, we cannot go deeper.
    if (current === null || typeof current !== 'object') {
      return null;
    }

    // Now we know 'current' is a container node, so we check its type.
    if ('type' in current) {
      switch (current.type) {
        case 'split':
          current = current.children[index] ?? null;
          break;
        case 'tabs':
          // A tabs node's children are its tabs, which are leaf nodes (T).
          // This will likely be the last step in a valid path.
          current = current.tabs[index] ?? null;
          break;
        default:
          // Malformed node with an unknown type
          return null;
      }
    } else {
      // This case handles a malformed node that is an object but has no `type`.
      return null;
    }
  }

  return current;
}

/**
 * Updates the split percentages for a node in the tree based on a local resize action.
 * This function only affects the two panes adjacent to the dragged splitter.
 *
 * @param tree The root of the mosaic tree.
 * @param path The path to the `MosaicSplitNode` being resized.
 * @param splitterIndex The index of the splitter being dragged (0 for the splitter between child 0 and 1).
 * @param deltaPercentage The percentage change to apply. Positive makes the first pane larger.
 * @param minimumPaneSizePercentage The minimum allowed size for a pane.
 * @returns A new, updated mosaic tree.
 */
export function resizeSplit<T extends MosaicKey>(
  tree: MosaicNode<T>,
  path: MosaicPath,
  splitterIndex: number,
  deltaPercentage: number,
  minimumPaneSizePercentage = 10,
): MosaicNode<T> {
  const parentNode = getNodeAtPath(tree, path);

  if (
    !parentNode ||
    typeof parentNode !== 'object' ||
    parentNode.type !== 'split'
  ) {
    console.error(
      'Path does not point to a valid split node. No update will be performed.',
    );
    return tree;
  }

  // 1. Get or create the initial percentages array.
  let currentPercentages = parentNode.splitPercentages;
  if (!currentPercentages) {
    const numChildren = parentNode.children.length;
    const equalPart = 100 / numChildren;
    currentPercentages = Array(numChildren).fill(equalPart);
  }

  const firstPaneIndex = splitterIndex;
  const secondPaneIndex = splitterIndex + 1;

  if (secondPaneIndex >= currentPercentages.length) {
    console.error('Invalid splitter index. No update will be performed.');
    return tree;
  }

  // 2. Clamp the delta to respect minimum pane sizes.
  const firstPaneSize = currentPercentages[firstPaneIndex];
  const secondPaneSize = currentPercentages[secondPaneIndex];
  const maxAllowedDelta = secondPaneSize - minimumPaneSizePercentage;
  const minAllowedDelta = -(firstPaneSize - minimumPaneSizePercentage);
  const clampedDelta = Math.max(
    minAllowedDelta,
    Math.min(deltaPercentage, maxAllowedDelta),
  );

  // 3. Create the new percentages array by applying the clamped delta.
  const newPercentages = [...currentPercentages];
  newPercentages[firstPaneIndex] += clampedDelta;
  newPercentages[secondPaneIndex] -= clampedDelta;

  // 4. Build the nested spec for the immutable update.
  const spec: Spec<MosaicNode<T>> = {
    splitPercentages: { $set: newPercentages },
  };

  let nestedSpec = spec;
  // This loop correctly builds the path for immutability-helper
  for (let i = path.length - 1; i >= 0; i--) {
    nestedSpec = { children: { [path[i]]: nestedSpec as Spec<MosaicNode<T>> } };
  }

  return update(tree, nestedSpec as Spec<MosaicNode<T>>);
}

/**
 * Gets node at `path` from `tree` and verifies that neither `tree` nor the result are null
 * @param tree
 * @param path
 * @returns {MosaicNode<T>}
 */
export function getAndAssertNodeAtPathExists<T extends MosaicKey>(
  tree: MosaicNode<T> | null,
  path: MosaicPath,
): MosaicNode<T> {
  if (tree == null) {
    throw new Error('Root is empty, cannot fetch path');
  }
  const node = getNodeAtPath(tree, path);
  if (node == null) {
    throw new Error(`Path [${path.join(', ')}] did not resolve to a node`);
  }
  return node;
}

/**
 * Helper function to get the parent node and child index for a given path
 * Useful for operations that need to modify a child
 * @param tree
 * @param path
 * @returns Object with parent node and child index, or null if not found
 */
export function getParentAndChildIndex<T extends MosaicKey>(
  tree: MosaicNode<T> | null,
  path: MosaicPath,
): {
  parent: MosaicSplitNode<T> | MosaicTabsNode<T>;
  childIndex: number;
} | null {
  if (path.length === 0 || tree == null) {
    return null; // No parent for root
  }

  const parentPath = path.slice(0, -1);
  const lastBranch = path[path.length - 1];

  // Convert branch to child index
  const childIndex =
    typeof lastBranch === 'number' ? lastBranch : Number(lastBranch);

  // Validate child index is a valid number
  if (!Number.isInteger(childIndex) || childIndex < 0) {
    return null;
  }

  const parent = getNodeAtPath(tree, parentPath);

  if (!parent) {
    return null;
  }

  // Check if parent is a split node
  if (isSplitNode(parent)) {
    if (childIndex >= parent.children.length) {
      return null;
    }
    return { parent, childIndex };
  }

  // Check if parent is a tabs node
  if (isTabsNode(parent)) {
    if (childIndex >= parent.tabs.length) {
      return null;
    }
    return { parent, childIndex };
  }

  // Parent is neither split nor tabs node - can't have children
  return null;
}
