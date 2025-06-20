import React from 'react';
import { useDrag, DragSourceMonitor } from 'react-dnd';
import { isEqual } from 'lodash-es';
import { MosaicKey, MosaicTabsNode, MosaicPath, MosaicDragType } from './types';
import { MosaicDragItem, MosaicDropData } from './internalTypes';
import { createDragToUpdates } from './util/mosaicUpdates';
import { getNodeAtPath, isTabsNode } from './util/mosaicUtilities';
import { MosaicRootActions } from './contextTypes';

export interface DraggableTabProps<T extends MosaicKey> {
  tabKey: T;
  tabIndex: number;
  tabContainerPath: MosaicPath;
  mosaicActions: MosaicRootActions<T>;
  mosaicId: string;
  children: (dragProps: {
    isDragging: boolean;
    connectDragSource: (
      element: React.ReactElement,
    ) => React.ReactElement | null;
    connectDragPreview: (
      element: React.ReactElement,
    ) => React.ReactElement | null;
  }) => React.ReactElement;
}

/**
 * A draggable tab component that uses render props pattern
 * Works with both class and functional components
 */
export const DraggableTab = <T extends MosaicKey>({
  tabKey,
  tabIndex,
  tabContainerPath,
  mosaicActions,
  mosaicId,
  children,
}: DraggableTabProps<T>) => {
  const tabPath = tabContainerPath.concat(tabIndex);

  const [{ isDragging }, connectDragSource, connectDragPreview] = useDrag({
    type: MosaicDragType.WINDOW,
    item: (): MosaicDragItem => {
      const hideTimer = window.setTimeout(() => {
        mosaicActions.hide(tabPath, true); // suppressOnChange = true for drag operations
      }, 50);
      return {
        mosaicId,
        hideTimer,
        // Add additional properties for tab reordering
        isTab: true,
        tabIndex,
        tabKey,
        tabContainerPath,
      };
    },
    end: (item: MosaicDragItem, monitor: DragSourceMonitor) => {
      window.clearTimeout(item.hideTimer);
      const dropResult = monitor.getDropResult<MosaicDropData>();
      const didDrop = monitor.didDrop();

      const ownPath = tabPath;
      const tabReorderIndex = dropResult?.tabReorderIndex;

      // Check if this is a tab reorder operation (same container)
      const isTabReorder =
        tabReorderIndex !== undefined &&
        dropResult?.path &&
        isEqual(dropResult.path, tabContainerPath);

      // Check if this is a tab being dropped into a different tab container
      const isTabToTabContainer =
        tabReorderIndex !== undefined &&
        dropResult?.path &&
        !isEqual(dropResult.path, tabContainerPath);

      // Check if this is a self-drop (dragging from a tab container back to itself, but not reordering)
      const isSelfDrop =
        dropResult?.path &&
        isEqual(dropResult.path, tabContainerPath) &&
        tabReorderIndex === undefined;

      // Check if this is a child drop (dragging to a descendant)
      const isChildDrop =
        dropResult?.path &&
        dropResult.path.length > ownPath.length &&
        isEqual(dropResult.path.slice(0, ownPath.length), ownPath);

      if (!didDrop || !dropResult || isChildDrop) {
        // Re-show the window if the drop was cancelled or invalid
        mosaicActions.show(ownPath, true); // suppressOnChange = true for drag operations
        return;
      }

      if (isTabReorder) {
        // Handle tab reordering within the same container
        // Get the current tabs node from the tree
        const root = mosaicActions.getRoot();
        const tabsNode = getNodeAtPath(
          root,
          tabContainerPath,
        ) as MosaicTabsNode<T>;

        if (tabsNode && isTabsNode(tabsNode)) {
          const currentTabs = [...tabsNode.tabs];
          const currentActiveTabIndex = tabsNode.activeTabIndex;

          const [movedTab] = currentTabs.splice(tabIndex, 1);
          currentTabs.splice(tabReorderIndex, 0, movedTab);

          // Calculate new active tab index
          let newActiveTabIndex = currentActiveTabIndex;
          if (tabIndex === currentActiveTabIndex) {
            // The active tab was moved
            newActiveTabIndex = tabReorderIndex;
          } else if (
            tabIndex < currentActiveTabIndex &&
            tabReorderIndex >= currentActiveTabIndex
          ) {
            // A tab before the active tab was moved to after it
            newActiveTabIndex = currentActiveTabIndex - 1;
          } else if (
            tabIndex > currentActiveTabIndex &&
            tabReorderIndex <= currentActiveTabIndex
          ) {
            // A tab after the active tab was moved to before it
            newActiveTabIndex = currentActiveTabIndex + 1;
          }

          mosaicActions.updateTree([
            {
              path: tabContainerPath,
              spec: {
                tabs: { $set: currentTabs },
                activeTabIndex: { $set: newActiveTabIndex },
              },
            },
          ]);
        } else {
          console.warn('Could not find tabs node at path:', tabContainerPath);
        }
        return;
      }

      if (isTabToTabContainer) {
        // Handle tab being dropped into a different tab container
        const root = mosaicActions.getRoot();
        const destinationTabsNode = getNodeAtPath(
          root,
          dropResult.path!,
        ) as MosaicTabsNode<T>;

        if (destinationTabsNode && isTabsNode(destinationTabsNode)) {
          // Get the source tabs container to calculate the new active index
          const sourceTabsNode = getNodeAtPath(
            root,
            tabContainerPath,
          ) as MosaicTabsNode<T>;

          // First, remove the tab from the source container
          const currentSourceTabs = [...sourceTabsNode.tabs];
          currentSourceTabs.splice(tabIndex, 1);
          const removeUpdates = [
            {
              path: tabContainerPath,
              spec: {
                tabs: { $set: currentSourceTabs },
                activeTabIndex: {
                  $set: Math.max(
                    0,
                    Math.min(tabIndex, sourceTabsNode.tabs.length - 2),
                  ),
                },
              },
            },
          ];

          // Then, insert the tab into the destination container at the specified index
          const currentDestinationTabs = [...destinationTabsNode.tabs];
          currentDestinationTabs.splice(tabReorderIndex, 0, tabKey);

          const insertUpdates = [
            {
              path: dropResult.path!,
              spec: {
                tabs: { $set: currentDestinationTabs },
                activeTabIndex: { $set: tabReorderIndex }, // Make the newly inserted tab active
              },
            },
          ];

          // Apply both updates
          mosaicActions.updateTree([...removeUpdates, ...insertUpdates]);
        } else {
          console.warn(
            'Could not find destination tabs node at path:',
            dropResult.path,
          );
        }
        return;
      }

      if (isSelfDrop) {
        // This is a self-drop but not a reorder - don't allow it
        mosaicActions.show(ownPath, true); // suppressOnChange = true for drag operations
        return;
      }

      // Handle normal drops (moving to different containers)
      const updates = createDragToUpdates(
        mosaicActions.getRoot()!,
        ownPath,
        dropResult.path!,
        dropResult.position === undefined
          ? {
              type: 'tab-container',
            }
          : { type: 'split', position: dropResult.position },
      );
      mosaicActions.updateTree(updates);
    },
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return children({
    isDragging,
    connectDragSource,
    connectDragPreview,
  });
};
