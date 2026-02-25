import React from 'react';
import { Button } from '@blueprintjs/core';
import {
  MosaicWindow,
  MosaicWindowContext,
  AddTabButton,
  RemoveButton,
} from '@lonli-lokli/react-mosaic-component';
import { ExampleWindowProps } from '../types/demo-types';

const EMPTY_ARRAY: any[] = [];
const createNode = () => Date.now();

export const ExampleWindow = ({ panelId, path }: ExampleWindowProps) => {
  return (
    <MosaicWindow<number>
      additionalControls={panelId === '3' ? [] : EMPTY_ARRAY}
      title={`Panel ${panelId}`}
      createNode={createNode}
      path={path}
      onDragStart={() => console.log('MosaicWindow.onDragStart')}
      onDragEnd={(type) => console.log('MosaicWindow.onDragEnd', type)}
      renderToolbar={
        panelId === '2'
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
      <div
        className="example-window"
        style={{
          height: '100%',
          overflow: 'auto',
          padding: '0',
          boxSizing: 'border-box',
        }}
      >
        <h1
          style={{ margin: '0 0 16px 0' }}
        >{`Panel ${panelId} - Data Table`}</h1>

        <div style={{ overflow: 'auto', width: '100%' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
              minWidth: '800px',
            }}
          >
            <thead
              style={{
                backgroundColor: '#f5f8fa',
              }}
            >
              <tr>
                <th
                  style={{
                    border: '1px solid #e1e5e9',
                    padding: '12px 8px',
                    textAlign: 'left',
                    fontWeight: '600',
                  }}
                >
                  ID
                </th>
                <th
                  style={{
                    border: '1px solid #e1e5e9',
                    padding: '12px 8px',
                    textAlign: 'left',
                    fontWeight: '600',
                  }}
                >
                  Name
                </th>
                <th
                  style={{
                    border: '1px solid #e1e5e9',
                    padding: '12px 8px',
                    textAlign: 'left',
                    fontWeight: '600',
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    border: '1px solid #e1e5e9',
                    padding: '12px 8px',
                    textAlign: 'left',
                    fontWeight: '600',
                  }}
                >
                  Department
                </th>
                <th
                  style={{
                    border: '1px solid #e1e5e9',
                    padding: '12px 8px',
                    textAlign: 'left',
                    fontWeight: '600',
                  }}
                >
                  Position
                </th>
                <th
                  style={{
                    border: '1px solid #e1e5e9',
                    padding: '12px 8px',
                    textAlign: 'left',
                    fontWeight: '600',
                  }}
                >
                  Salary
                </th>
                <th
                  style={{
                    border: '1px solid #e1e5e9',
                    padding: '12px 8px',
                    textAlign: 'left',
                    fontWeight: '600',
                  }}
                >
                  Start Date
                </th>
                <th
                  style={{
                    border: '1px solid #e1e5e9',
                    padding: '12px 8px',
                    textAlign: 'left',
                    fontWeight: '600',
                  }}
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 100 }, (_, index) => {
                const id = index + 1 + parseInt(panelId) * 100;
                const departments = [
                  'Engineering',
                  'Marketing',
                  'Sales',
                  'HR',
                  'Finance',
                  'Operations',
                ];
                const positions = [
                  'Manager',
                  'Senior',
                  'Junior',
                  'Lead',
                  'Director',
                  'Analyst',
                ];
                const statuses = ['Active', 'On Leave', 'Remote', 'Part-time'];

                return (
                  <tr
                    key={id}
                    style={{
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9f9f9',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = '#e6f3ff')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        index % 2 === 0 ? '#ffffff' : '#f9f9f9')
                    }
                  >
                    <td
                      style={{
                        border: '1px solid #e1e5e9',
                        padding: '10px 8px',
                      }}
                    >
                      {id}
                    </td>
                    <td
                      style={{
                        border: '1px solid #e1e5e9',
                        padding: '10px 8px',
                      }}
                    >
                      {`User ${id} Panel${panelId}`}
                    </td>
                    <td
                      style={{
                        border: '1px solid #e1e5e9',
                        padding: '10px 8px',
                      }}
                    >
                      {`user${id}@company.com`}
                    </td>
                    <td
                      style={{
                        border: '1px solid #e1e5e9',
                        padding: '10px 8px',
                      }}
                    >
                      {departments[index % departments.length]}
                    </td>
                    <td
                      style={{
                        border: '1px solid #e1e5e9',
                        padding: '10px 8px',
                      }}
                    >
                      {positions[index % positions.length]}
                    </td>
                    <td
                      style={{
                        border: '1px solid #e1e5e9',
                        padding: '10px 8px',
                      }}
                    >
                      ${(50000 + index * 1000 + parseInt(panelId) * 5000).toLocaleString()}
                    </td>
                    <td
                      style={{
                        border: '1px solid #e1e5e9',
                        padding: '10px 8px',
                      }}
                    >
                      {new Date(
                        2020 + (index % 4),
                        index % 12,
                        (index % 28) + 1,
                      ).toLocaleDateString()}
                    </td>
                    <td
                      style={{
                        border: '1px solid #e1e5e9',
                        padding: '10px 8px',
                      }}
                    >
                      <span
                        style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '600',
                          backgroundColor:
                            statuses[index % statuses.length] === 'Active'
                              ? '#e6f7d6'
                              : statuses[index % statuses.length] === 'Remote'
                                ? '#e6f3ff'
                                : statuses[index % statuses.length] === 'On Leave'
                                  ? '#ffeaa7'
                                  : '#f5f5f5',
                          color:
                            statuses[index % statuses.length] === 'Active'
                              ? '#2d5016'
                              : statuses[index % statuses.length] === 'Remote'
                                ? '#1e3a8a'
                                : statuses[index % statuses.length] === 'On Leave'
                                  ? '#d68910'
                                  : '#666',
                        }}
                      >
                        {statuses[index % statuses.length]}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </MosaicWindow>
  );
};
