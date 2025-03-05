import React from 'react';
import { createRoot } from 'react-dom/client';
import { ExampleApp } from './ExampleApp';

const APP_ELEMENT = document.getElementById('app')!;
const root = createRoot(APP_ELEMENT);
root.render(
  <React.StrictMode>
    <ExampleApp />
  </React.StrictMode>,
);
