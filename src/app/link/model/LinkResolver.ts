import { LinkModel } from '../model';

/** */
export interface LinkResolver {
  /** */
  resolveLink(label: string): LinkModel | undefined;

  /** */
  canResolve(label: string): boolean;
}