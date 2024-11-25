import * as React from 'react';

import { Header } from '../../component';
import { PageWrapper } from '../../page';
import { Lists } from '../../list';
import { Bookmarks } from '../../bookmark';

/** */
export function DashboardPage() {
  return (
    <PageWrapper>
      <Bookmarks/>
      <Lists/>
    </PageWrapper>
  );
}