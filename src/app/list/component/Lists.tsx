import * as React from 'react';
import { useState, useEffect } from 'react';
import { IoC } from '@andcreations/common';

import { Log } from '../../log';
import { ifDefined } from '../../util';
import { useAppState } from '../../state';
import { ListAppStateKeys } from '../state';
import { ListEntryModel, ListModel } from '../model';
import { ListService, ListEntryService } from '../service';
import { List } from './List';
import { ListBottomToolbar } from './ListsBottomToolbar';
import { ModifyListModal } from './ModifyListModal';

/** */
interface ListsState {
  /** */
  lists: ListModel[];

  /** */
  allListEntries: ListEntryModel[];

  /** */
  showCreateModal: boolean;

  /** */
  loaded: boolean;
  loadFailed?: boolean;
}

/** */
const listService = IoC.resolve(ListService);
const listEntryService = IoC.resolve(ListEntryService);

/** */
export function Lists() {
  /** */
  const [state, setState] = useState<ListsState>({
    lists: [],
    allListEntries: [],
    showCreateModal: false,
    loaded: false,
  });

  /** */
  useEffect(() => {
    if (state.loaded || state.loadFailed) {
      return;
    }
    Promise.all([
      listService.getLists(),
      listEntryService.getListEntries(),
    ])
    .then(([lists, allListEntries]) => {
      setState({
        ...state,
        lists,
        allListEntries,
        loaded: true,
      });
    })
    .catch(error => {
      Log.e('Failed to load lists', error);
      setState({
        ...state,
        loadFailed: true,
      });
    });
  });

  /** */
  useAppState(
    [
      ListAppStateKeys.Lists,
      ListAppStateKeys.ListEntries,
    ],
    (values) => {
      setState({
        ...state,
        ...ifDefined<ListsState>({
          lists: values[ListAppStateKeys.Lists],
          allListEntries: values[ListAppStateKeys.ListEntries],
        }),
      });
    },
  );

  /** */
  const onShowModal = (key: keyof ListsState) => {
    setState({
      ...state,
      [key]: true,
    });
  }

  /** */
  const onCloseModal = (key: keyof ListsState) => {
    setState({
      ...state,
      [key]: false,
    });
  }

  /** */
  const onCreate = (newList: Pick<ListModel, 'name'>) => {
    onCloseModal('showCreateModal');
    listService.createList(
      {
        name: newList.name,
      },
    ).catch(error => {
      Log.e('Failed to create list', error);
    });
  };

  /** */
  const renderLists = () => {
    return state.lists.map(list => {
      const key = `list-${list.id}`;
      const listEntries = list.listEntryIds
        .map(listEntryId => {
          return state.allListEntries.find(itr => itr.id === listEntryId);
        })
        .filter(itr => !!itr);
      return <List
        key={key}
        list={list}
        listEntries={listEntries}
      />;
    });
  };

  /** */
  return (
    <div>
      {renderLists()}
      <ListBottomToolbar
        onCreateList={() => onShowModal('showCreateModal')}
      />
      {
        state.showCreateModal &&
        <ModifyListModal
          show={state.showCreateModal}
          ui={{
            title: 'Create list',
            okButton: 'Create',
          }}
          onClose={() => onCloseModal('showCreateModal')}
          onModify={onCreate}
        />
      }
    </div>
  );
}