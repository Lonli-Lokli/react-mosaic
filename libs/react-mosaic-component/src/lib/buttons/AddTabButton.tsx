import classNames from 'classnames';
import { noop } from 'lodash-es';
import React from 'react';

import { MosaicWindowContext } from '../contextTypes';
import { OptionalBlueprint } from '../util/OptionalBlueprint';
import { DefaultToolbarButton, MosaicButtonProps } from './MosaicButton';

export class AddTabButton extends React.PureComponent<MosaicButtonProps> {
  static contextType = MosaicWindowContext;
  declare context: React.ContextType<typeof MosaicWindowContext>;

  render() {
    return (
      <DefaultToolbarButton
        title="Add Tab"
        className={classNames(
          'add-tab-button',
          OptionalBlueprint.getIconClass(
            this.context.blueprintNamespace,
            'ADD_COLUMN_RIGHT',
          ),
        )}
        onClick={this.addTab}
      />
    );
  }

  private addTab = () => {
    this.context.mosaicWindowActions
      .addTab()
      .then(() => {
        if (this.props.onClick) {
          this.props.onClick();
        }
      })
      .catch(noop); // Swallow rejections (i.e. on user cancel)
  };
}
