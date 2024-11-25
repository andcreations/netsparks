/** */
export const DROPBOX_BACKUP_SETTINGS_KEY = 'dropboxBackup';

/** */
export interface DropboxBackupSettingsModel {
  /** */
  enabled: boolean;

  /** */
  accessToken: string;

  /** The path to the directory. */
  path: string;

  /** The file name. */
  fileName?: string;
}