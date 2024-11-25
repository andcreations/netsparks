import { IoC } from '@andcreations/common'

import { LinkModel, RegexLinkResolverService } from '../link';
import { ListService, ListEntryService } from '../list'
import { SettingsService } from '../setting';
import { BookmarksService } from '../bookmark/service';
import { BookmarkModel } from '../bookmark/model';

/** */
const listService = IoC.resolve(ListService);
const listEntryService = IoC.resolve(ListEntryService);
const settingsService = IoC.resolve(SettingsService);
const regexLinkResolverService = IoC.resolve(RegexLinkResolverService);
const bookmarksService = IoC.resolve(BookmarksService);

/** */
const dev = {
// list + list entry
  getLists: async () => {
    const lists = await listService.getLists();
    const entries = await listEntryService.getListEntries();
    lists.forEach(list => {
      console.log(`${list.id}: ${list.name}`);
      const listEntries = list.listEntryIds.map(entryId => {
        return entries.find(itr => itr.id === entryId);
      })
      listEntries.forEach(entry => {
        console.log(`  ${entry.id}: ${entry.title}${entry.doneAt ? ' [done]' : ''}`);
      })
    });
  },
  createList: async (name: string) => {
    return listService.createList({ name })
  },
  deleteList: async (id: number) => {
    return listService.deleteList(id);
  },
  createListEntry: async (
    listId: number,
    title: string,
    options: {
      links?: LinkModel[];
    },
  ) => {
    return listEntryService.createListEntry(listId, { title, ...options });
  },
  deleteListEntry: async (id: number) => {
    return listEntryService.deleteListEntry(id);
  },
  fixListEntries: async (id: number) => {
    return listEntryService.fixListEntries(id);
  },

// settings
  setSettings: async (key: string, values: any) => {
    return settingsService.set(key, values);
  },

// links
  createRegexLinkResolverEntry: async (regex: string, url: string) => {
    return regexLinkResolverService.createEntry({ regex, url });
  },

// bookmarks
  createBookmark: async (bookmark: BookmarkModel) => {
    if (!bookmark.label) {
      throw new Error('Missing label in bookmark');
    }
    if (!bookmark.url) {
      throw new Error('Missing URL in bookmark');
    }
    return bookmarksService.createBookmark(bookmark);
  }
}

/** */
export function initDev() {
  console.log('Initializing dev');
  global.dev = dev;
}