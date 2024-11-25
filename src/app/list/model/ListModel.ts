/** */
export interface ListModel {
  /** */
  id: number;

  /** */
  name: string;

  /** The order in which list entries are arranged. */
  listEntryIds: number[];

  /** Milliseconds since the epoch. */
  createdAt: number;

  /** Indicates if to show list entries which are done. */
  showDone?: boolean;
}