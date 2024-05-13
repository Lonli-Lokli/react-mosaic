import { describe, expect, it } from 'vitest';

import { BoundingBox, emptyBoundingBox, splitBoundingBox } from './BoundingBox';

// Yay javascript float precision
function expectBoundingBoxCloseTo(
  a: BoundingBox,
  b: BoundingBox,
  delta = 0.000001,
) {
  expect(a.top).to.be.closeTo(b.top, delta);
  expect(a.right).to.be.closeTo(b.right, delta);
  expect(a.bottom).to.be.closeTo(b.bottom, delta);
  expect(a.left).to.be.closeTo(b.left, delta);
}

describe('BoundingBox', () => {
  describe('Root', () => {
    const EMPTY = emptyBoundingBox();

    it('should perform a binary split on a column', () => {
      const [first, second] = splitBoundingBox(EMPTY, [25, 75], 'column');
      expectBoundingBoxCloseTo(first, {
        top: 0,
        right: 0,
        bottom: 75,
        left: 0,
      });
      expectBoundingBoxCloseTo(second, {
        top: 25,
        right: 0,
        bottom: 0,
        left: 0,
      });
    });

    it('should perform a binary split on a row', () => {
      const [first, second] = splitBoundingBox(EMPTY, [25, 75], 'row');
      expectBoundingBoxCloseTo(first, {
        top: 0,
        right: 75,
        bottom: 0,
        left: 0,
      });
      expectBoundingBoxCloseTo(second, {
        top: 0,
        right: 0,
        bottom: 0,
        left: 25,
      });
    });

    it('should perform an n-ary split on a column', () => {
      const [first, second, third] = splitBoundingBox(
        EMPTY,
        [20, 50, 30],
        'column',
      );
      expectBoundingBoxCloseTo(first, {
        top: 0,
        right: 0,
        bottom: 80,
        left: 0,
      });
      expectBoundingBoxCloseTo(second, {
        top: 20,
        right: 0,
        bottom: 30,
        left: 0,
      });
      expectBoundingBoxCloseTo(third, {
        top: 70,
        right: 0,
        bottom: 0,
        left: 0,
      });
    });

    it('should perform an n-ary split on a row', () => {
      const [first, second, third] = splitBoundingBox(
        EMPTY,
        [20, 50, 30],
        'row',
      );
      expectBoundingBoxCloseTo(first, {
        top: 0,
        right: 80,
        bottom: 0,
        left: 0,
      });
      expectBoundingBoxCloseTo(second, {
        top: 0,
        right: 30,
        bottom: 0,
        left: 20,
      });
      expectBoundingBoxCloseTo(third, {
        top: 0,
        right: 0,
        bottom: 0,
        left: 70,
      });
    });
  });

  describe('Complex', () => {
    // A box with 100/6 % margin on all sides
    // Has a total width and height of 100 - 2 * (100/6) = 200/3
    const COMPLEX = {
      top: 100 / 6,
      right: 100 / 6,
      bottom: 100 / 6,
      left: 100 / 6,
    };

    it('should perform a binary split on a column', () => {
      const [first, second] = splitBoundingBox(COMPLEX, [25, 75], 'column');
      expectBoundingBoxCloseTo(first, {
        top: 100 / 6,
        right: 100 / 6,
        bottom: 100 / 6 + (200 / 3) * 0.75, // parentBottom + 75% of parentHeight
        left: 100 / 6,
      });
      expectBoundingBoxCloseTo(second, {
        top: 100 / 6 + (200 / 3) * 0.25, // parentTop + 25% of parentHeight
        right: 100 / 6,
        bottom: 100 / 6,
        left: 100 / 6,
      });
    });

    it('should perform an n-ary split on a column', () => {
      const [first, second, third] = splitBoundingBox(
        COMPLEX,
        [10, 60, 30],
        'column',
      );
      const parentHeight = 200 / 3;
      expectBoundingBoxCloseTo(first, {
        top: 100 / 6,
        right: 100 / 6,
        bottom: 100 / 6 + parentHeight * 0.9,
        left: 100 / 6,
      });
      expectBoundingBoxCloseTo(second, {
        top: 100 / 6 + parentHeight * 0.1,
        right: 100 / 6,
        bottom: 100 / 6 + parentHeight * 0.3,
        left: 100 / 6,
      });
      expectBoundingBoxCloseTo(third, {
        top: 100 / 6 + parentHeight * 0.7,
        right: 100 / 6,
        bottom: 100 / 6,
        left: 100 / 6,
      });
    });
  });
});
