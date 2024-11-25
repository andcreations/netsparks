import { Service } from '@andcreations/common';

import { Log } from '../../log';
import { AppStateService } from '../../state';
import {
  ListEntryModel,
  EditableListEntryModel,
} from '../model';
import { ListAppStateKeys } from '../state';
import { ListService } from './ListService';

/** */
@Service()
export class ListEntryService {
  /** */
  constructor(
    private readonly appState: AppStateService,
    private readonly listService: ListService,
  ) {}

  /** */
  async getListEntries(): Promise<ListEntryModel[]> {
    return this.appState.get<ListEntryModel[]>(
      ListAppStateKeys.ListEntries,
      [],
    );
  }

  /** */
  private async getListEntryById(
    id: number,
  ): Promise<ListEntryModel | undefined> {
    const listEntries = await this.getListEntries();
    return listEntries.find(itr => itr.id === id);
  }

  /** */
  async createListEntry(
    listId: number,
    listEntry: EditableListEntryModel,
  ): Promise<void> {
  // check if the list exists
    const lists = await this.listService.getLists();
    const list = lists.find(itr => itr.id === listId);
    if (!list) {
      throw new Error(`No list ${listId} while creating a list entry`);
    }

  // get current entries
    const listEntries = await this.getListEntries();
    const maxId = listEntries.length
      ? Math.max(...listEntries.map(itr => itr.id))
      : 0;

  // add
    const newListEntry: ListEntryModel = {
      ...listEntry,
      id: maxId + 1,
      createdAt: Date.now(),
    };
    list.listEntryIds.push(newListEntry.id);

  // store
    Log.d(`Creating list entry: ${JSON.stringify(newListEntry)}`);
    await this.appState.set({
      [ListAppStateKeys.Lists]: [...lists],
      [ListAppStateKeys.ListEntries]: [...listEntries, newListEntry ],
    });
  }

  /** */
  async deleteListEntry(id: number): Promise<void> {
    Log.d(`Deleting list entry of identifier ${id}`);

    const lists = await this.listService.getLists();
  // list & entry
    const listEntries = await this.getListEntries();
    const list = await this.listService.getListByListEntryId(id);

  // identifier index in the list
    const idIndex = list.listEntryIds.indexOf(id);
    if (idIndex < 0) {
      Log.e(
        `Attempt to delete an unknown list entry ` +
        `of identifier ${id} from the list ${list.id}`
      );
    }

  // delete & store
    const entryIndex = listEntries.findIndex(itr => itr.id === id);
    if (entryIndex < 0) {
      Log.e(
        `Attempt to delete an unknown list entry of identifier ${id}`
      );
      return;
    }
    if (idIndex >= 0) {
      list.listEntryIds.splice(idIndex, 1);
    }
    const newListEntries = [
      ...listEntries.slice(0, entryIndex),
      ...listEntries.slice(entryIndex + 1),
    ];
    await this.appState.set({
      [ListAppStateKeys.Lists]: [...lists],
      [ListAppStateKeys.ListEntries]: newListEntries,
    });
  }

  /** */
  async moveListEntry(
    listEntryId: number,
    dstListId: number,
    dstIndex: number,
  ): Promise<void> {
    const DUMMY_LIST_ENTRY_ID = -1;
    Log.i(
      `Moving list entry ${listEntryId} to list ` +
      `${dstListId} to index ${dstIndex}`
    );

  // list entry
    const listEntry = await this.getListEntryById(listEntryId);
    if (!listEntry) {
      Log.e(`Attempt to move an unknown list entry`);
      return;
    }

    const lists = await this.listService.getLists();
  // lists
    const srcList = await this.listService.getListByListEntryId(listEntryId);
    const dstList = await this.listService.getListById(dstListId);
    if (!srcList || !dstList) {
      Log.e(`Attempt to move an list entry from/to unknown list`);
      return;
    }

  // move: put dummy
    const srcIndex = srcList.listEntryIds.findIndex(id => id === listEntryId);
    srcList.listEntryIds[srcIndex] = DUMMY_LIST_ENTRY_ID;

  // move: put the list entry
    dstList.listEntryIds.splice(dstIndex, 0, listEntryId);

  // move: remove dummy
    const dummyIndex = srcList.listEntryIds.findIndex(id => {
      return id === DUMMY_LIST_ENTRY_ID;
    });
    srcList.listEntryIds.splice(dummyIndex, 1);

  // store
    await this.appState.set({
      [ListAppStateKeys.Lists]: [...lists],
    });
  }

  /** */
  async updateListEntry(
    id: number,
    updates: Partial<EditableListEntryModel>,
  ): Promise<void> {
    Log.i(
      `Updating list entry ${id} with values: ` +
      `${JSON.stringify(updates)}`
    );
  
    const entries = await this.getListEntries();
  // list entry
    const entry = entries.find(itr => itr.id === id);
    if (!entry) {
      Log.e(`Attempt to update an unknown list entry`);
      return;
    }

  // update
    Object.keys(updates).forEach(key => entry[key] = updates[key]);
    await this.appState.set({
      [ListAppStateKeys.ListEntries]: entries,
    });
  }

  /** */
  private async setListEntryDoneAt(id: number, doneAt?: number): Promise<void> {
    Log.i(`Marking list entry ${id} as done`);     

    const entries = await this.getListEntries();
  // list entry
    const entry = entries.find(itr => itr.id === id);
    if (!entry) {
      Log.e(`Attempt to mark as done an unknown list entry`);
      return;
    }
    if (doneAt) {
      entry.doneAt = doneAt;
    }
    else {
      delete entry.doneAt;
    }

  // update
    await this.appState.set({
      [ListAppStateKeys.ListEntries]: entries,
    });
  }

  /** */
  async markListEntryAsDone(id: number): Promise<void> {  
    return this.setListEntryDoneAt(id, Date.now());
  }

  /** */
  async markListEntryAsPending(id: number): Promise<void> {  
    return this.setListEntryDoneAt(id);
  }

  /** */
  async fixListEntries(id: number): Promise<void> {
  // list
    const lists = await this.listService.getLists();
    const list = lists.find(itr => itr.id === id);
    if (!list) {
      throw new Error(`Attempt to fix an unknown list ${id}`);
    }

  // entries
    const allEntries = await this.getListEntries();
    const listEntries = list.listEntryIds.map(entryId => {
      return allEntries.find(itr => itr.id === entryId);
    });

  // sort
    const pendingEntries = listEntries.filter(itr => !itr.doneAt);
    const doneEntries = listEntries.filter(itr => !!itr.doneAt);
    const newListEntries = [...pendingEntries, ...doneEntries];

  // update & store
    list.listEntryIds = newListEntries.map(itr => itr.id);
    await this.appState.set({
      [ListAppStateKeys.Lists]: [...lists],
    });

  // log
    Log.i(`Fixed list entries of list ${id}`);
  }  
}