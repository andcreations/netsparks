import * as React from 'react';

import { PageWrapper } from '../../page';
import { DropboxBackupSettings } from '../../backup';
import { RegexLinkResolverSettings } from '../../link';

/** */
export function SettingsPage() {
  /** */
  return (
    <PageWrapper>
      <DropboxBackupSettings/>
      <RegexLinkResolverSettings/>
    </PageWrapper>
  );
}