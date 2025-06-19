import { describe, expect, it } from 'vitest';
import { getNodeAtPath, MosaicNode } from '../src/index';
import { MosaicDropTargetPosition } from '../src/internalTypes';
// Import the new n-ary types
import { MosaicPath, MosaicSplitNode, MosaicTabsNode } from '../src/types';
import {
  createDragToUpdates,
  createRemoveUpdate,
  updateTree,
} from '../src/util/mosaicUpdates';

// The test tree converted to the new n-ary format
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

describe('mosaicUpdates', () => {
  describe('updateTree', () => {
    // Paths are now numeric arrays
    const simpleUpdatedTree = updateTree(NARY_MEDIUM_TREE, [
      {
        path: [0], // was ['first']
        spec: {
          $set: 5,
        },
      },
    ]);

    it('should apply update', () => {
      expect(getNodeAtPath(simpleUpdatedTree, [0])).to.equal(5);
    });

    it('roots should not be reference equal', () => {
      expect(simpleUpdatedTree).to.not.equal(NARY_MEDIUM_TREE);
    });

    it('unchanged nodes should be reference equal', () => {
      const path: MosaicPath = [1]; // was ['second']
      expect(getNodeAtPath(simpleUpdatedTree, path)).to.equal(
        getNodeAtPath(NARY_MEDIUM_TREE, path),
      );
    });
  });

  describe('createRemoveUpdate', () => {
    it('should fail on a path that leads to a leaf partway through', () => {
      // Path [0, 0] is invalid because node at [0] is leaf '1'
      expect(() => createRemoveUpdate(NARY_MEDIUM_TREE, [0, 0])).to.throw(
        Error,
      );
    });

    it('should remove a leaf and collapse its parent', () => {
      // Path to node '4' is [1, 1]
      const updatedTree = updateTree(NARY_MEDIUM_TREE, [
        createRemoveUpdate(NARY_MEDIUM_TREE, [1, 1]),
      ]);
      // The parent at path [1] should now be replaced by its single remaining child (which was at [1, 0])
      expect(getNodeAtPath(updatedTree, [1])).to.deep.equal(
        getNodeAtPath(NARY_MEDIUM_TREE, [1, 0]),
      );
    });

    it('should fail to remove root', () => {
      expect(() =>
        updateTree(NARY_MEDIUM_TREE, [
          createRemoveUpdate(NARY_MEDIUM_TREE, []),
        ]),
      ).to.throw(Error);
    });

    it('should fail to remove non-existant node', () => {
      expect(() =>
        updateTree(NARY_MEDIUM_TREE, [
          createRemoveUpdate(NARY_MEDIUM_TREE, [0, 0]),
        ]),
      ).to.throw(Error);
    });
  });

  describe('createDragToUpdates', () => {
    describe('drag leaf to unrelated leaf to create a SPLIT', () => {
      const updatedTree = updateTree(
        NARY_MEDIUM_TREE,
        createDragToUpdates(
          NARY_MEDIUM_TREE,
          [1, 0, 1], // Path to '3'
          [1, 1], // Path to '4'
          MosaicDropTargetPosition.RIGHT,
        ),
      );

      it('should make source parent a leaf', () => {
        // Parent of '3' (at [1, 0]) now becomes just '2'
        expect(getNodeAtPath(updatedTree, [1, 0])).to.equal(2);
      });

      it('should place source in a new split at the destination', () => {
        // The new path for '3' is inside the new split, at the 2nd position
        expect(getNodeAtPath(updatedTree, [1, 1, 1])).to.equal(3);
      });

      it('destination should be a sibling in the new split', () => {
        // Original '4' is now at the 1st position
        expect(getNodeAtPath(updatedTree, [1, 1, 0])).to.equal(4);
      });

      it('direction of the new split should be correct', () => {
        // The new parent at [1, 1] is a split node
        const newParent = getNodeAtPath(
          updatedTree,
          [1, 1],
        ) as MosaicSplitNode<number>;
        expect(newParent.type).to.equal('split');
        expect(newParent.direction).to.equal('row');
      });
    });

    describe('drag leaf to unrelated leaf to create TABS', () => {
      const updatedTree = updateTree(
        NARY_MEDIUM_TREE,
        createDragToUpdates(
          NARY_MEDIUM_TREE,
          [1, 0, 1], // Path to '3'
          [1, 1], // Path to '4'
          MosaicDropTargetPosition.CENTER, // Drop in the center to create a tab group
        ),
      );

      it('should make source parent a leaf', () => {
        // Parent of '3' (at [1, 0]) now becomes just '2'
        expect(getNodeAtPath(updatedTree, [1, 0])).to.equal(2);
      });

      it('destination should become a tab group', () => {
        const newParent = getNodeAtPath(
          updatedTree,
          [1, 1],
        ) as MosaicTabsNode<number>;
        expect(newParent.type).to.equal('tabs');
      });

      it('tab group should contain both the destination and source nodes', () => {
        const tabGroup = getNodeAtPath(
          updatedTree,
          [1, 1],
        ) as MosaicTabsNode<number>;
        expect(tabGroup.tabs).to.deep.equal([4, 3]);
      });
    });

    describe('drag leaf to root', () => {
      const updatedTree = updateTree(
        NARY_MEDIUM_TREE,
        createDragToUpdates(
          NARY_MEDIUM_TREE,
          [1, 1], // Path to '4'
          [], // Path to root
          MosaicDropTargetPosition.RIGHT,
        ),
      );

      it('should make the new root a split node', () => {
        const root = updatedTree as MosaicSplitNode<number>;
        expect(root.type).to.equal('split');
        expect(root.direction).to.equal('row');
      });

      it('should place the dragged node at the top level', () => {
        // The dragged node '4' is now the second child of the new root
        expect(getNodeAtPath(updatedTree, [1])).to.equal(4);
      });

      it('should place the original tree (pruned) as a sibling', () => {
        // The original tree (without '4') is now the first child
        const originalTreePruned = getNodeAtPath(updatedTree, [0]);
        // We expect node '4' to be gone from its original location
        expect(getNodeAtPath(originalTreePruned, [1, 1])).to.be.null;
      });
    });
  });
});
