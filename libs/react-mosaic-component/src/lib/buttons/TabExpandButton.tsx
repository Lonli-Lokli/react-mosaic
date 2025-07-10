import classNames from 'classnames';
import React from 'react';

import { MosaicContext } from '../contextTypes';
import { MosaicKey, MosaicPath } from '../types';
import { OptionalBlueprint } from '../util/OptionalBlueprint';
import { DefaultToolbarButton, MosaicButtonProps } from './MosaicButton';

export interface TabExpandButtonProps extends MosaicButtonProps {
  path: MosaicPath;
}

export class TabExpandButton extends React.PureComponent<TabExpandButtonProps> {
  static contextType = MosaicContext;
  declare context: React.ContextType<typeof MosaicContext>;

  render() {
    return (
      <DefaultToolbarButton
        title="Expand Tab Group"
        className={classNames(
          'expand-button',
          OptionalBlueprint.getIconClass(
            this.context.blueprintNamespace,
            'MAXIMIZE',
          ),
        )}
        onClick={this.expand}
      />
    );
  }

  private expand = () => {
    const { mosaicActions } = this.context;
    const { path } = this.props;

    mosaicActions.expand(path);

    if (this.props.onClick) {
      this.props.onClick();
    }
  };
}
