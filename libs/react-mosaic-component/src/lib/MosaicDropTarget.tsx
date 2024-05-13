import React from 'react';
import classNames from 'classnames';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import { MosaicDragType, MosaicPath } from './types';
import { MosaicDropTargetPosition } from './internalTypes';
import { MosaicContext } from './contextTypes';

export interface MosaicDropTargetProps {
  path: MosaicPath;
  position: MosaicDropTargetPosition;
}

export const MosaicDropTarget = ({ path, position }: MosaicDropTargetProps) => {
  const { mosaicId } = React.useContext(MosaicContext);
  const [{ isOver, draggedMosaicId }, connectDropTarget] = useDrop({
    accept: MosaicDragType.WINDOW,
    drop: () => ({
      path,
      position,
    }),
    collect: (monitor: DropTargetMonitor<{ mosaicId: string }>) => ({
      isOver: monitor.isOver(),
      draggedMosaicId: monitor.getItem()?.mosaicId,
    }),
  });

  return connectDropTarget(
    <div
      className={classNames('drop-target', position, {
        'drop-target-hover': isOver && draggedMosaicId === mosaicId,
      })}
    />,
  );
};