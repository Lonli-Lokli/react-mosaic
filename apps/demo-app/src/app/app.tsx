import { Button, Classes, HTMLSelect } from '@blueprintjs/core';
import { IconNames } from '@blueprintjs/icons';
import classNames from 'classnames';
import update from 'immutability-helper';
import React from 'react';
import '@blueprintjs/core/lib/css/blueprint.css';
import '@blueprintjs/icons/lib/css/blueprint-icons.css';

// Import new n-ary types and utilities
import {
  createBalancedTreeFromLeaves,
  getLeaves,
  Mosaic,
  MosaicNode,
  MosaicPath, // Path is now number[]
  MosaicSplitNode, // New type for splits
  MosaicWindow,
  MosaicZeroState,
  MosaicWindowContext,
  AddTabButton,
  RemoveButton,
} from '@lonli-lokli/react-mosaic-component';
import { CloseAdditionalControlsButton } from './toolbars';

// tslint:disable no-console

// tslint:disable-next-line no-var-requires
// tslint:disable-next-line no-var-requires
const version = '11'; //require('../package.json');

export const THEMES = {
  ['Blueprint']: 'mosaic-blueprint-theme',
  ['Blueprint Dark']: classNames('mosaic-blueprint-theme', Classes.DARK),
  ['None']: '',
};

export type Theme = keyof typeof THEMES;

const additionalControls = React.Children.toArray([
  <CloseAdditionalControlsButton />,
]);

const EMPTY_ARRAY: any[] = [];

export interface DemoAppState {
  currentNode: MosaicNode<number> | null;
  currentTheme: Theme;
}

// Helper to find the path to the first leaf node in the tree
const findFirstLeafPath = (node: MosaicNode<number> | null): MosaicPath => {
  if (node === null || typeof node === 'number') {
    return [];
  }
  if (node.type === 'split') {
    return [0, ...findFirstLeafPath(node.children[0])];
  }
  if (node.type === 'tabs') {
    return [
      node.activeTabIndex,
      ...findFirstLeafPath(node.tabs[node.activeTabIndex]),
    ];
  }
  return [];
};

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
  };

  render() {
    return (
      <React.StrictMode>
        <div className="react-mosaic-example-app">
          {this.renderNavBar()}
          <Mosaic<number>
            // The `path` passed to renderTile is now MosaicPath (number[])
            renderTile={(count, path) => (
              <ExampleWindow count={count} path={path} />
            )}
            zeroStateView={<MosaicZeroState />}
            initialValue={this.state.currentNode}
            onChange={this.onChange}
            onRelease={this.onRelease}
            createNode={createNode}
            className={THEMES[this.state.currentTheme]}
            blueprintNamespace="bp5"
            renderTabTitle={(tabKey, path) => (
              <span style={{ color: '#007ACC', fontWeight: 'bold' }}>
                📋 Window {tabKey}
              </span>
            )}
            // renderTabButton={CustomTabButton} // Uncomment to use custom tab buttons
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
    // This utility still works as intended
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

  private renderNavBar() {
    return (
      <div className={classNames(Classes.NAVBAR, Classes.DARK)}>
        <div className={Classes.NAVBAR_GROUP}>
          <div className={Classes.NAVBAR_HEADING}>
            <a href="https://github.com/nomcopter/react-mosaic">
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
                Object.keys(THEMES).map((label) => <option>{label}</option>),
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
            href="https://github.com/nomcopter/react-mosaic"
          >
            <img
              title="Github Link"
              src="./GitHub-Mark-Light-32px.png"
            />
          </a>
        </div>
      </div>
    );
  }
}

interface ExampleWindowProps {
  count: number;
  path: MosaicPath; // Path is now MosaicPath
}

const createNode = () => Date.now();

// Example custom tab button renderer
const CustomTabButton = ({ tabKey, index, isActive, onTabClick }: any) => {
  return (
    <button
      className={`custom-tab-button ${isActive ? 'active' : ''}`}
      onClick={onTabClick}
      style={{
        background: isActive ? '#0070f3' : 'transparent',
        border: '1px solid #e1e5e9',
        borderRadius: '8px',
        padding: '8px 16px',
        margin: '0 4px',
        color: isActive ? 'white' : '#666',
        cursor: 'pointer',
        fontWeight: isActive ? '600' : '400',
        fontSize: '13px',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = '#f8f9fa';
          e.currentTarget.style.borderColor = '#0070f3';
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = '#e1e5e9';
        }
      }}
    >
      Window {tabKey}
    </button>
  );
};

const ExampleWindow = ({ count, path }: ExampleWindowProps) => {
  return (
    <MosaicWindow<number>
      additionalControls={count === 3 ? additionalControls : EMPTY_ARRAY}
      title={`Panel ${count}`}
      createNode={createNode}
      path={path} // Pass the n-ary path to the window
      onDragStart={() => console.log('MosaicWindow.onDragStart')}
      onDragEnd={(type) => console.log('MosaicWindow.onDragEnd', type)}
      renderToolbar={
        count === 2
          ? () => (
              <div className="toolbar-example">
                <MosaicWindowContext.Consumer key="split">
                  {({ mosaicWindowActions }) => (
                    <Button
                      variant="minimal"
                      size="small"
                      icon="split-columns"
                      title="Split"
                      onClick={() => mosaicWindowActions.split()}
                    />
                  )}
                </MosaicWindowContext.Consumer>
                <MosaicWindowContext.Consumer key="add-tab">
                  {() => <AddTabButton />}
                </MosaicWindowContext.Consumer>
                <MosaicWindowContext.Consumer key="close">
                  {() => <RemoveButton />}
                </MosaicWindowContext.Consumer>
              </div>
            )
          : null
      }
    >
      <div className="example-window">
        <h1>{`Panel Content ${count}`}</h1>
      </div>
    </MosaicWindow>
  );
};
