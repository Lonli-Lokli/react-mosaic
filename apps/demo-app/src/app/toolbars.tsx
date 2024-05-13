import { Classes } from '@blueprintjs/core';
import { MosaicWindowContext } from '@lonli-lokli/react-mosaic-component';
import classNames from 'classnames';
import React from 'react';

export class CloseAdditionalControlsButton extends React.PureComponent {
  static contextType = MosaicWindowContext;
  declare context: React.ContextType<typeof MosaicWindowContext>;

  render() {
    return (
      <div className={classNames(Classes.BUTTON_GROUP, Classes.MINIMAL)}>
        <button
          onClick={() =>
            this.context.mosaicWindowActions.setAdditionalControlsOpen(false)
          }
          className={Classes.BUTTON}
        >
          Proof of Concept Button!
        </button>
      </div>
    );
  }
}
