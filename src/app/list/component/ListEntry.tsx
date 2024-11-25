import * as React from 'react';
import { useState } from 'react';
import { useDrag } from 'react-dnd';
import { IoC } from '@andcreations/common';

import { Log } from '../../log';
import { MaterialIconButton } from '../../component';
import { LIST_ENTRY_DND_ITEM, ListEntryDndItem } from '../dnd';
import { ListEntryModel } from '../model';
import { ListEntryService } from '../service';
import { DeleteListEntryModal } from './DeleteListEntryModal';
import { ModifyListEntryModal } from './ModifyListEntryModal';
import classNames = require('classnames');

/** */
export interface ListEntryProps {
  /** */
  entry: ListEntryModel;
}

/** */
interface ListEntryState {
  /** */
  showDeleteModal: boolean;
  showEditModal: boolean;
}

/** */
const listEntryService = IoC.resolve(ListEntryService);

/** */
export function ListEntry(props: ListEntryProps) {
  const { entry } = props;
  const isDone = !!entry.doneAt;

  /** */
  const [state, setState] = useState<ListEntryState>({
    showDeleteModal: false,
    showEditModal: false,
  });

  /** */
  const [collected, drag, dragPreview] = useDrag<ListEntryDndItem>(() => ({
    type: LIST_ENTRY_DND_ITEM,
    item: {
      listEntryId: entry.id,
    },
  }));

  /** */
  const onShowModal = (key: keyof ListEntryState) => {
    setState({
      ...state,
      [key]: true,
    });
  }

  /** */
  const onCloseModal = (key: keyof ListEntryState) => {
    setState({
      ...state,
      [key]: false,
    });
  }

  /** */
  const onDelete = () => {
    onCloseModal('showDeleteModal');
    listEntryService.deleteListEntry(props.entry.id)
      .catch(error => {
        Log.e('Failed to delete list entry', error);
      });
  };

  /** */
  const onEdit = (updatedEntry: Omit<ListEntryModel, 'id'>) => {
    onCloseModal('showEditModal');
    listEntryService.updateListEntry(props.entry.id, updatedEntry)
      .catch(error => {
        Log.e('Failed to update list entry', error);
      });
  };

  /** */
  const onMarkAsDone = () => {
    listEntryService.markListEntryAsDone(props.entry.id)
      .catch(error => {
        Log.e('Failed to mark list entry as done', error);
      });
  };

  /** */
  const onMarkAsPending = () => {
    listEntryService.markListEntryAsPending(props.entry.id)
      .catch(error => {
        Log.e('Failed to mark list entry as pending', error);
      });
  };

  /** */
  const buildLinks = (): React.ReactNode[] => {
    const { links } = props.entry;
    if (!links?.length) {
      return null;
    }
    const elements = links.map(link => {
      return (
        <React.Fragment key={link.label}>
          <a
            className='netsparks-list-entry-action-link'
            href={link.url}
          >
            {link.label}
          </a>
        </React.Fragment>
      );
    });
    return elements;
  }
  
  /** */
  const buildActions = (): React.ReactNode[] => {
    return [
      <MaterialIconButton
        key='delete'
        className='netsparks-list-entry-icon-button'
        icon='delete'
        title='Delete entry'
        onClick={() => onShowModal('showDeleteModal')}
      />,
      <MaterialIconButton
        key='check'
        className='netsparks-list-entry-icon-button'
        icon='check_circle'
        title={isDone ? 'Mark as pending' : 'Mark as done' }
        onClick={isDone ? onMarkAsPending : onMarkAsDone}
      />,
      <MaterialIconButton
        key='edit'
        className='netsparks-list-entry-icon-button'
        icon='edit'
        title='Edit entry'
        onClick={() => onShowModal('showEditModal')}
      />,
    ];
  }
  
  /** */
  const buildActionBar = (): React.ReactNode[] => {
    const linkElements = buildLinks();
    return [
      ...(linkElements?.length ? linkElements : []),
      ...buildActions(),
    ];
  }

  /** */
  const listEntryClassNames = classNames([
    'netsparks-list-entry',
    { 'netsparks-list-entry-done': isDone },
  ]);

  /** */
  return (
    <div
      className={listEntryClassNames}
      ref={drag}
      onDoubleClick={() => onShowModal('showEditModal')}
    >
      <div className='netsparks-list-entry-title'>
        <div>{entry.title}</div>
        { entry.notes &&
          <div className='netsparks-list-entry-notes'>
            {entry.notes}
          </div>
        }
      </div>
      <div className='netsparks-list-entry-action-bar'>
        {buildActionBar()}
      </div>
      {
        state.showDeleteModal &&
        <DeleteListEntryModal
          show={state.showDeleteModal}
          onClose={() => onCloseModal('showDeleteModal')}
          onDelete={onDelete}
        />
      }
      {
        state.showEditModal &&
        <ModifyListEntryModal
          entry={props.entry}
          show={state.showEditModal}
          ui={{
            title: 'Edit list entry',
            okButton: 'Edit',
          }}
          onClose={() => onCloseModal('showEditModal')}
          onModify={onEdit}
        />
      }
    </div>
  );
}