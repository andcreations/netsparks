import { Service } from '@andcreations/common';
import { LinkModel, LinkResolver } from '../model';
import { LinkResolverService } from './LinkResolverService';

@Service()
export class LinkService {
  /** */
  constructor(private readonly linkResolverService: LinkResolverService) {
  }

  /** */
  linksToText(links?: LinkModel[]): string {
    if (!links?.length) {
      return '';
    }
    return links
      .map(link => `${link.label} | ${link.url}`)
      .join('\n');
  }

  /** */
  buildLinkFromLine(line: string): LinkModel {
    const values = line.split('|').map(value => value.trim());

  // label and url given
    if (values.length === 2) {
      return {
        label: values[0],
        url: values[1],
      }
    }

  // need to resolve if just label give
    if (values.length === 1) {
      const resolvers = this.linkResolverService.getResolvers();
      for (const resolver of resolvers) {
        if (resolver.canResolve(values[0])) {
          return resolver.resolveLink(values[0]);
        }
      }
    }

    throw new Error('Failed to build link from text');
  }

  /** */
  buildLinksFromText(text: string): LinkModel[] {
    const lines = text.split('\n');
    const links: LinkModel[] = [];

    lines.forEach((line, index) => {
      if (!line.trim().length) {
        return;
      }

      try {
        links.push(this.buildLinkFromLine(line));
      } catch (error) {
        throw new Error(`Invalid link in line ${index + 1}`);
      }
    });

    return links;
  }
}