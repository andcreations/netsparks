import * as React from 'react';
import { useState } from 'react';
import { IoC } from '@andcreations/common';

import { Log } from '../../log';
import { MaterialIconButton, YesNoModal } from '../../component';
import { RegexLinkResolverEntry } from '../model';
import { RegexLinkResolverService } from '../service';
import { ModifyRegexLinkResolverModal } from './ModifyRegexLinkResolverModal';

/** */
export interface RegexLinkResolverListEntryProps {
  /** */
  entry: RegexLinkResolverEntry;
}

/** */
interface RegexLinkResolverListEntryState {
  /** */
  showDeleteModal: boolean;

  /** */
  showEditModal: boolean;
}

/** */
const regexLinkResolverService = IoC.resolve(RegexLinkResolverService);

/** */
export function RegexLinkResolverListEntry(
  props: RegexLinkResolverListEntryProps
) {
  const { entry } = props;
  
  /** */
  const [state, setState] = useState<RegexLinkResolverListEntryState>({
    showDeleteModal: false,
    showEditModal: false,
  });

  /** */
  const onShowDelete = () => {
    setState({
      ...state,
      showDeleteModal: true,
    });
  };

  /** */
  const onCloseDelete = () => {
    setState({
      ...state,
      showDeleteModal: false,
    });
  };

  /** */
  const onDelete = () => {
    onCloseDelete();
    regexLinkResolverService.deleteEntry(entry.id)
      .catch(error => {
        Log.e('Failed to delete regex link resolver entry', error);
      });
  };

  /** */
  const onShowEdit = () => {
    setState({
      ...state,
      showEditModal: true,
    });
  };

  /** */
  const onCloseEdit = () => {
    setState({
      ...state,
      showEditModal: false,
    });
  };

  /** */
  const onEdit = (updatedEntry: RegexLinkResolverEntry) => {
    onCloseEdit();
    regexLinkResolverService.updateEntry(entry.id, updatedEntry)
      .catch(error => {
        Log.e('Failed to update regex link resolver entry', error);
      });
  };

  /** */
  const buildActionBar = (): React.ReactNode[] => {
    return [
      <MaterialIconButton
        key='delete'
        className='netsparks-list-entry-icon-button 
          netsparks-list-entry-icon-button-delete'
        icon='delete'
        title='Delete entry'
        onClick={onShowDelete}
      />,
      <MaterialIconButton
        key='edit'
        className='netsparks-list-entry-icon-button'
        icon='edit'
        title='Edit entry'
        onClick={onShowEdit}
      />,
    ];
  }

  /** */
  return (
    <div
      className='netsparks-list-entry'
      onDoubleClick={onShowEdit}
    >
      <div className='netsparks-list-entry-title netsparks-regex-link-entry'>
        <div className='netsparks-regex-link-resolver-list-entry-regex'>
          {entry.regex}
        </div>
        <div className='netsparks-regex-link-resolver-list-entry-dot'>·</div>
        <div>{entry.url}</div>
      </div>
      <div className='netsparks-list-entry-action-bar'>
        {buildActionBar()}
      </div>
      {
        state.showDeleteModal &&
        <YesNoModal
          show={state.showDeleteModal}
          ui={{
            title: 'Delete regexp link resolver entry',
            noButton: 'Cancel',
            yesButton: 'Delete',
          }}
          onNo={onCloseDelete}
          onYes={onDelete}
        >
          Do you really want to delete the entry?
        </YesNoModal>
      }
      {
        state.showEditModal &&
        <ModifyRegexLinkResolverModal
          entry={props.entry}
          show={state.showEditModal}
          ui={{
            title: 'Edit regexp link resolver entry',
            okButton: 'Edit',
          }}
          onClose={onCloseEdit}
          onModify={onEdit}
        />
      }
    </div>
  );
}