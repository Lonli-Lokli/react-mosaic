import classNames from 'classnames';
import React from 'react';
import { ConnectDragSource } from 'react-dnd';

import { MosaicContext } from '../contextTypes';
import { OptionalBlueprint } from '../util/OptionalBlueprint';

export interface TabDragButtonProps {
  connectDragSource: ConnectDragSource;
}

export class TabDragButton extends React.PureComponent<TabDragButtonProps> {
  static contextType = MosaicContext;
  declare context: React.ContextType<typeof MosaicContext>;

  render() {
    return this.props.connectDragSource(
      <button
        title="Drag to move"
        className={classNames(
          'mosaic-default-control',
          'mosaic-tab-drag-button',
          OptionalBlueprint.getClasses(this.context.blueprintNamespace, 'BUTTON', 'MINIMAL', 'SMALL'),
          OptionalBlueprint.getIconClass(this.context.blueprintNamespace, 'DRAG_HANDLE_VERTICAL'),
        )}
      />,
    );
  }
}
