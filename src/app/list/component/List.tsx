import * as React from 'react';
import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { IoC } from '@andcreations/common';

import { Log } from '../../log';
import { 
  CollapsibleSection,
  MaterialIconButton,
  NoDataPrompt,
  YesNoModal,
} from '../../component';
import { ListEntryModel, ListModel } from '../model';
import { ListService, ListEntryService } from '../service';
import { ListEntry } from './ListEntry';
import { ListEntryDropBar } from './ListEntryDropBar';
import { ModifyListEntryModal } from './ModifyListEntryModal';
import { ModifyListModal } from './ModifyListModal';
import { MaterialIconCheck } from '../../component/basic/MaterialIconCheck';

/** */
export interface ListProps {
  /** */
  list: ListModel;

  /** */
  listEntries: ListEntryModel[];
}

/** */
interface ListState {
  /** */
  showCreateModal: boolean;
  showEditModal: boolean;  
  showDeleteModal: boolean;
}

/** */
const listService = IoC.resolve(ListService);
const listEntryService = IoC.resolve(ListEntryService);

/** */
export function List(props: ListProps) {
  const { list } = props;

  /** */
  const [state, setState] = useState<ListState>({
    showCreateModal: false,
    showEditModal: false,
    showDeleteModal: false,
  });

  /** */
  const onShowModal = (key: keyof ListState) => {
    setState({
      ...state,
      [key]: true,
    });
  }

  /** */
  const onCloseModal = (key: keyof ListState) => {
    setState({
      ...state,
      [key]: false,
    });
  }

  /** */
  const onShowDoneChange = (checked) => {
    listService.updateList(
      list.id,
      {
        showDone: checked,
      },
    )
    .catch(error => {
      Log.e('Failed to update list', error)
    });
  };

  /** */
  const onMoveUp = () => {
    listService.moveListUp(props.list.id)
      .catch(error => {
        Log.e('Failed to move list up', error);
      });
  };

  /** */
  const onMoveDown = () => {
    listService.moveListDown(props.list.id)
      .catch(error => {
        Log.e('Failed to move list down', error);
      });
  };

  /** */
  const onDelete = () => {
    onCloseModal('showDeleteModal');
    listService.deleteList(props.list.id)
      .catch(error => {
        Log.e('Failed to delete list', error);
      });
  }

  /** */
  const onEdit = (updatedList: Pick<ListModel, 'name'>) => {
    onCloseModal('showEditModal');
    listService.updateList(list.id, updatedList)
      .catch(error => {
        Log.e('Failed to update list', error)
      });
  };

  /** */
  const onCreate = (newEntry: Omit<ListEntryModel, 'id'>) => {
    onCloseModal('showCreateModal');
    listEntryService.createListEntry(
      props.list.id,
      {
        title: newEntry.title,
        links: newEntry.links,
        notes: newEntry.notes,
      }
    ).catch(error => {
      Log.e('Failed to create list entry', error);
    });
  };

  /** */
  const buildActionBar = (): React.ReactNode => {
    const elements: React.ReactNode[] = [
      <MaterialIconCheck
        key='show-done-check'
        icon='checklist'
        title='Show down'
        checked={!!list.showDone}
        onChange={onShowDoneChange}
      />,      
      <MaterialIconButton
        className='netsparks-header-action-bar-icon-button'
        key='up'
        icon='keyboard_arrow_up'
        title='Move up'
        onClick={onMoveUp}
      />,      
      <MaterialIconButton
        className='netsparks-header-action-bar-icon-button'
        key='down'
        icon='keyboard_arrow_down'
        title='Move down'
        onClick={onMoveDown}
      />,      
      <MaterialIconButton
        className='netsparks-header-action-bar-icon-button'
        key='delete'
        icon='delete'
        title='Delete list'
        onClick={() => onShowModal('showDeleteModal')}
      />,      
      <MaterialIconButton
        className='netsparks-header-action-bar-icon-button'
        key='edit'
        icon='edit'
        title='Edit list'
        onClick={() => onShowModal('showEditModal')}
      />,      
      <MaterialIconButton
        className='netsparks-header-action-bar-icon-button'
        key='add'
        icon='add_circle'
        title='Create an entry'
        onClick={() => onShowModal('showCreateModal')}
      />,
    ];
    return (
      <div className='netsparks-list-action-bar'>
        {elements}
      </div>
    );
  }

  /** */
  const renderPendingListEntries = () => {
    let dstIndex = 0;
    const elements: React.ReactNode[] = [
      <ListEntryDropBar
        key='dropBar-0'
        listId={list.id}
        dstIndex={dstIndex}
      />
    ];
    dstIndex++;

  // pending entries
    const pendingListEntries = props.listEntries.filter(entry => {
      return !entry.doneAt;
    });

  // render
    pendingListEntries.forEach(entry => {
    // list entry
      const listEntryKey = `listEntry-${entry.id}`;
      elements.push(
        <ListEntry
          key={listEntryKey}
          entry={entry}
        />
      );

    // drop bar
      const dropBarKey = `dropBar-${entry.id}`;
      elements.push(
        <ListEntryDropBar
          key={dropBarKey}
          listId={list.id}
          dstIndex={dstIndex}
        />
      );
      dstIndex++;
    });

    return elements;
  }

  /** */
  const renderDoneListEntries = () => {
    const doneListEntries = props.listEntries.filter(entry => {
      return !!entry.doneAt;
    });
    return doneListEntries.map(entry => {
      const key = `listEntry-${entry.id}`;
      return <ListEntry
        key={key}
        entry={entry}
      />;
    });
  };
 
  /** */
  return (
    <div className='netsparks-list'>
      <CollapsibleSection
        id={`list.${props.list.id}`}
        header={{
          className: 'netsparks-list-header',
          title: list.name,
          actionBar: buildActionBar()
        }}
      >
        {renderPendingListEntries()}
        {
          props.list.showDone &&
          renderDoneListEntries()
        }
        {
          !props.listEntries.length &&
          <NoDataPrompt
            info='Nothing here'
            details='Hover over the header and click the plus icon to add'
          />
        }
      </CollapsibleSection>
      {
        state.showDeleteModal &&
        <YesNoModal
          show={state.showDeleteModal}
          ui={{
            title: 'Delete list',
            noButton: 'Cancel',
            yesButton: 'Delete',
          }}
          onNo={() => onCloseModal('showDeleteModal')}
          onYes={onDelete}
        >
          Do you really want to delete the list?
        </YesNoModal>
      }
      {
        state.showEditModal &&
        <ModifyListModal
          list={list}
          show={state.showEditModal}
          ui={{
            title: 'Edit list',
            okButton: 'Edit',
          }}
          onClose={() => onCloseModal('showEditModal')}
          onModify={onEdit}
        />
      }
      {
        state.showCreateModal &&
        <ModifyListEntryModal
          show={state.showCreateModal}
          ui={{
            title: 'Create list entry',
            okButton: 'Create',
          }}
          onClose={() => onCloseModal('showCreateModal')}
          onModify={onCreate}
        />
      }
    </div>
  );
}