import { AppStateValues } from '../../state';

/** */
export interface BackupContent {
  /** */
  backedUpAt: string;

  /** */
  appState: AppStateValues;
}