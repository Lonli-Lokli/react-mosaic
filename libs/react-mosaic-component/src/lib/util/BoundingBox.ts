import { MosaicDirection } from '../types';
import { assertNever } from './assertNever';

/**
 * Each of these values is like the CSS property of the same name, but in percentages.
 * A BoundingBox of { top: 0, right: 0, bottom: 0, left: 0 } represents the entire viewport.
 */
export interface BoundingBox {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

/**
 * Returns an "empty" BoundingBox that covers the entire viewport.
 */
export function emptyBoundingBox(): BoundingBox {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  };
}

/**
 * Represents the CSS styles for a BoundingBox.
 */
export interface BoundingBoxStyles {
  top: string;
  right: string;
  bottom: string;
  left: string;
}

/**
 * Splits a BoundingBox into N sub-boxes based on an array of percentages.
 *
 * @param box The parent BoundingBox to split.
 * @param percentages An array of numbers (0-100) that must sum to 100.
 * @param direction The direction to split in.
 * @returns An array of BoundingBox objects.
 */
export function splitBoundingBox(
  box: BoundingBox,
  percentages: number[],
  direction: MosaicDirection,
): BoundingBox[] {
  const results: BoundingBox[] = [];
  let currentOffset = 0;

  for (const percentage of percentages) {
    const newBox = { ...box };

    switch (direction) {
      case 'row': {
        const totalWidth = 100 - box.left - box.right;
        // The left side of the new box is the parent's left plus the accumulated offset
        newBox.left = box.left + (totalWidth * currentOffset) / 100;
        // The right side is calculated from the remaining space
        newBox.right =
          box.right + (totalWidth * (100 - (currentOffset + percentage))) / 100;
        break;
      }
      case 'column': {
        const totalHeight = 100 - box.top - box.bottom;
        // The top side of the new box is the parent's top plus the accumulated offset
        newBox.top = box.top + (totalHeight * currentOffset) / 100;
        // The bottom side is calculated from the remaining space
        newBox.bottom =
          box.bottom +
          (totalHeight * (100 - (currentOffset + percentage))) / 100;
        break;
      }
      default:
        assertNever(direction);
    }

    results.push(newBox);
    currentOffset += percentage;
  }

  return results;
}

/**
 * Converts a BoundingBox to a set of CSS styles.
 */
export function boundingBoxAsStyles({
  top,
  right,
  bottom,
  left,
}: BoundingBox): BoundingBoxStyles {
  return {
    top: `${top}%`,
    right: `${right}%`,
    bottom: `${bottom}%`,
    left: `${left}%`,
  };
}

/**
 * Converts a percentage relative to a bounding box to a percentage relative to the viewport.
 * This is used by the `Split` component to calculate its absolute CSS `left` or `top` style.
 *
 * @param boundingBox The container the percentage is relative to.
 * @param relativeSplitPercentage The percentage (0-100) within the container.
 * @param direction The direction of the split.
 * @returns The absolute percentage (0-100) relative to the viewport.
 */
export function getAbsoluteSplitPercentage(
  boundingBox: BoundingBox,
  relativeSplitPercentage: number,
  direction: MosaicDirection,
): number {
  const { top, right, bottom, left } = boundingBox;
  if (direction === 'column') {
    const height = 100 - top - bottom;
    return (height * relativeSplitPercentage) / 100 + top;
  } else if (direction === 'row') {
    const width = 100 - right - left;
    return (width * relativeSplitPercentage) / 100 + left;
  } else {
    return assertNever(direction);
  }
}

/**
 * Converts a percentage relative to the viewport (e.g., a mouse coordinate)
 * to a percentage relative to a bounding box.
 * This is used by the `Split` component to calculate the new relative percentage during a drag.
 *
 * @param boundingBox The container to make the percentage relative to.
 * @param absoluteSplitPercentage The absolute percentage (0-100) from the viewport.
 * @param direction The direction of the split.
 * @returns The percentage (0-100) relative to the given boundingBox.
 */
export function getRelativeSplitPercentage(
  boundingBox: BoundingBox,
  absoluteSplitPercentage: number,
  direction: MosaicDirection,
): number {
  const { top, right, bottom, left } = boundingBox;
  if (direction === 'column') {
    const height = 100 - top - bottom;
    // Prevent division by zero if the box has no height
    if (height === 0) return 0;
    return ((absoluteSplitPercentage - top) / height) * 100;
  } else if (direction === 'row') {
    const width = 100 - right - left;
    // Prevent division by zero if the box has no width
    if (width === 0) return 0;
    return ((absoluteSplitPercentage - left) / width) * 100;
  } else {
    return assertNever(direction);
  }
}
