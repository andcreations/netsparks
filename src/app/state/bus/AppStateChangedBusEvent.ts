import { AppStateValues } from '../model';

/** */
export interface AppStateChangedBusEvent {
  /** */
  values: AppStateValues;
}