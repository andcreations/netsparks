import { BackupContent } from './BackupContent';

/** */
export interface BackupProvider {
  /** */
  backupContent(content: BackupContent): Promise<void>;
}