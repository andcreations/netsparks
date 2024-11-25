import { Dropbox } from 'dropbox';
import {
  BusEvent,
  BusListener,
  OnBootstrap,
  Service,
} from '@andcreations/common';

import { Log } from '../../log';
import {
  SettingsBusEvents,
  SettingsChangedBusEvent,
  SettingsService,
} from '../../setting';
import {
  DROPBOX_BACKUP_SETTINGS_KEY,
  DropboxBackupSettingsModel,
  BackupProvider,
  BackupContent,
} from '../model';
import { BackupProviderService } from './BackupProviderService';

/** */
@Service()
@BusListener()
export class DropboxBackupService
  implements OnBootstrap, BackupProvider
{
  /** */
  private static readonly DEFAULT_FILE_NAME = 'netsparks-backup';

  /** */
  private dropbox: Dropbox;

  /** The path to the backup file. */
  private filePath: string;
  
  /** */
  constructor(
    private readonly settingsService: SettingsService,
    private readonly backupProviderService: BackupProviderService,
  ) {}

  /** */
  async onBootstrap(): Promise<void> {
  // register provider
    this.backupProviderService.registerProvider(this);

  // create client
    const settings = await this.settingsService.get<DropboxBackupSettingsModel>(
      DROPBOX_BACKUP_SETTINGS_KEY,
    );
    await this.createClient(settings);
  }

  /** */
  private async createClient(
    settings?: DropboxBackupSettingsModel,
  ): Promise<void> {
    if (!settings || !settings.enabled) {
      delete this.dropbox;
      return;
    }

  // path
    this.filePath =
      settings.path + '/' +
      (settings.fileName ?? DropboxBackupService.DEFAULT_FILE_NAME);

  // create
    Log.d(`Creating Dropbox client for backup, path: ${this.filePath}`);
    this.dropbox = new Dropbox({
      accessToken: settings.accessToken,
      customHeaders: {
        
      }
    });
  }

  /** */
  @BusEvent(SettingsBusEvents.SettingsChanged)
  async settingsChanged(event: SettingsChangedBusEvent): Promise<void> {
    if (event.key !== DROPBOX_BACKUP_SETTINGS_KEY) {
      return;
    }
    await this.createClient(event.value as DropboxBackupSettingsModel);
  }

  /** */
  async backupContent(content: BackupContent): Promise<void> {
    if (!this.dropbox) {
      return;
    }

    Log.d('Uploading backup to Dropbox');
  // upload
    try {
      await this.dropbox.filesUpload(
        {
          path: this.filePath,
          contents: JSON.stringify(content),
          mode: {
            '.tag': 'overwrite'
          },
        },
      );
      Log.d('Successfully uploaded backup to Dropbox');
    } catch (error) {
      Log.e('Failed to upload backup to Dropbox', error);
      throw error;
    }
  }
}