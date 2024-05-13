import { max, min, range } from 'lodash-es';
import { describe, expect, it } from 'vitest';

import { MosaicNode } from '../types';
// Import new n-ary types
import {
  createBalancedTreeFromLeaves,
  getAndAssertNodeAtPathExists,
  getLeaves,
  isSplitNode,
  isTabsNode,
  getNodeAtPath,
} from './mosaicUtilities';

// N-ary test trees
const ROOT_ONLY_TREE: MosaicNode<number> = 1;

const NARY_MEDIUM_TREE: MosaicNode<number> = {
  type: 'split',
  direction: 'row',
  children: [
    1,
    {
      type: 'split',
      direction: 'column',
      children: [
        {
          type: 'split',
          direction: 'column',
          children: [2, 3],
        },
        4,
      ],
    },
  ],
};

const NARY_FALSY_TREE: MosaicNode<number | string> = {
  type: 'split',
  direction: 'row',
  children: [0, ''],
};

// Test data for balanced trees
const NINE_LEAVES = range(1, 10);
const THOUSAND_AND_ONE_LEAVES = range(1, 1002);

const NUMERICAL_SORT = (a: number, b: number) => a - b;

// Test helper updated for n-ary nodes
function getTreeDepths(tree: MosaicNode<any> | null): {
  min: number;
  max: number;
} {
  if (isSplitNode(tree)) {
    const childDepths = tree.children.map(getTreeDepths);
    return {
      min: min(childDepths.map((d) => d.min))! + 1,
      max: max(childDepths.map((d) => d.max))! + 1,
    };
  } else if (isTabsNode(tree)) {
    // A tabs node contains leaves, so its children all have a depth of 0.
    // The depth of the tabs node itself is therefore 1.
    const childDepths = tree.tabs.map(getTreeDepths);
    return {
      min: min(childDepths.map((d) => d.min))! + 1,
      max: max(childDepths.map((d) => d.max))! + 1,
    };
  } else if (tree !== null) {
    // Leaf node
    return { min: 0, max: 0 };
  } else {
    // Null tree
    return { min: -1, max: -1 };
  }
}

describe('mosaicUtilities', () => {
  describe('getNodeAtPath', () => {
    it('should get root', () => {
      expect(getNodeAtPath(NARY_MEDIUM_TREE, [])).to.equal(NARY_MEDIUM_TREE);
    });
    it('should get a parent node', () => {
      expect(getNodeAtPath(NARY_MEDIUM_TREE, [1])).to.deep.equal(
        (NARY_MEDIUM_TREE as any).children[1],
      );
    });
    it('should get a leaf', () => {
      // Path is now numeric: root -> child 1 -> child 0 -> child 1
      expect(getNodeAtPath(NARY_MEDIUM_TREE, [1, 0, 1])).to.equal(3);
    });
    it('should return null on incorrect path through a leaf', () => {
      // Path [0, 0] is invalid because node at [0] is a leaf
      expect(getNodeAtPath(NARY_MEDIUM_TREE, [0, 0])).to.equal(null);
    });
    it('should return null on out-of-bounds path', () => {
      expect(getNodeAtPath(NARY_MEDIUM_TREE, [1, 0, 2])).to.equal(null);
    });
    it('should return null on null root', () => {
      expect(getNodeAtPath(null, [1, 0, 1])).to.equal(null);
    });
    it('should work with falsy values', () => {
      expect(getNodeAtPath(NARY_FALSY_TREE, [0])).to.equal(0);
      expect(getNodeAtPath(NARY_FALSY_TREE, [1])).to.equal('');
    });
  });

  describe('getAndAssertNodeAtPathExists', () => {
    it('should get root', () => {
      expect(getAndAssertNodeAtPathExists(NARY_MEDIUM_TREE, [])).to.equal(
        NARY_MEDIUM_TREE,
      );
    });
    it('should get a parent node', () => {
      expect(getAndAssertNodeAtPathExists(NARY_MEDIUM_TREE, [1])).to.deep.equal(
        (NARY_MEDIUM_TREE as any).children[1],
      );
    });
    it('should get a leaf', () => {
      expect(
        getAndAssertNodeAtPathExists(NARY_MEDIUM_TREE, [1, 0, 1]),
      ).to.equal(3);
    });
    it('should error on incorrect path', () => {
      expect(() =>
        getAndAssertNodeAtPathExists(NARY_MEDIUM_TREE, [0, 0]),
      ).to.throw(Error);
    });
    it('should error on null root', () => {
      expect(() => getAndAssertNodeAtPathExists(null, [1, 0, 1])).to.throw(
        Error,
      );
    });
  });

  describe('getLeaves', () => {
    it('should get leaves of simple tree', () => {
      expect(getLeaves(ROOT_ONLY_TREE)).to.deep.equal([1]);
    });
    it('should get leaves of medium tree', () => {
      expect(getLeaves(NARY_MEDIUM_TREE).sort(NUMERICAL_SORT)).to.deep.equal([
        1, 2, 3, 4,
      ]);
    });
    it('should get leaves of a tree with tabs', () => {
      const treeWithTabs: MosaicNode<number> = {
        type: 'tabs',
        tabs: [1, 2, 3],
        activeTabIndex: 0,
      };
      expect(getLeaves(treeWithTabs).sort(NUMERICAL_SORT)).to.deep.equal([
        1, 2, 3,
      ]);
    });
    it('should return empty array when provided an empty tree', () => {
      expect(getLeaves(null)).to.deep.equal([]);
    });
  });

  describe('createBalancedTreeFromLeaves', () => {
    it('should be balanced', () => {
      const tree = createBalancedTreeFromLeaves(NINE_LEAVES);
      const depths = getTreeDepths(tree);
      expect(depths.max - depths.min).to.be.lessThan(2);
    });
    it('should be balanced when huge', () => {
      const tree = createBalancedTreeFromLeaves(THOUSAND_AND_ONE_LEAVES);
      const depths = getTreeDepths(tree);
      expect(depths.max - depths.min).to.be.lessThan(2);
    });
    it('should include all leaves', () => {
      const tree = createBalancedTreeFromLeaves(THOUSAND_AND_ONE_LEAVES);
      const leaves = getLeaves(tree);
      expect(leaves.sort(NUMERICAL_SORT)).to.deep.equal(
        THOUSAND_AND_ONE_LEAVES,
      );
    });
    it('should return a split node for more than one leaf', () => {
      const tree = createBalancedTreeFromLeaves([1, 2]);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      expect(isSplitNode(tree)).to.be.true;
    });
    it('should return a single leaf when provided one leaf', () => {
      const tree = createBalancedTreeFromLeaves([1]);
      expect(tree).to.equal(1);
    });
    it('should return empty tree when provided no leaves', () => {
      const tree = createBalancedTreeFromLeaves([]);
      expect(tree).to.equal(null);
    });
  });
});
