import * as _ from 'lodash';
import { Service } from '@andcreations/common';

import { BusService } from '../../bus';
import { AppStateService, SettingsValues } from '../../state';
import { SettingsBusEvents, SettingsChangedBusEvent } from '../bus';


/** */
@Service()
export class SettingsService {
  /** */
  public static readonly APP_STATE_SETTINGS_KEY = 'settings';

  /** */
  private readonly settings: SettingsValues = {};

  /** */
  constructor(
    private readonly bus: BusService,
    private readonly appState: AppStateService,
  ) {}

  /** */
  async set(key: string, value: any): Promise<{ changed: boolean }> {
  // compare
    if (_.isEqual(value, this.settings[key])) {
      return { changed: false };
    }

  // set & store
    this.settings[key] = value;
    await this.appState.set({
      [SettingsService.APP_STATE_SETTINGS_KEY]: this.settings,
    });

  // emit event
    await this.bus.emit<SettingsChangedBusEvent>(
      SettingsBusEvents.SettingsChanged,
      { key, value },
    );

    return { changed: true };
  }

  /** */
  async get<T>(key: string, defaultValue?: T): Promise<T | undefined> {
    const keys = Object.keys(this.settings);
  // get from the app state if empty
    if (keys.length === 0) {
      const settingsFromAppState = await this.appState.get(
        SettingsService.APP_STATE_SETTINGS_KEY,
        {},
      );
      Object.keys(settingsFromAppState).forEach(key => {
        this.settings[key] = settingsFromAppState[key];
      });
    }

  // get settings
    const settings = this.settings[key];
    return settings !== undefined ? settings : defaultValue;
  }
}