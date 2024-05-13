import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { DemoApp } from './app/app';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

root.render(
  <StrictMode>
    <DemoApp />
  </StrictMode>,
);
