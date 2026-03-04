import React from 'react';
import { createRoot } from 'react-dom/client';

import ButtonPreviewPage from './components/Button/Button.preview';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ButtonPreviewPage />
  </React.StrictMode>,
);
