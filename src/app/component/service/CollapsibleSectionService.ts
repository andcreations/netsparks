import { Service } from '@andcreations/common';
import { SettingsService } from '../../setting';

/** */
type Entry = {
  /** */
  collapsed: boolean;
}

/** */
type Settings = { [id: string]: Entry };

/** */
@Service()
export class CollapsibleSectionService {
  /** */
  private static readonly SETTINGS_KEY = 'collapsibleSections'

  /** */
  constructor(private readonly settingsService: SettingsService) {
  }

  /** */
  async isCollapsed(id?: string): Promise<boolean> {
    if (!id) {
      return false;
    }
    const settings = await this.settingsService.get<Settings>(
      CollapsibleSectionService.SETTINGS_KEY,
      {}
    );
    return settings[id]?.collapsed ?? false;
  }

  /** */
  async setCollapsed(
    id: string | undefined,
    collapsed: boolean,
  ): Promise<void> {
    if (!id) {
      return;
    }

  // get
    const settings = await this.settingsService.get<Settings>(
      CollapsibleSectionService.SETTINGS_KEY,
      {}
    );

  // update
    const { changed } = await this.settingsService.set(
      CollapsibleSectionService.SETTINGS_KEY,
      {
        ...settings,
        [id]: {
          ...(settings[id] ?? {}),
          collapsed,
        },
      },
    );
  }
}