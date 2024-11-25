import { LinkModel } from '../../link';

/** */
export interface ListEntryModel {
  /** */
  id: number;

  /** */
  title: string;

  /** */
  notes?: string;

  /** */
  links?: LinkModel[];

  /** Milliseconds since the epoch. */
  createdAt: number;

  /** Milliseconds since the epoch. */
  doneAt?: number;
}

/** */
export type EditableListEntryModel = Pick<
  ListEntryModel,
  | 'title'
  | 'links'
  | 'notes'
>;