import { MosaicNode, MosaicPath } from '@lonli-lokli/react-mosaic-component';

export interface DemoAppState {
  currentNode: MosaicNode<string> | null;
  currentTheme: Theme;
  editableTitles: Record<string, string>;
  dragInProgress: boolean;
  dragOverPath: MosaicPath | null;
}

export interface ExampleWindowProps {
  path: MosaicPath;
  onUpdateTitle?: (panelId: string, newTitle: string) => void;
  editableTitle?: string;
  dragInProgress?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  onDragOver?: () => void;
  panelId: string;
}

export interface EditableTabTitleProps {
  tabKey: number | string;
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
  ['Blueprint Dark']: 'mosaic-blueprint-theme bp6-dark',
  ['Custom Dark']: 'mosaic-custom-dark-theme',
  ['Custom Light']: 'mosaic-custom-light-theme',
  ['None']: '',
} as const;

export type Theme = keyof typeof THEMES;
