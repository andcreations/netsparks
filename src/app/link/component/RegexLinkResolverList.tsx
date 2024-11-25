import * as React from 'react';
import { useState } from 'react';
import { IoC } from '@andcreations/common';

import { NoDataPrompt } from '../../component';
import { RegexLinkResolverEntry } from '../model';
import { AppStateValues, useAppState } from '../../state';
import { RegexLinkResolverService } from '../service';
import { LinkStateKeys } from '../state';
import { RegexLinkResolverListEntry } from './RegexLinkResolverListEntry';

/** */
interface RegexLinkResolverListState {
  /** */
  entries: RegexLinkResolverEntry[];
}

/** */
const regexLinkResolverService = IoC.resolve(RegexLinkResolverService);

/** */
export function RegexLinkResolverList() {
  /** */
  const [state, setState] = useState<RegexLinkResolverListState>({
    entries: regexLinkResolverService.getEntries(),
  });

  /** */
  useAppState(
    [LinkStateKeys.RegexLinkResolverEntries],
    (values: AppStateValues) => {
      setState({
        ...state,
        entries: values[LinkStateKeys.RegexLinkResolverEntries],
      });
    },
  );

  /** */
  const renderEntries = (): React.ReactNode[] => {
    return state.entries.map((entry, index) => {
      const key = `row-${index}`;
      return <RegexLinkResolverListEntry
        key={key}
        entry={entry}
      />;
    })
  };

  /** */
  return (
    <div className='netsparks-list'>
      {renderEntries()}
      {
        !state.entries.length &&
        <NoDataPrompt
          info='Nothing here'
          details='Hover over the header and click the plus icon to add'
        />
      }
    </div>
  );
}