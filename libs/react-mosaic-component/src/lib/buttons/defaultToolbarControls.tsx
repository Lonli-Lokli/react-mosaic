import React from 'react';
import { ExpandButton } from './ExpandButton';
import { RemoveButton } from './RemoveButton';
import { ReplaceButton } from './ReplaceButton';
import { SplitButton } from './SplitButton';
import { AddTabButton } from './AddTabButton';
import { TabSplitButton } from './TabSplitButton';
import { TabRemoveButton } from './TabRemoveButton';
import { MosaicPath } from '../types';

export const DEFAULT_PANEL_CONTROLS_IN_TABS = React.Children.toArray([
  <RemoveButton />,
]);

export const createDefaultTabsControls = (path: MosaicPath) =>
  React.Children.toArray([
    <TabSplitButton path={path} key="tab-split-btn" />,
    <TabRemoveButton path={path} key="tab-remove-btn" />,
  ]);

export const DEFAULT_PANEL_CONTROLS_WITH_CREATION = React.Children.toArray([
  <ReplaceButton key="replace-btn" />,
  <SplitButton key="split-btn" />,
  <AddTabButton key="add-tab-btn" />,
  <ExpandButton key="expand-btn" />,
  <RemoveButton key="remove-btn" />,
]);
export const DEFAULT_PANEL_CONTROLS_WITHOUT_CREATION = React.Children.toArray([
  <ExpandButton key="expand-btn" />,
  <RemoveButton key="remove-btn" />,
]);
