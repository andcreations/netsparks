/** */
export interface SettingsChangedBusEvent<T = any> {
  /** */
  key: string;

  /** */
  value: T;
}