import { Classes, HTMLSelect } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import classNames from 'classnames';
import update from 'immutability-helper';
import React from 'react';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

// eslint-disable-next-line @nx/enforce-module-boundaries
import packageJson from '../../../../libs/react-mosaic-component/package.json';

// Import new n-ary types and utilities
import {
  createBalancedTreeFromLeaves,
  getLeaves,
  Mosaic,
  MosaicNode,
  MosaicPath,
  MosaicSplitNode,
  MosaicZeroState,
} from '@lonli-lokli/react-mosaic-component';
import { CloseAdditionalControlsButton } from './toolbars';

// Import extracted components and types
import {
  ExampleWindow,
  EditableTabTitle,
  CustomTabButton,
} from '../components';
import { DemoAppState, THEMES, Theme } from '../types/demo-types';
import { findFirstLeafPath, createNode } from '../utils/demo-utils';

const version = packageJson.version;

const additionalControls = React.Children.toArray([
  <CloseAdditionalControlsButton />,
]);

export class DemoApp extends React.PureComponent<object, DemoAppState> {
  state: DemoAppState = {
    // The initial state now uses the new n-ary structure
    currentNode: {
      type: 'split',
      direction: 'row',
      splitPercentages: [40, 60], // Replaces `splitPercentage`
      children: [
        1,
        {
          type: 'split',
          direction: 'column',
          splitPercentages: [50, 50],
          children: [2, 3],
        },
      ],
    },
    currentTheme: 'Blueprint',
    editableTitles: {},
    dragInProgress: false,
    dragOverPath: null,
  };

  render() {
    return (
      <React.StrictMode>
        <div className="react-mosaic-example-app">
          {this.renderNavBar()}
          <Mosaic<number>
            // The `path` passed to renderTile is now MosaicPath (number[])
            renderTile={(count, path) => (
              <ExampleWindow
                count={count}
                path={path}
                onUpdateTitle={this.updateTitle}
                editableTitle={this.state.editableTitles[count]}
                dragInProgress={this.state.dragInProgress}
                onDragStart={this.onDragStart}
                onDragEnd={this.onDragEnd}
                onDragOver={() => this.onDragOver(path)}
              />
            )}
            zeroStateView={<MosaicZeroState />}
            initialValue={this.state.currentNode}
            onChange={this.onChange}
            onRelease={this.onRelease}
            createNode={createNode}
            className={THEMES[this.state.currentTheme]}
            blueprintNamespace="bp5"
            renderTabTitle={({tabKey}) => (
              <EditableTabTitle
                key={tabKey}
                tabKey={tabKey}
                title={this.state.editableTitles[tabKey] || `Window ${tabKey}`}
                onUpdateTitle={(newTitle) => this.updateTitle(tabKey, newTitle)}
              />
            )}
            canClose={(tabKey, tabs, index, path) => {
              // Example close logic:
              // - Tab 1 cannot be closed (protected)
              // - Tab 2 has no close button
              // - Other tabs can be closed normally
              // - If only one tab remains, it cannot be closed
              if (tabKey === 1) {
                return 'cannotClose'; // Protected tab
              }
              if (tabKey === 2) {
                return 'noClose'; // No close button
              }
              if (tabs.length <= 1) {
                return 'cannotClose'; // Last tab cannot be closed
              }
              return 'canClose'; // Normal tabs can be closed
            }}
            //renderTabButton={CustomTabButton} // Now enabled with custom tab buttons
          />
        </div>
      </React.StrictMode>
    );
  }

  private onChange = (currentNode: MosaicNode<number> | null) => {
    this.setState({ currentNode });
    console.log('Mosaic.onChange', currentNode);
  };

  private onRelease = (currentNode: MosaicNode<number> | null) => {
    console.log('Mosaic.onRelease():', currentNode);
  };

  private autoArrange = () => {
    const leaves = getLeaves(this.state.currentNode);
    this.setState({
      currentNode: createBalancedTreeFromLeaves(leaves),
    });
  };

  // This action now adds a new panel to the root, demonstrating the n-ary nature
  private addWindow = () => {
    const { currentNode } = this.state;
    const totalWindowCount = getLeaves(currentNode).length;
    const newWindow = totalWindowCount + 1;

    if (!currentNode) {
      this.setState({ currentNode: newWindow });
      return;
    }

    // Add the new window to the root split, or create a new root split
    let spec;
    if (typeof currentNode === 'object' && currentNode.type === 'split') {
      const numChildren = currentNode.children.length;
      spec = {
        children: { $push: [newWindow] },
        // Distribute space equally among all children
        splitPercentages: {
          $set: Array(numChildren + 1).fill(100 / (numChildren + 1)),
        },
      };
    } else {
      // Root is a single panel or a tab group, replace it with a split
      spec = {
        $set: {
          type: 'split',
          direction: 'row',
          splitPercentages: [50, 50],
          children: [currentNode, newWindow],
        } as MosaicSplitNode<number>,
      };
    }

    const newTree = update(currentNode, spec);
    this.setState({ currentNode: newTree });
  };

  // Handle editable titles
  private updateTitle = (panelId: number, newTitle: string) => {
    this.setState({
      editableTitles: {
        ...this.state.editableTitles,
        [panelId]: newTitle,
      },
    });
  };

  // Handle drag events for visual feedback
  private onDragStart = () => {
    this.setState({ dragInProgress: true });
  };

  private onDragEnd = () => {
    this.setState({ dragInProgress: false, dragOverPath: null });
  };

  private onDragOver = (path: MosaicPath) => {
    this.setState({ dragOverPath: path });
  };

  private renderNavBar() {
    return (
      <div className={classNames(Classes.NAVBAR, Classes.DARK)}>
        <div className={Classes.NAVBAR_GROUP}>
          <div className={Classes.NAVBAR_HEADING}>
            <a href="https://github.com/lonli-lokli/react-mosaic">
              react-mosaic <span className="version">v{version}</span>
            </a>
          </div>
        </div>
        <div className={classNames(Classes.NAVBAR_GROUP, Classes.BUTTON_GROUP)}>
          <label
            className={classNames(
              'theme-selection',
              Classes.LABEL,
              Classes.INLINE,
            )}
          >
            Theme:
            <HTMLSelect
              value={this.state.currentTheme}
              onChange={(e) =>
                this.setState({ currentTheme: e.currentTarget.value as Theme })
              }
            >
              {React.Children.toArray(
                Object.keys(THEMES).map((label) => (
                  <option key={label}>{label}</option>
                )),
              )}
            </HTMLSelect>
          </label>
          <div className="navbar-separator" />
          <span className="actions-label">Example Actions:</span>
          <button
            className={classNames(
              Classes.BUTTON,
              Classes.iconClass(IconNames.GRID_VIEW),
            )}
            onClick={this.autoArrange}
          >
            Auto Arrange
          </button>
          <button
            className={classNames(
              Classes.BUTTON,
              Classes.iconClass(IconNames.APPLICATION),
            )}
            onClick={this.addWindow}
          >
            Add Window
          </button>
          <a
            className="github-link"
            href="https://github.com/lonli-lokli/react-mosaic"
          >
            <img title="Github Link" src="./GitHub-Mark-Light-32px.png" />
          </a>
        </div>
      </div>
    );
  }
}
