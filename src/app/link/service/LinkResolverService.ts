import { Service } from '@andcreations/common';
import { LinkResolver } from '../model';

/** */
@Service()
export class LinkResolverService {
  /** */
  private resolvers: LinkResolver[] = [];

  /** */
  addResolver(resolver: LinkResolver) {
    this.resolvers.push(resolver);
  }  

  /** */
  getResolvers(): LinkResolver[] {
    return [...this.resolvers];
  }
}