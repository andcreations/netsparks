import {
  BusEvent,
  BusListener,
  OnBootstrap,
  Service,
} from '@andcreations/common';

import { deleteMatchingFromArray } from '../../util';
import { Log } from '../../log';
import {
  AppStateBusEvents,
  AppStateChangedBusEvent,
  AppStateService,
} from '../../state';
import { LinkModel, LinkResolver, RegexLinkResolverEntry } from '../model';
import { LinkStateKeys } from '../state';
import { LinkResolverService } from './LinkResolverService';

/** */
@Service()
@BusListener()
export class RegexLinkResolverService implements OnBootstrap, LinkResolver {
  /** */
  private entries: RegexLinkResolverEntry[] = [];

  /** */
  constructor(
    private readonly appState: AppStateService,
    private readonly linkResolverService: LinkResolverService,
  ) {}

  /** */
  async onBootstrap(): Promise<void> {
    this.entries = await this.getEntriesFromState();
    this.linkResolverService.addResolver(this);
  }

  /** */
  private async getEntriesFromState(): Promise<RegexLinkResolverEntry[]> {
    return this.appState.get<RegexLinkResolverEntry[]>(
      LinkStateKeys.RegexLinkResolverEntries,
      [],
    );
  }

  /** */
  getEntries(): RegexLinkResolverEntry[] {
    return this.entries;
  }

  /** */
  async createEntry(entry: Omit<RegexLinkResolverEntry, 'id'>): Promise<void> {
  // get current entries
    const entries = await this.getEntriesFromState();
    const maxId = entries.length ? Math.max(...entries.map(itr => itr.id)) : 0;

  // add & store
    const newEntry: RegexLinkResolverEntry = {
      ...entry,
      id: maxId + 1,
    };
    await this.appState.set({
      [LinkStateKeys.RegexLinkResolverEntries]: [...entries, newEntry],
    });
  }

  /** */
  async updateEntry(
    id: number,
    updates: Partial<Omit<RegexLinkResolverEntry, 'id'>>,
  ): Promise<void> {
    Log.i(
      `Updating regex link resolver entry ${id} with values:` +
      `${JSON.stringify(updates)}`
    );

    const entries = this.getEntries();
  // find entry
    const entry = entries.find(itr => itr.id === id);
    if (!entry) {
      Log.e('Attempt to update an unknown regex link resolver entry');
      return;
    }

  // update
    Object.keys(updates).forEach(key => entry[key] = updates[key]);
    await this.appState.set({
      [LinkStateKeys.RegexLinkResolverEntries]: entries,
    }); 
  }

  /** */
  async deleteEntry(id: number): Promise<void> {
    Log.d(`Deleting link resolver entry of identifier ${id}`);

  // entries
    const entries = this.getEntries();

  // delete & store
    const newEntries = deleteMatchingFromArray(
      entries,
      (entry) => entry.id == id,
    );
    await this.appState.set({
      [LinkStateKeys.RegexLinkResolverEntries]: newEntries,
    }); 
  }

  /** */
  private matchEntry(
    label: string,
    entry: RegexLinkResolverEntry,
  ): LinkModel | undefined {
    const regex = new RegExp(entry.regex);
  // match
    const match = label.match(regex);
    if (match == null) {
      return;
    }

  // replace
    let url = entry.url;
    for (let index = 1; index < match.length; index++) {
      url = url.replace(`{${index}}`, match[index]);
    }
    return { label, url };
  }

  /** */
  resolveLink(label: string): LinkModel | undefined {
    for (const entry of this.entries) {
      const link = this.matchEntry(label, entry);
      if (link) {
        return link;
      }
    }
  }

  /** */
  canResolve(label: string): boolean {
    return !!this.resolveLink(label);
  }

  /** */
  @BusEvent(AppStateBusEvents.AppStateChanged)
  async appStateChanged(event: AppStateChangedBusEvent): Promise<void> {
    const { values } = event;
    if (!!values[LinkStateKeys.RegexLinkResolverEntries]) {
      const raw = values[LinkStateKeys.RegexLinkResolverEntries];
      this.entries = raw as RegexLinkResolverEntry[];
    }
  }
}