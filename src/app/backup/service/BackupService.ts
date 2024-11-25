import { BusEvent, BusListener, Service } from '@andcreations/common';

import { Log } from '../../log';
import {
  AppStateBusEvents,
  AppStateChangedBusEvent,
  AppStateService,
  AppStateValues,
} from '../../state';
import { SettingsService } from '../../setting';
import { BackupContent } from '../model';
import { BackupProviderService } from './BackupProviderService';

/** */
export interface BackupListener {
  /** */
  backupStarted: () => void;

  /** */
  backupFailed: () => void;

  /** */
  backupFinished: () => void;
}

/** */
@BusListener()
@Service()
export class BackupService {
  /** The app state keys/values which are not backed up */
  private static readonly EXCLUDE_APP_STATE_KEYS = [
  // don't back up settings as they contain sensitive data
    SettingsService.APP_STATE_SETTINGS_KEY,
  ];

  /** */
  private isDirty = false;

  /** */
  private backupRunning = false;

  /** */
  private readonly listeners: BackupListener[] = [];

  /** */
  constructor(
    private readonly appState: AppStateService,
    private readonly backupProviderService: BackupProviderService,
  ) {}

  /** */
  addListener(listener: BackupListener): void {
    this.listeners.push(listener);
  }

  /** */
  removeListener(listener: BackupListener): void {
    const index = this.listeners.indexOf(listener);
    if (index >= 0) {
      this.listeners.splice(index, 1);
    }
  }

  /** */
  @BusEvent(AppStateBusEvents.AppStateChanged)
  async appStateChanged(event: AppStateChangedBusEvent): Promise<void> {
  // check if the changes qualify to backup
    const changedKeys = Object.keys(event.values);
    const containsKeysToBackup = changedKeys.some(changedKey => {
      return !BackupService.EXCLUDE_APP_STATE_KEYS.includes(changedKey);
    });
    if (!containsKeysToBackup) {
      Log.d(
        `Backup skipped as the changed keys don't contain keys to backup, ` +
        `changed keys: [${changedKeys.join(',')}]`,
      );
      return;
    }

  // run backup
    Log.d('App state changed');
    this.isDirty = true;
    this.runBackup();
  }

  /** */
  private createSnapshot(): AppStateValues {
    const snapshot = this.appState.createSnapshot();
    return Object.keys(snapshot).reduce(
      (values, key) => {
        if (!BackupService.EXCLUDE_APP_STATE_KEYS.includes(key)) {
          values[key] = snapshot[key];
        }
        return values;
      },
      {},
    );
  }

  /** */
  private async backup(values: AppStateValues): Promise<void> {
  // content
    const content: BackupContent = {
      backedUpAt: new Date().toISOString(),
      appState: values,
    };

    let lastError;
  // backup
    for (const provider of this.backupProviderService.getProviders()) {
      try {
        await provider.backupContent(content);
      } catch (error) {
        lastError = error;
      }
    }

  // If one provider fails, maybe another will succeed.
  // That's why the last error is thrown.
    if (lastError) {
      throw lastError;
    }
  }

  /** */
  private async runBackup(): Promise<void> {
    if (!this.isDirty) {
      Log.d('Skipping backup as not dirty')
      return;
    }
    if (this.backupRunning) {
      Log.d('Skipping backup as already running')
      return;
    }

    try {
    // notify started
      this.listeners.forEach(listener => listener.backupStarted());

      this.backupRunning = true;
      this.isDirty = false;
    // backup
      await this.backup(this.createSnapshot());

    // notify finished
      this.listeners.forEach(listener => listener.backupFinished());
    } catch (error) {
      Log.e('Failed to backup', error);
      this.listeners.forEach(listener => listener.backupFailed());
    } finally {
      this.backupRunning = false;
      this.runBackup();
    }
  }
}