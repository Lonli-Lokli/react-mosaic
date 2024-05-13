import React from 'react';
import { ExpandButton } from './ExpandButton';
import { RemoveButton } from './RemoveButton';
import { ReplaceButton } from './ReplaceButton';
import { SplitButton } from './SplitButton';
import { AddTabButton } from './AddTabButton';

export const DEFAULT_CONTROLS_IN_TABS = React.Children.toArray([
  <RemoveButton />,
]);

export const DEFAULT_CONTROLS_WITH_CREATION = React.Children.toArray([
  <ReplaceButton />,
  <SplitButton />,
  <AddTabButton />,
  <ExpandButton />,
  <RemoveButton />,
]);
export const DEFAULT_CONTROLS_WITHOUT_CREATION = React.Children.toArray([
  <ExpandButton />,
  <RemoveButton />,
]);
