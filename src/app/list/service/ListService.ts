import { Service } from '@andcreations/common';

import { Log } from '../../log';
import { AppStateService } from '../../state';
import { ListEntryModel, ListModel } from '../model';
import { ListAppStateKeys } from '../state';

/** */
@Service()
export class ListService {
  /** */
  constructor(private readonly appState: AppStateService) {
  }

  /** */
  async createList(list: Pick<ListModel, 'name'>): Promise<void> {
  // get current lists
    const lists = await this.getLists();
    const maxId = lists.length ? Math.max(...lists.map(itr => itr.id)) : 0;

  // add & store
    const newList: ListModel = {
      ...list,
      id: maxId + 1,
      listEntryIds: [],
      createdAt: Date.now(),
    };
    Log.d(`Creating list: ${JSON.stringify(newList)}`);
    await this.appState.set({
      [ListAppStateKeys.Lists]: [...lists, newList ],
    });
  }

  /** */
  async updateList(
    id: number,
    updates: Partial<Pick <ListModel, 'name' | 'showDone'>>,
  ): Promise<void> {
    Log.i(
      `Updating list ${id} with values ` +
      `${JSON.stringify(updates)}`
    );

    const lists = await this.getLists();
  // list
    const list = lists.find(itr => itr.id === id);
    if (!list) {
      Log.e('Attempt to update an unknown list');
      return;
    }

  // update
    Object.keys(updates).forEach(key => list[key] = updates[key]);
    await this.appState.set({
      [ListAppStateKeys.Lists]: lists,
    });
  } 

  /** */
  async getLists(): Promise<ListModel[]> {
    return this.appState.get<ListModel[]>(ListAppStateKeys.Lists, []);
  }

  /** */
  async getListById(id: number): Promise<ListModel | undefined> {
    const lists = await this.getLists();
    return lists.find(itr => itr.id === id);
  }

  /** */
  async getListByListEntryId(
    listEntryId: number,
  ): Promise<ListModel | undefined> {
    const lists = await this.getLists();
    return lists.find(itr => itr.listEntryIds.includes(listEntryId));
  }

  /** */
  private async getListEntries(): Promise<ListEntryModel[]> {
    return this.appState.get<ListEntryModel[]>(
      ListAppStateKeys.ListEntries,
      [],
    );
  }

  /** */
  async deleteList(id: number): Promise<void> {
  // get current lists & entries
    const lists = await this.getLists();
    const entries = await this.getListEntries();

  // find list
    const index = lists.findIndex(itr => itr.id === id);
    if (index < 0) {
      Log.e(`Attempt to delete an unknown list of identifier ${id}`);
      return;
    }
    const list = lists[index];

  // remove list & list entries
    Log.d(`Deleting list of identifier ${id}`);
    const newLists = [...lists.slice(0, index), ...lists.slice(index + 1)];
    const newEntries: ListEntryModel[] = entries.filter(entry => {
      return !list.listEntryIds.includes(entry.id);
    })

  // store
    await this.appState.set({
      [ListAppStateKeys.Lists]: newLists,
      [ListAppStateKeys.ListEntries]: newEntries,
    });
  }

  /** */
  private async swapLists(index0: number, index1: number): Promise<void> {
    const lists = await this.getLists();

  // swap
    const list0 = lists[index0];
    const list1 = lists[index1];
    lists[index0] = list1;
    lists[index1] = list0;

  // store
    await this.appState.set({
      [ListAppStateKeys.Lists]: [...lists],
    });
  }

  /** */
  async moveListUp(id: number): Promise<void> {
  // list index
    const lists = await this.getLists();
    const index = lists.findIndex(itr => itr.id === id);
    if (index < 0) {
      throw new Error(`Attempt to move up an unknown list ${id}`);
    }
    if (index === 0) {
      return;
    }

  // swap
    return this.swapLists(index - 1, index);
  }

  /** */
  async moveListDown(id: number): Promise<void> {
  // list index
    const lists = await this.getLists();
    const index = lists.findIndex(itr => itr.id === id);
    if (index < 0) {
      throw new Error(`Attempt to move up an unknown list ${id}`);
    }
    if (index === lists.length - 1) {
      return;
    }

  // swap
    return this.swapLists(index, index + 1);
  }
}
