import * as React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { IoC } from '@andcreations/common';

import { AppRouter, RoutingService } from './routing';
import { BackupService, DropboxBackupService } from './backup';
import { initDev } from './dev';
import { RegexLinkResolverService } from './link';

/** */
function failedToRunApp(error: any): void {
  console.log('Failed to run the application', error);
}

/** */
function bootstrapServices(): void {
  IoC.resolve(RoutingService);
  IoC.resolve(BackupService);
  IoC.resolve(DropboxBackupService);
  IoC.resolve(RegexLinkResolverService);
  IoC.bootstrap();
}

/** */
async function bootstrap(): Promise<void> {
// initialize
  bootstrapServices();
  initDev();

// render
  const container = document.getElementById('app');
  const root = ReactDOMClient.createRoot(container);
  root.render(<AppRouter/>);
}

bootstrap()
  .catch((error) => {
    failedToRunApp(error);
  });
