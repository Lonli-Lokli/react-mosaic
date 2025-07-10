import classNames from 'classnames';
import React from 'react';

import { MosaicContext } from '../contextTypes';
import { MosaicKey, MosaicPath } from '../types';
import { OptionalBlueprint } from '../util/OptionalBlueprint';
import { DefaultToolbarButton, MosaicButtonProps } from './MosaicButton';

export interface TabRemoveButtonProps extends MosaicButtonProps {
  path: MosaicPath;
}

export class TabRemoveButton extends React.PureComponent<TabRemoveButtonProps> {
  static contextType = MosaicContext;
  declare context: React.ContextType<typeof MosaicContext>;

  render() {
    return (
      <DefaultToolbarButton
        title="Close Tab Group"
        className={classNames(
          'close-button',
          OptionalBlueprint.getIconClass(
            this.context.blueprintNamespace,
            'CROSS',
          ),
        )}
        onClick={this.remove}
      />
    );
  }

  private remove = () => {
    const { mosaicActions } = this.context;
    const { path } = this.props;

    mosaicActions.remove(path);

    if (this.props.onClick) {
      this.props.onClick();
    }
  };
}
