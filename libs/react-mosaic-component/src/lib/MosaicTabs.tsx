import React from 'react';
import classNames from 'classnames';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { isEqual } from 'lodash-es';
import {
  MosaicKey,
  MosaicTabsNode,
  MosaicPath,
  TileRenderer,
  TabToolbarRenderer,
  MosaicDragType,
} from './types';
import { BoundingBox, boundingBoxAsStyles } from './util/BoundingBox';
import { MosaicContext, MosaicRootActions } from './contextTypes';
import { MosaicDragItem, MosaicDropData } from './internalTypes';
import { updateTree } from './util/mosaicUpdates';
import { normalizeMosaicTree } from './util/mosaicUtilities';
import { DraggableTab } from './DraggableTab';
import { createDefaultTabsControls } from './buttons/defaultToolbarControls';

export interface MosaicTabsProps<T extends MosaicKey> {
  node: MosaicTabsNode<T>;
  path: MosaicPath;
  renderTile: TileRenderer<T>;
  renderTabToolbar?: TabToolbarRenderer<T>;
  boundingBox: BoundingBox;
  renderTabTitle?: (tabKey: T, path: MosaicPath) => React.ReactNode;
  renderTabButton?: (props: {
    tabKey: T;
    index: number;
    isActive: boolean;
    path: MosaicPath;
    mosaicId: string;
    onTabClick: () => void;
    mosaicActions: MosaicRootActions<T>;
    renderTabTitle?: (tabKey: T, path: MosaicPath) => React.ReactNode;
  }) => React.ReactElement;
  tabToolbarControls?: React.ReactNode;
}

// Default tab button using DraggableTab with professional styling
const DefaultTabButton = <T extends MosaicKey>({
  tabKey,
  index,
  isActive,
  path,
  mosaicId,
  onTabClick,
  mosaicActions,
  renderTabTitle = (tabKey) => `Tab ${tabKey}`,
}: {
  tabKey: T;
  index: number;
  isActive: boolean;
  path: MosaicPath;
  mosaicId: string;
  onTabClick: () => void;
  mosaicActions: MosaicRootActions<T>;
  renderTabTitle?: (tabKey: T, path: MosaicPath) => React.ReactNode;
}) => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <DraggableTab
      tabKey={tabKey}
      tabIndex={index}
      tabContainerPath={path}
      mosaicActions={mosaicActions}
      mosaicId={mosaicId}
    >
      {({ isDragging, connectDragSource, connectDragPreview }) => {
        const element = (
          <button
            ref={buttonRef}
            className={classNames('mosaic-tab-button', {
              '-active': isActive,
              '-dragging': isDragging,
            })}
            onClick={onTabClick}
            title={`${tabKey}`}
          >
            {renderTabTitle(tabKey, path)}
          </button>
        );

        const previewElement = connectDragPreview(element);
        return connectDragSource(previewElement || element) || element;
      }}
    </DraggableTab>
  );
};

// Drop target for tab reordering within the tab bar
const TabDropTarget = <T extends MosaicKey>({
  tabContainerPath,
  insertIndex,
}: {
  tabContainerPath: MosaicPath;
  insertIndex: number;
  mosaicActions: MosaicRootActions<T>;
  mosaicId: string;
}) => {
  const [{ isOver, canDrop, draggedMosaicId }, connectDropTarget] = useDrop({
    accept: MosaicDragType.WINDOW,
    canDrop: (item: MosaicDragItem) => {
      // Allow both tab reordering and external drops
      const isTabReorder =
        item?.isTab &&
        item?.tabContainerPath &&
        isEqual(item.tabContainerPath, tabContainerPath);
      const isExternalDrop =
        !item?.isTab || !isEqual(item.tabContainerPath, tabContainerPath);
      const shouldAccept = isTabReorder || isExternalDrop;

      return shouldAccept;
    },
    drop: (): MosaicDropData => {
      return {
        path: tabContainerPath,
        position: undefined,
        // Custom property to indicate this is a tab reorder operation
        tabReorderIndex: insertIndex,
      };
    },
    hover: () => {
      // Hover handling for tab reordering
    },
    collect: (monitor: DropTargetMonitor<MosaicDragItem>) => {
      const result = {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
        draggedMosaicId: monitor.getItem()?.mosaicId,
      };

      return result;
    },
  });

  // Check if any item is being dragged
  const isDragging = draggedMosaicId != null;

  return connectDropTarget(
    <div
      className={classNames('tab-drop-target', {
        'tab-drop-target-hover': isOver,
        dragging: isDragging,
      })}
    >
      {/* Drop indicator */}
      {isOver ? (
        // Show placeholder when hovering during drag
        <div className="tab-drop-placeholder">
          <div className="tab-drop-arrow" />
          ``
        </div>
      ) : (
        // Subtle indicator when not hovering
        <div
          className={classNames('tab-drop-indicator', {
            'can-drop': canDrop,
            default: !canDrop,
          })}
        />
      )}
    </div>,
  );
};

export const MosaicTabs = <T extends MosaicKey>({
  node,
  path,
  renderTile,
  renderTabToolbar,
  boundingBox,
  renderTabTitle,
  renderTabButton,
  tabToolbarControls = createDefaultTabsControls(path)
}: MosaicTabsProps<T>) => {
  const { mosaicActions, mosaicId } = React.useContext<MosaicContext<T>>(
    MosaicContext as any,
  );
  const { tabs, activeTabIndex } = node;


  // Drop target for the tab content area - blocks individual window drop targets
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, connectDropTarget] = useDrop({
    accept: MosaicDragType.WINDOW,
    canDrop: () => {
      // Never accept drops - this is just to block individual window drop targets from showing
      return false;
    },
    collect: (monitor: DropTargetMonitor<MosaicDragItem>) => ({
      isOver: monitor.isOver({ shallow: true }),
      draggedMosaicId: monitor.getItem()?.mosaicId,
    }),
  });

  // Drop target for the tab bar area to handle external drops
  const [
    { isOver: isTabBarOver, draggedMosaicId: tabBarDraggedMosaicId },
    connectTabBarDropTarget,
  ] = useDrop({
    accept: MosaicDragType.WINDOW,
    canDrop: (_item: MosaicDragItem, monitor) => {
      // Accept drops that are directly over the tab bar and not being handled by TabDropTarget
      return monitor.isOver({ shallow: true });
    },
    drop: (): MosaicDropData => {
      return {
        path,
        position: undefined, // No position needed - always add as new tab
      };
    },
    collect: (monitor: DropTargetMonitor<MosaicDragItem>) => ({
      isOver: monitor.isOver({ shallow: true }),
      draggedMosaicId: monitor.getItem()?.mosaicId,
    }),
  });

  const onTabClick = (index: number) => {
    if (index === activeTabIndex) {
      return;
    }
    mosaicActions.updateTree([
      {
        path,
        spec: { activeTabIndex: { $set: index } },
      },
    ]);
  };

  const addTab = () => {
    if (mosaicActions.createNode == null) {
      throw new Error(
        'Operation invalid unless `createNode` is defined on Mosaic',
      );
    }
    Promise.resolve(mosaicActions.createNode()).then((newNode) => {
      if (typeof newNode !== 'string' && typeof newNode !== 'number') {
        console.error(
          'createNode() for adding a tab should return a MosaicKey (string or number).',
        );
        return;
      }

      // Update tree and normalize
      const updates = [
        {
          path, // The path to this tabs node
          spec: {
            tabs: { $push: [newNode] },
            // Set the new tab as active. Its index is the original length of the array.
            activeTabIndex: { $set: tabs.length },
          },
        },
      ];

      let newTree = mosaicActions.getRoot();
      if (!newTree) return;

      updates.forEach((update) => {
        newTree = updateTree(newTree!, [update]);
      });

      const normalizedTree = normalizeMosaicTree(newTree);
      mosaicActions.replaceWith([], normalizedTree!);
    });
  };

  const renderDefaultToolbar = () =>
    connectTabBarDropTarget(
      <div
        className={classNames('mosaic-tab-bar', {
          'tab-bar-drop-target-hover':
            isTabBarOver && tabBarDraggedMosaicId === mosaicId,
        })}
      >
        {/* Left section: tabs and add button */}
        <div className="mosaic-tab-bar-tabs">
          {/* Drop target at the beginning */}
          <TabDropTarget
            tabContainerPath={path}
            insertIndex={0}
            mosaicActions={mosaicActions}
            mosaicId={mosaicId}
          />

          {tabs.map((tabKey, index) => {
            const TabButtonComponent = renderTabButton || DefaultTabButton;
            return (
              <React.Fragment key={tabKey}>
                <TabButtonComponent
                  tabKey={tabKey}
                  index={index}
                  isActive={index === activeTabIndex}
                  path={path}
                  mosaicId={mosaicId}
                  onTabClick={() => onTabClick(index)}
                  mosaicActions={mosaicActions}
                  renderTabTitle={renderTabTitle}
                />

                {/* Drop target after each tab */}
                <TabDropTarget
                  tabContainerPath={path}
                  insertIndex={index + 1}
                  mosaicActions={mosaicActions}
                  mosaicId={mosaicId}
                />
              </React.Fragment>
            );
          })}

          <button
            className="mosaic-tab-add-button"
            onClick={addTab}
            aria-label="Add new tab"
            title="Add new tab"
          >
            +
          </button>
        </div>

        {/* Right section: toolbar controls */}
        <div className="mosaic-tab-toolbar-controls">
          {tabToolbarControls}
        </div>
      </div>,
    );

  const activeTabKey = tabs[activeTabIndex];
  const tilePath = path.concat(activeTabIndex);

  return (
    // This is the container for the entire tab group.
    // Its position and size are determined ONLY by the boundingBox.
    <div
      className="mosaic-tabs-container"
      style={boundingBoxAsStyles(boundingBox)}
    >
      {/* Use the custom toolbar renderer if provided, otherwise use our default */}
      {renderTabToolbar
        ? renderTabToolbar({
            tabs,
            activeTabIndex,
            path,
            DraggableTab: (props) => (
              <DraggableTab
                {...props}
                tabContainerPath={path}
                mosaicActions={mosaicActions}
                mosaicId={mosaicId}
              />
            ),
          })
        : renderDefaultToolbar()}

      {connectDropTarget(
        <div className="mosaic-tile">{renderTile(activeTabKey, tilePath)}</div>,
      )}
    </div>
  );
};
