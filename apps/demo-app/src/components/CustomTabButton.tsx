import React from 'react';
import { CustomTabButtonProps } from '../types/demo-types';

export const CustomTabButton = ({
  tabKey,
  index,
  isActive,
  path,
  onTabClick,
  renderTabTitle,
}: CustomTabButtonProps) => {
  const handleButtonClick = (e: React.MouseEvent) => {
    // Only call onTabClick if the click didn't come from inside renderTabTitle content
    const target = e.target as HTMLElement;
    const currentTarget = e.currentTarget as HTMLElement;

    // If the click came from a child element (like EditableTabTitle), don't handle it
    if (target !== currentTarget && currentTarget.contains(target)) {
      return;
    }

    onTabClick();
  };

  return (
    <button
      className={`custom-tab-button ${isActive ? 'active' : ''}`}
      onClick={handleButtonClick}
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
      {renderTabTitle ? renderTabTitle(tabKey, path) : `Window ${tabKey}`}
    </button>
  );
};
