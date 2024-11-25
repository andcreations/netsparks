import * as React from 'react';
import { useState } from 'react';
import { IoC } from '@andcreations/common';

import { Log } from '../../log';
import { CollapsibleSection, Header, MaterialIconButton } from '../../component';
import { RegexLinkResolverEntry } from '../model';
import { RegexLinkResolverService } from '../service';
import { RegexLinkResolverList } from './RegexLinkResolverList';
import { ModifyRegexLinkResolverModal } from './ModifyRegexLinkResolverModal';

/** */
interface RegexLinkResolverSettingsState {
  /** */
  showCreateModal: boolean;
}

/** */
const regexLinkResolverService = IoC.resolve(RegexLinkResolverService);

/** */
export function RegexLinkResolverSettings() {
  /** */
  const [state, setState] = useState<RegexLinkResolverSettingsState>({
    showCreateModal: false,
  });

  /** */
  const onShowCreate = () => {
    setState({
      ...state,
      showCreateModal: true,
    });
  };

  /** */
  const onCloseCreate = () => {
    setState({
      ...state,
      showCreateModal: false,
    });
  };

  /** */
  const onCreate = (newEntry: RegexLinkResolverEntry) => {
    onCloseCreate();
    regexLinkResolverService.createEntry(newEntry)
      .catch(error => {
        Log.e('Failed to create regexp link resolver entry', error);
      });
  }

  /** */
  const buildActionBar = (): React.ReactNode => {
    const elements: React.ReactNode[] = [
      <MaterialIconButton
        key='add'
        icon='add_circle'
        title='Create an entry'
        onClick={onShowCreate}
      />,
    ];
    return (
      <div className='netsparks-list-action-bar'>
        {elements}
      </div>
    );
  }

  /** */
  return (
    <>
      <CollapsibleSection
        id='regexLinkResolverSettings'
        className='netsparks-list'
        header={{
          className: 'netsparks-list-header',
          title: 'RegExp link resolver',
          actionBar: buildActionBar()
        }}
      >
        <RegexLinkResolverList/>
      </CollapsibleSection>
      {
        state.showCreateModal &&
        <ModifyRegexLinkResolverModal
          show={state.showCreateModal}
          ui={{
            title: 'Create regexp link resolver entry',
            okButton: 'Create',
          }}
          onClose={onCloseCreate}
          onModify={onCreate}
        />
      }
    </>
  );
}