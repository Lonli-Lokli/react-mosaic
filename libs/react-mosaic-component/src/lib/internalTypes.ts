import { MosaicPath } from './types';

export type MosaicDropTargetPosition =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right';
export const MosaicDropTargetPosition = {
  TOP: 'top' as const,
  BOTTOM: 'bottom' as const,
  LEFT: 'left' as const,
  RIGHT: 'right' as const,
};

export interface MosaicDropData {
  path?: MosaicPath;
  position?: MosaicDropTargetPosition;
  tabReorderIndex?: number; // For tab reordering within the same container
}

export interface MosaicDragItem {
  mosaicId: string;
  hideTimer: number;
  // Additional properties for tab reordering
  isTab?: boolean;
  tabIndex?: number;
  tabKey?: string | number;
  tabContainerPath?: MosaicPath;
}

// Union type for different drop scenarios
export type DropInfo = 
  | { type: 'split', position: MosaicDropTargetPosition }
  | { type: 'tab-container' }
  | { type: 'tab-reorder', insertIndex: number };