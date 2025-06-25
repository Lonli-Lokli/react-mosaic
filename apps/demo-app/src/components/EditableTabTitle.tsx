import React from 'react';
import { EditableTabTitleProps } from '../types/demo-types';

export const EditableTabTitle = ({
  tabKey,
  title,
  onUpdateTitle,
}: EditableTabTitleProps) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(title);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(true);
    setEditValue(title);
  };

  const handleSave = () => {
    onUpdateTitle(editValue);
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(title);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyPress}
        autoFocus
        style={{
          background: 'transparent',
          border: '1px solid #007ACC',
          borderRadius: '3px',
          padding: '2px 4px',
          fontSize: '12px',
          color: '#007ACC',
          fontWeight: 'bold',
          width: '80px',
        }}
      />
    );
  }

  return (
    <span
      style={{
        color: '#007ACC',
        fontWeight: 'bold',
        cursor: 'pointer',
        padding: '2px 4px',
        borderRadius: '3px',
        transition: 'background-color 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        height: '100%',
        minHeight: 'inherit',
      }}
      onDoubleClick={handleDoubleClick}
      title="Double-click to edit"
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = 'rgba(0, 122, 204, 0.1)')
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = 'transparent')
      }
    >
      📋 {title}
    </span>
  );
};
