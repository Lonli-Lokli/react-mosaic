import { MosaicNode, MosaicPath } from '@lonli-lokli/react-mosaic-component';

export interface DemoAppState {
  currentNode: MosaicNode<number> | null;
  currentTheme: Theme;
  editableTitles: { [key: number]: string };
  dragInProgress: boolean;
  dragOverPath: MosaicPath | null;
}

export interface ExampleWindowProps {
  count: number;
  path: MosaicPath;
  onUpdateTitle?: (panelId: number, newTitle: string) => void;
  editableTitle?: string;
  dragInProgress?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragOver?: () => void;
}

export interface EditableTabTitleProps {
  tabKey: number;
  title: string;
  onUpdateTitle: (newTitle: string) => void;
}

export interface CustomTabButtonProps {
  tabKey: number;
  index: number;
  isActive: boolean;
  path: MosaicPath;
  mosaicId: string;
  onTabClick: () => void;
  mosaicActions: any; // MosaicRootActions<number>
  renderTabTitle?: (tabKey: number, path: MosaicPath) => React.ReactNode;
}

export const THEMES = {
  ['Blueprint']: 'mosaic-blueprint-theme',
  ['Blueprint Dark']: 'mosaic-blueprint-theme bp5-dark',
  ['Custom Dark']: 'mosaic-custom-dark-theme',
  ['Custom Light']: 'mosaic-custom-light-theme',
  ['None']: '',
} as const;

export type Theme = keyof typeof THEMES;
